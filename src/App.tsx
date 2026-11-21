import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { LazyMotion, domAnimation } from 'motion/react'
import { Demo, START_EVENT } from './Demo.tsx'
import { FocusFilter, Measure, MiniDial, SyncPair, TempoList, Week } from './Fragments.tsx'
import { TEMPOS } from './dial.ts'

// Entrance props: heading, then text, then picture, staggered by --i.
const rv = (i = 0) => ({ 'data-rv': '', style: { '--i': i } as CSSProperties })

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-rv]')
    if (!('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('in'))
    const io = new IntersectionObserver(
      (list) =>
        list.forEach((l) => {
          if (l.isIntersecting) {
            l.target.classList.add('in')
            io.unobserve(l.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
}

const FEATURES = [
  {
    h: 'Four tempos, four names.',
    p: ['Largo is 50 minutes, Andante 25, Allegro 15, Presto 5. Say the word instead of doing the sum.', 'Need something else? Any length from 5 to 60 minutes, named whatever you like.'],
    ui: <TempoList />,
  },
  {
    h: 'Rests that keep the beat.',
    p: ['Every session is one beat. Four beats make a measure, and the fourth rest is the long one: 20 minutes by default.', 'The rest starts by itself. Skip it if you must; Tempo just keeps count.'],
    ui: <Measure />,
  },
  {
    h: 'Time left, always in view.',
    p: ['On the Mac it sits next to the clock in the menu bar. On iPhone it lives on the Lock Screen.', 'Start on one, glance at the other. Sync runs through your own iCloud, so there is no account to make.'],
    ui: <SyncPair />,
  },
  {
    h: 'Silence, on request.',
    p: ['Starting a session switches on a Focus filter you choose. Messages and chat wait for the rest.', 'Your calendar still gets through for the next ten minutes, so the meeting is not a surprise.'],
    ui: <FocusFilter />,
  },
  {
    h: 'A week, counted in beats.',
    p: ['Sessions, minutes and the hour you hold your pace best. Nothing to chase, no streak to lose.', 'The numbers are calculated and kept on your device.'],
    ui: <Week />,
  },
]

const MEANING = [
  ['Largo', 'Slow and broad', 'Deep work: writing, design, the hard problem.'],
  ['Andante', 'At a walking pace', 'The classic pomodoro length, with a better name.'],
  ['Allegro', 'Quick and lively', 'Email, review, the small jobs that pile up.'],
  ['Presto', 'Very fast', 'One task you have been putting off. Five minutes, go.'],
]

const STEPS = [
  { lead: 'To begin,', body: 'pick a tempo or drag the dial to the time you actually have. Anything from 5 to 60 minutes, and a flick of the wrist lands it on the nearest five.', dial: { m: 25, label: 'Andante', sub: 'minutes, your call' } },
  { lead: 'While you work,', body: 'the dial empties by the second. Your Focus filter is on, the menu bar shows what is left, and nothing else asks for you.', dial: { m: 14, label: 'Focus', sub: 'Andante · beat 2 of 4' } },
  { lead: 'When it ends,', body: 'a soft chime, and the rest begins on its own. Five minutes, or twenty after the fourth beat. Stand up; the timer has it.', dial: { m: 5, label: 'Rest', sub: 'Beat 2 of 4 done' } },
  { lead: 'By Friday,', body: 'the week shows how many beats you held and when you were at your best. It is a quiet number, not a score to beat.', dial: { m: 20, label: 'Long rest', sub: 'Beat 4 of 4 done' } },
]

const PLANS = [
  { name: 'Solo', price: '$0', per: 'forever', text: 'The four tempos and the full dial on one device. Rests, beat count and the Focus filter included. No account, no trial clock.', cta: 'Get Solo' },
  { name: 'Duet', price: '$4', per: 'a month', text: 'Mac and iPhone in step, your own named tempos, the weekly view and a Lock Screen live timer. Or $36 for the year.', cta: 'Get Duet' },
  { name: 'Ensemble', price: '$7', per: 'a month', text: 'Everything in Duet for up to five people, plus shared sessions: start a beat and the others in your room join in.', cta: 'Get Ensemble' },
]

const FAQ = [
  ['Is Tempo free?', 'Solo is free with no time limit: four tempos, the dial and the rests on one device. Duet adds sync between Mac and iPhone, custom tempos and the weekly view.'],
  ['Which devices does it run on?', 'Mac with macOS 14 or later, and iPhone with iOS 17 or later. There is no Windows or Android version yet.'],
  ['Where does my data live?', 'On your devices. Sync goes through your own iCloud account, and there is no Tempo account or server to sign up for.'],
  ['Can I change the lengths?', 'Yes. Sessions run from 5 to 60 minutes and rests from 1 to 30. Name your own tempos and they appear next to the four classics.'],
  ['Does it block apps or websites?', 'No. It turns on a Focus filter you set up, so notifications wait. Tempo never takes control of your Mac or your phone.'],
  ['What if I close the lid mid-session?', 'The clock runs on timestamps, not ticks, so it is right when you come back. You see how much was left and carry on or end the beat.'],
]

export default function App() {
  useReveal()
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <LazyMotion features={domAnimation}>
        <Hero />
      </LazyMotion>
      <main id="main">
        <Features />
        <Band />
        <Names />
        <Story />
        <Pricing />
        <Faq />
      </main>
      <Begin />
      <Footer />
    </>
  )
}

function Hero() {
  return (
    <header className="hero" id="top">
      <nav className="nav" aria-label="Main">
        <a className="wordmark" href="#top">Tempo</a>
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a className="btn" href="#begin">Download</a>
      </nav>

      <div className="hero-body">
        <div className="monument monument-v" aria-hidden="true"><span>Tempo</span></div>
        <div className="hero-copy">
          <h1 {...rv(0)}>Focus, set to a tempo.</h1>
          <p className="lead" {...rv(1)}>
            Tempo is a focus timer for Mac and iPhone. Pick a tempo, drag the dial to the time you have, and let the rests keep the beat.
          </p>
          <div className="actions" {...rv(2)}>
            <button type="button" className="btn btn-big" onClick={() => window.dispatchEvent(new Event(START_EVENT))}>
              Start a session
            </button>
            <a className="link" href="#begin">Download Tempo<span aria-hidden="true"> →</span></a>
          </div>
        </div>
        <div className="hero-demo" {...rv(1)}>
          <Demo />
        </div>
      </div>

    </header>
  )
}

function Features() {
  return (
    <section className="features" id="features" aria-labelledby="features-h">
      <h2 id="features-h" {...rv(0)}>What Tempo does</h2>
      <ul>
        {FEATURES.map((f) => (
          <li className="feature" key={f.h}>
            <div className="feature-ui" {...rv(0)}>{f.ui}</div>
            <div className="feature-text">
              <h3 {...rv(1)}>{f.h}</h3>
              {f.p.map((t) => <p key={t} {...rv(2)}>{t}</p>)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Clip() {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (v && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.removeAttribute('autoplay')
      v.pause() // the poster frame stands in for the loop
    }
  }, [])
  return (
    <video ref={ref} autoPlay muted loop playsInline preload="metadata" poster="img/metronome-poster.jpg" width="854" height="480"
      aria-label="A black mechanical metronome on a wooden table, its pendulum arm swinging in front of a scale that names the tempos from Largo to Presto">
      <source src="img/metronome.webm" type="video/webm" />
    </video>
  )
}

function Band() {
  return (
    <figure className="band" {...rv(0)}>
      <img src="img/manuscript.jpg" width="1800" height="721" loading="lazy" decoding="async"
        alt="A torn strip of handwritten music manuscript, four staves in ink on aged paper, with a line of lyrics beneath the notes" />
      <figcaption>Handwritten music, on paper that has outlasted its tune. Smithsonian, CC0.</figcaption>
    </figure>
  )
}

function Names() {
  return (
    <section className="names" aria-labelledby="names-h">
      <figure className="names-photo" {...rv(0)}>
        <Clip />
        <figcaption>A mechanical metronome ticking at 96 beats per minute. Its scale already names the tempos. Video: Daniel Eriksson, CC BY 4.0.</figcaption>
      </figure>
      <div className="names-body">
        <h2 id="names-h" {...rv(0)}>Four words instead of a number.</h2>
        <p className="names-lead" {...rv(1)}>
          Musicians have named speed with a word for centuries, and a word is easier to feel than a figure. Tempo borrows the vocabulary for the working day.
        </p>
        <dl className="names-list">
          {MEANING.map(([n, f, use], i) => (
            <div key={n} {...rv(i + 2)}>
              <dt>{n}</dt>
              <dd><b>{TEMPOS[i].min} min. {f}.</b> {use}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Story() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (list) => list.forEach((l) => l.isIntersecting && setActive(Number((l.target as HTMLElement).dataset.i))),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((e) => e && io.observe(e))
    return () => io.disconnect()
  }, [])
  const d = STEPS[active].dial
  return (
    <section className="story" aria-labelledby="story-h">
      <div className="story-stage">
        <h2 id="story-h" {...rv(0)}>How a session goes</h2>
        <div className="story-dial" key={active}>
          <MiniDial minutes={d.m} label={d.label} sub={d.sub} />
        </div>
      </div>
      <ol className="story-steps">
        {STEPS.map((s, i) => (
          <li key={s.lead} data-i={i} ref={(el) => { refs.current[i] = el }} className={i === active ? 'on' : ''}>
            <p>
              <b>{s.lead}</b> {s.body}
            </p>
            <div className="story-inline" aria-hidden="true"><MiniDial minutes={s.dial.m} label={s.dial.label} sub={s.dial.sub} /></div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Stage({ p }: { p: (typeof PLANS)[number] }) {
  return (
    <div className="stage">
      <p className="stage-price"><span>{p.price}</span><small>{p.per}</small></p>
      <p className="stage-text">{p.text}</p>
      <a className="btn btn-big" href="#begin">{p.cta}</a>
    </div>
  )
}

function Pricing() {
  const [sel, setSel] = useState(1)
  return (
    <section className="pricing" id="pricing" aria-labelledby="pricing-h">
      <h2 id="pricing-h" {...rv(0)}>Pricing</h2>
      <div className="pricing-grid">
        <ul className="plans" {...rv(1)}>
          {PLANS.map((p, i) => (
            <li key={p.name} className={i === sel ? 'sel' : ''}>
              <button type="button" aria-expanded={i === sel} onClick={() => setSel(i)} onFocus={() => setSel(i)}>
                <span className="dot" aria-hidden="true" />
                {p.name}
              </button>
              <div className="stage-m" hidden={i !== sel}><Stage p={p} /></div>
            </li>
          ))}
        </ul>
        <div className="stage-d" aria-live="polite" {...rv(2)}>
          <div key={sel} className="swap"><Stage p={PLANS[sel]} /></div>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-h">
      <div className="faq-row"><h2 id="faq-h" {...rv(0)}>Questions</h2></div>
      {FAQ.map(([q, a]) => (
        <div className="faq-row" key={q}>
          <h3 {...rv(0)}>{q}</h3>
          <p {...rv(1)}>{a}</p>
        </div>
      ))}
    </section>
  )
}

function Begin() {
  return (
    <section className="begin" id="begin" aria-label="Download">
      <a href="mailto:hello@tempo.example?subject=Tempo%20for%20Mac%20and%20iPhone&body=Send%20me%20the%20download%20link.">
        <span className="begin-say">Free on Mac and iPhone. Your first beat is five minutes away.</span>
        <svg className="begin-arrow" viewBox="0 0 48 48" aria-hidden="true"><path d="M12 36 36 12M16 12h20v20" fill="none" stroke="currentColor" strokeWidth="3.5" /></svg>
        <span className="begin-word">Begin</span>
      </a>
    </section>
  )
}

function Footer() {
  return (
    <footer className="foot">
      <div className="foot-top">
        <div>
          <p className="foot-invite">Keep your<br />own tempo.</p>
          <a className="btn btn-big btn-dark" href="#begin">Download Tempo</a>
        </div>
        <ul className="foot-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="https://github.com/DadoNitz/tempo-landing">Source on GitHub</a></li>
          <li><a href="https://github.com/DadoNitz">Eduardo Nitz</a></li>
        </ul>
      </div>
      <div className="foot-credits">
        <p>Tempo is a fictional product, a front-end portfolio project. Prices and features are made up.</p>
        <p>
          Media: metronome video by Daniel Eriksson (<a href="https://commons.wikimedia.org/wiki/File:Metronome.webm">CC BY 4.0</a>);
          music manuscript, Smithsonian (<a href="https://n2t.net/ark:/65665/ng49ca746aa-a940-704b-e053-15f76fa0b4fa">CC0</a>).
        </p>
      </div>
      <div className="monument monument-foot" aria-hidden="true"><span>Tempo</span></div>
    </footer>
  )
}
