import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Reveal } from '../components/ui'
import { DEMO_HREF } from '../content'
import { useLang } from '../i18n'

const WEEKS = 45
const FTE_HOURS = 1600

const CURRENCIES = [
  { code: 'EUR', symbol: '€', rate: 40 },
  { code: 'USD', symbol: '$', rate: 45 },
  { code: 'TND', symbol: 'DT', rate: 35 },
]

function Animated({ value, format }) {
  const reduce = useReducedMotion()
  const mv = useMotionValue(value)
  const [shown, setShown] = useState(value)
  useEffect(() => {
    if (reduce) {
      setShown(value)
      return
    }
    const c = animate(mv, value, { duration: 0.6, ease: 'easeOut', onUpdate: setShown })
    return () => c.stop()
  }, [value, mv, reduce])
  return <>{format(shown)}</>
}

function Slider({ id, label, hint, value, min, max, step = 1, unit, onChange }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="slider">
      <div className="slider-top">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {value}
          {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--pct': `${pct}%` }}
      />
      {hint && <small>{hint}</small>}
    </div>
  )
}

export default function Roi() {
  const { t } = useLang()
  const ui = t.UI.roi
  const [managers, setManagers] = useState(25)
  const [hours, setHours] = useState(5)
  const [currency, setCurrency] = useState(CURRENCIES[0])
  const [rate, setRate] = useState(CURRENCIES[0].rate)
  const [share, setShare] = useState(30)

  const hoursFreed = Math.round(managers * hours * WEEKS * (share / 100))
  const value = hoursFreed * rate
  const fte = hoursFreed / FTE_HOURS
  const nf = (n) => Math.round(n).toLocaleString(ui.locale)

  const changeCurrency = (code) => {
    const c = CURRENCIES.find((x) => x.code === code)
    setCurrency(c)
    setRate(c.rate)
  }

  return (
    <section className="section alt" id="roi">
      <div className="wrap">
        <Reveal className="center head-block">
          <span className="eyebrow">{ui.eyebrow}</span>
          <h2 className="title">
            {ui.title[0]}
            <span className="hl">{ui.title[1]}</span>
          </h2>
          <p className="lede">
            {ui.lede}
          </p>
        </Reveal>

        <Reveal className="roi">
          <div className="roi-inputs">
            <Slider
              id="roi-managers"
              label={ui.managers}
              value={managers}
              min={5}
              max={300}
              step={5}
              unit=""
              onChange={setManagers}
            />
            <Slider
              id="roi-hours"
              label={ui.hours}
              hint={ui.hoursHint}
              value={hours}
              min={1}
              max={15}
              unit=" h"
              onChange={setHours}
            />
            <div className="slider">
              <div className="slider-top">
                <label htmlFor="roi-rate">{ui.rate}</label>
                <span className="rate-field">
                  <select
                    aria-label={ui.currency}
                    value={currency.code}
                    onChange={(e) => changeCurrency(e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="roi-rate"
                    type="number"
                    min={1}
                    max={500}
                    value={rate}
                    onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                  />
                </span>
              </div>
            </div>
            <Slider
              id="roi-share"
              label={ui.share}
              hint={ui.shareHint}
              value={share}
              min={10}
              max={60}
              step={5}
              unit="%"
              onChange={setShare}
            />
          </div>

          <div className="roi-result">
            <span className="roi-label">{ui.result}</span>
            <div className="roi-big">
              <Animated value={hoursFreed} format={nf} />
              <small>{ui.perYear}</small>
            </div>
            <div className="roi-row">
              <div>
                <span className="roi-label">{ui.value}</span>
                <strong>
                  <Animated value={value} format={(v) => `${nf(v)} ${currency.symbol}`} />
                </strong>
              </div>
              <div>
                <span className="roi-label">{ui.fte}</span>
                <strong>
                  <Animated value={fte} format={(v) => v.toLocaleString(ui.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} />
                </strong>
              </div>
            </div>
            <div className="roi-meter" aria-hidden>
              <motion.i animate={{ width: `${Math.min((fte / 10) * 100, 100)}%` }} transition={{ duration: 0.6 }} />
            </div>
            <p className="roi-note">
              <Info size={15} aria-hidden /> {ui.note(WEEKS)}
            </p>
            <a className="btn btn-white btn-square" href={DEMO_HREF}>
              {ui.cta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
