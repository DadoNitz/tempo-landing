// Pure helpers for the demo dial. Value unit: minutes (0–60 around the ring).
export const MIN = 5
export const MAX = 60
export const DETENT = 5

/** Where a flick would come to rest: exponential decay, the same model as scroll deceleration. */
export function project(velocity: number, rate = 0.998): number {
  return ((velocity / 1000) * rate) / (1 - rate)
}

/** Past a bound the element follows less and less, like a real rubber band. */
export function rubberband(overshoot: number, range = 12, c = 0.55): number {
  const o = Math.abs(overshoot)
  return Math.sign(overshoot) * ((o * range * c) / (range + c * o))
}

/** Pull a raw value into [MIN, MAX], with resistance beyond either end. */
export function resist(v: number, lo = MIN, hi = MAX): number {
  if (v < lo) return lo + rubberband(v - lo)
  if (v > hi) return hi + rubberband(v - hi)
  return v
}

export const snap = (v: number, step = DETENT, lo = MIN, hi = MAX) =>
  Math.min(hi, Math.max(lo, Math.round(v / step) * step))

/** Shortest signed angle difference in degrees, so crossing the top of the dial is continuous. */
export const angleDelta = (a: number, b: number) => ((((a - b) % 360) + 540) % 360) - 180

export const TEMPOS = [
  { name: 'Largo', min: 50, feel: 'Slow and broad' },
  { name: 'Andante', min: 25, feel: 'At a walking pace' },
  { name: 'Allegro', min: 15, feel: 'Quick and lively' },
  { name: 'Presto', min: 5, feel: 'Very fast' },
] as const

export const tempoFor = (min: number) =>
  TEMPOS.find((t) => t.min === Math.round(min))?.name ?? 'Custom'

export const clock = (seconds: number) => {
  const s = Math.max(0, Math.ceil(seconds))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
