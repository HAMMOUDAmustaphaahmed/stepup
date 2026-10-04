import { motion } from 'framer-motion'
import { Check, Minus, X, Star } from 'lucide-react'
import { Reveal } from '../components/ui'
import { useLang } from '../i18n'

const MARK = {
  good: <Check size={16} strokeWidth={3} />,
  ok: <Minus size={16} strokeWidth={3} />,
  bad: <X size={16} strokeWidth={3} />,
  no: <Minus size={16} strokeWidth={3} />,
}

export default function Compare() {
  const { t } = useLang()
  const ui = t.UI.compare
  const { cols, rows } = t.COMPARE

  return (
    <section className="section compare" id="compare">
      <div className="wrap">
        <Reveal className="center head-block">
          <span className="eyebrow">{ui.eyebrow}</span>
          <h2 className="title">
            {ui.title[0]}
            <span className="hl">{ui.title[1]}</span>
          </h2>
          <p className="lede">{ui.lede}</p>
        </Reveal>

        <div className="cmp" role="table" aria-label={ui.eyebrow}>
          {/* raised card behind the Stepup column */}
          <motion.div
            className="cmp-highlight"
            aria-hidden
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="cmp-row cmp-head" role="row">
            <span role="columnheader" className="cmp-feature">
              {ui.feature}
            </span>
            {cols.map((c, i) => (
              <span role="columnheader" key={c} className={i === 2 ? 'cmp-stepup' : ''}>
                {i === 2 && (
                  <em className="cmp-badge">
                    <Star size={12} aria-hidden /> {ui.best}
                  </em>
                )}
                {i === 2 && <span className="logo-mark" aria-hidden />}
                {c}
              </span>
            ))}
          </div>
          {rows.map(([feature, ...cells], r) => (
            <motion.div
              key={feature}
              className="cmp-row"
              role="row"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: r * 0.05 }}
            >
              <span role="rowheader" className="cmp-feature">
                {feature}
              </span>
              {cells.map(([tone, text], i) => (
                <span role="cell" key={i} className={`cmp-cell ${tone}${i === 2 ? ' cmp-stepup' : ''}`} data-col={cols[i]}>
                  <i aria-hidden>{MARK[tone]}</i>
                  {text}
                </span>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
