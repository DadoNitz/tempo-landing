import { TEMPOS, clock } from './dial.ts'

// Small, exact pieces of the Tempo interface. Each root carries data-ui: it is product UI, not page decoration.

export function MiniDial({ minutes, label, sub }: { minutes: number; label: string; sub: string }) {
  const r = 138
  const c = 2 * Math.PI * r
  return (
    <div className="mini" data-ui role="img" aria-label={`${label}, ${clock(minutes * 60)} left. ${sub}`}>
      <svg viewBox="0 0 360 360" aria-hidden="true">
        <circle className="track" cx="180" cy="180" r={r} />
        <circle
          className="arc"
          cx="180" cy="180" r={r}
          transform="rotate(-90 180 180)"
          strokeDasharray={`${(minutes / 60) * c} ${c}`}
        />
        <g transform={`rotate(${minutes * 6} 180 180)`}>
          <circle className="knob" cx="180" cy="42" r="15" />
        </g>
      </svg>
      <div className="mini-text">
        <p className="mini-label">{label}</p>
        <p className="mini-digits">{clock(minutes * 60)}</p>
        <p className="mini-sub">{sub}</p>
      </div>
    </div>
  )
}

export function TempoList() {
  return (
    <div className="frag" data-ui>
      <ul className="frag-chips">
        {TEMPOS.map((t) => (
          <li key={t.name} className={t.name === 'Andante' ? 'sel' : ''}>
            <b>{t.name}</b>
            <span>{t.min} min</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Measure() {
  const rows: [string, number, boolean][] = [
    ['Focus', 25, true], ['Rest', 5, false], ['Focus', 25, true], ['Rest', 5, false],
    ['Focus', 25, true], ['Rest', 5, false], ['Focus', 25, true], ['Long rest', 20, false],
  ]
  return (
    <div className="frag" data-ui>
      <ol className="frag-measure" aria-label="One measure: four focus beats, then a long rest">
        {rows.map(([n, m, f], i) => (
          <li key={i} className={f ? 'focus' : 'rest'} style={{ flexGrow: m }} title={`${n} ${m} min`}>
            <span>{m}</span>
          </li>
        ))}
      </ol>
      <p className="frag-note">One measure: 4 × 25 focus, 3 × 5 rest, 1 × 20 long rest. 2 h 15 min.</p>
    </div>
  )
}

export function SyncPair() {
  return (
    <div className="frag frag-sync" data-ui>
      <div className="sync-mac">
        <span>Tempo</span>
        <span className="sync-time"><i className="live" />18:42</span>
      </div>
      <div className="sync-phone">
        <span className="sync-tempo">Andante</span>
        <span className="sync-time">18:42</span>
        <span className="sync-bar"><i style={{ width: '25%' }} /></span>
      </div>
    </div>
  )
}

export function FocusFilter() {
  const rows: [string, string][] = [['Messages', 'Held'], ['Slack', 'Held'], ['Mail', 'Held'], ['Calendar', 'Next 10 min only']]
  return (
    <div className="frag" data-ui>
      <ul className="frag-list">
        {rows.map(([a, s]) => (
          <li key={a}>
            <span>{a}</span>
            <span className={s === 'Held' ? 'muted' : 'allow'}>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const WEEK: [string, number][] = [['Mon', 4], ['Tue', 6], ['Wed', 5], ['Thu', 3], ['Fri', 7], ['Sat', 2], ['Sun', 1]]
export function Week() {
  const max = 7
  const total = WEEK.reduce((a, [, n]) => a + n, 0)
  return (
    <div className="frag" data-ui>
      <ul className="frag-week" aria-label="Beats per day this week">
        {WEEK.map(([d, n]) => (
          <li key={d}>
            <b>{n}</b>
            <i style={{ height: `${(n / max) * 100}%` }} />
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <p className="frag-note">{total} beats, {(total * 25) / 60 | 0} h {(total * 25) % 60} min of focus</p>
    </div>
  )
}
