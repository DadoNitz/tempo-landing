import { animate, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, motion } from 'motion/react'
import type { AnimationPlaybackControls } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MAX, MIN, TEMPOS, angleDelta, clock, project, resist, snap, tempoFor } from './dial.ts'

const REST = 5
const LONG_REST = 20
const SPEED = 30 // "demo speed" multiplier so a visitor can see a session finish

export const START_EVENT = 'tempo:start'

export function Demo() {
  const reduced = useReducedMotion()
  const mv = useMotionValue(25) // minutes remaining; the single source of truth
  const [len, setLen] = useState(25) // chosen focus length
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState<'focus' | 'rest'>('focus')
  const [beats, setBeats] = useState(0)
  const [fast, setFast] = useState(false)
  const [secs, setSecs] = useState(25 * 60)
  const [dragging, setDragging] = useState(false)

  const root = useRef<HTMLDivElement>(null)
  const dial = useRef<HTMLDivElement>(null)
  const spring = useRef<AnimationPlaybackControls | null>(null)
  const busy = useRef(false) // true while the finger or a spring owns the value
  const drag = useRef({ raw: 0, last: 0, detent: 0, hist: [] as { t: number; v: number }[] })
  const st = useRef({ running, phase, beats, len, fast })
  st.current = { running, phase, beats, len, fast }

  useMotionValueEvent(mv, 'change', (v) => {
    const s = Math.ceil(v * 60 - 1e-6)
    setSecs((p) => (p === s ? p : Math.max(0, s)))
  })
  const arc = useTransform(mv, (v) => Math.min(1, Math.max(0, v / 60)))
  const angle = useTransform(mv, (v) => v * 6)

  // Move the value with a spring that inherits the gesture's velocity (or jump, for reduced motion).
  const flyTo = useCallback(
    (to: number, velocity = 0, then?: () => void) => {
      spring.current?.stop()
      if (reduced) {
        mv.set(to)
        busy.current = false
        then?.()
        return
      }
      busy.current = true
      spring.current = animate(mv, to, {
        type: 'spring',
        velocity,
        bounce: Math.abs(velocity) > 8 ? 0.2 : 0, // overshoot only when a flick carried momentum
        duration: 0.5,
        onComplete: () => {
          busy.current = false
          then?.()
        },
      })
    },
    [mv, reduced],
  )

  const finishSegment = useCallback(() => {
    const { phase: ph, beats: b, len: l } = st.current
    if (ph === 'focus') {
      const n = b + 1
      setBeats(n)
      setPhase('rest')
      flyTo(n % 4 === 0 ? LONG_REST : REST)
    } else {
      setPhase('focus')
      setRunning(false)
      if (b >= 4) setBeats(0)
      flyTo(l)
    }
  }, [flyTo])

  // Countdown on timestamps, not ticks: accurate after a hidden tab or a slow frame.
  useEffect(() => {
    if (!running) return
    let raf = 0
    let prev = performance.now()
    const loop = (now: number) => {
      const dt = now - prev
      prev = now
      if (!busy.current) {
        const next = mv.get() - (dt * (st.current.fast ? SPEED : 1)) / 60000
        if (next <= 0) {
          mv.set(0)
          finishSegment()
        } else mv.set(next)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [running, mv, finishSegment])

  useEffect(() => {
    document.title = running ? `${clock(secs)} · Tempo` : 'Tempo: the focus timer for Mac and iPhone'
  }, [running, secs])

  const start = useCallback(() => {
    spring.current?.stop()
    busy.current = false
    if (mv.get() <= 0.01) mv.set(st.current.len)
    setRunning(true)
  }, [mv])

  useEffect(() => {
    const go = () => {
      root.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
      if (!st.current.running) start()
    }
    window.addEventListener(START_EVENT, go)
    return () => window.removeEventListener(START_EVENT, go)
  }, [reduced, start])

  const pick = (m: number) => {
    setRunning(false)
    setPhase('focus')
    setLen(m)
    flyTo(m)
  }
  const reset = () => {
    setRunning(false)
    setPhase('focus')
    setBeats(0)
    flyTo(len)
  }

  // ---- direct manipulation -------------------------------------------------
  const pointerAngle = (e: React.PointerEvent) => {
    const r = dial.current!.getBoundingClientRect()
    return (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI
  }
  const bounds = () => (st.current.running || st.current.phase === 'rest' ? ([0, MAX] as const) : ([MIN, MAX] as const))

  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    dial.current!.setPointerCapture(e.pointerId)
    spring.current?.stop() // grab a moving dial mid-flight: continue from where it is on screen
    busy.current = true
    const v = mv.get()
    drag.current = { raw: v, last: pointerAngle(e), detent: Math.floor(v / 5), hist: [{ t: performance.now(), v }] }
    setDragging(true)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!dragging) return
    const d = drag.current
    const a = pointerAngle(e)
    d.raw += angleDelta(a, d.last) / 6 // deltas keep the dial under the finger wherever it was grabbed
    d.last = a
    const [lo, hi] = bounds()
    const v = resist(d.raw, lo, hi)
    mv.set(v)
    const now = performance.now()
    d.hist.push({ t: now, v })
    while (d.hist.length > 2 && now - d.hist[0].t > 100) d.hist.shift()
    const det = Math.floor(v / 5)
    if (det !== d.detent) {
      d.detent = det
      navigator.vibrate?.(3)
    }
  }
  const onUp = () => {
    if (!dragging) return
    setDragging(false)
    const { hist } = drag.current
    const a = hist[0]
    const b = hist[hist.length - 1]
    const span = (b.t - a.t) / 1000
    const vel = span > 0.016 ? (b.v - a.v) / span : 0
    const [lo, hi] = bounds()
    const resting = Math.min(hi, Math.max(lo, mv.get() + project(vel)))
    const idle = !st.current.running && st.current.phase === 'focus'
    const target = idle ? snap(resting) : snap(resting, 1, lo === 0 ? 1 : lo, hi)
    flyTo(target, vel, () => idle && setLen(target))
    if (idle && reduced) setLen(target)
  }

  const onKey = (e: React.KeyboardEvent) => {
    const [lo, hi] = bounds()
    const step = running ? 1 : 5
    const keys: Record<string, number> = {
      ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: 5, PageDown: -5,
    }
    let to: number | undefined
    if (e.key in keys) to = Math.min(hi, Math.max(lo, snap(mv.get(), step, lo, hi) + keys[e.key]))
    else if (e.key === 'Home') to = lo
    else if (e.key === 'End') to = hi
    if (to === undefined) return
    e.preventDefault()
    const idle = !running && phase === 'focus'
    flyTo(to, 0, () => idle && setLen(to!))
    if (idle) setLen(to)
  }

  const label = phase === 'rest' ? (beats % 4 === 0 ? 'Long rest' : 'Rest') : running ? 'Focus' : tempoFor(len)
  const sub = phase === 'rest' ? `Beat ${beats} of 4 done` : running ? `${tempoFor(len)} · beat ${beats + 1} of 4` : 'minutes, your call'
  const mins = Math.floor(secs / 60)
  const mainLabel = running ? 'Pause' : secs < len * 60 || phase === 'rest' ? 'Resume' : 'Start'

  return (
    <div className="demo" ref={root}>
      <div className="menubar" data-ui aria-hidden="true">
        <span className="menubar-app">Tempo</span>
        <span className="menubar-clock">
          <i className={running ? 'live' : ''} />
          {clock(secs)}
        </span>
      </div>

      <section className="app" data-ui aria-label="Tempo timer demo">
        <div className="app-head">
          <p className="app-tempo" key={label} aria-live="polite">
            {label}
          </p>
          <p className="app-sub">{sub}</p>
        </div>

        <div
          ref={dial}
          className={`dial${dragging ? ' is-dragging' : ''}`}
          role="slider"
          tabIndex={0}
          aria-label="Time remaining"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={MAX}
          aria-valuenow={Math.round(mins)}
          aria-valuetext={`${mins} minutes ${secs % 60} seconds`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        >
          <svg viewBox="0 0 360 360" aria-hidden="true">
            <g className="ticks">
              {Array.from({ length: 60 }, (_, i) => (
                <line
                  key={i}
                  x1="180" y1={i % 5 ? 14 : 8} x2="180" y2="20"
                  className={i < Math.ceil(secs / 60) ? 'on' : ''}
                  transform={`rotate(${i * 6} 180 180)`}
                />
              ))}
            </g>
            <circle className="track" cx="180" cy="180" r="138" />
            <motion.circle className="arc" cx="180" cy="180" r="138" transform="rotate(-90 180 180)" style={{ pathLength: arc }} />
          </svg>
          <motion.div className="hand" style={{ rotate: angle }} aria-hidden="true">
            <span className="knob" />
          </motion.div>
          <div className="readout" aria-hidden="true">
            <output className="digits">{clock(secs)}</output>
          </div>
        </div>

        <ul className="chips" aria-label="Tempo">
          {TEMPOS.map((t) => (
            <li key={t.name}>
              <button type="button" className="chip" aria-pressed={!running && phase === 'focus' && len === t.min} onClick={() => pick(t.min)}>
                {t.name}
                <span>{t.min}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="controls">
          <button type="button" className="btn-main" onClick={() => (running ? setRunning(false) : start())}>
            {mainLabel}
          </button>
          <button type="button" className="btn-quiet" onClick={reset}>
            Reset
          </button>
          <button
            type="button"
            className="btn-quiet"
            aria-pressed={fast}
            aria-label={`Demo speed ×${SPEED}`}
            onClick={() => setFast((f) => !f)}
          >
            ×{SPEED}
          </button>
          <ol className="beats" aria-label={`${beats} of 4 beats done`}>
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className={i < beats ? 'done' : ''} />
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
