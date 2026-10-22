import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import { PageHero } from '../components/Blocks'
import { Reveal } from '../components/ui'
import { CONTACT_EMAIL } from '../content'
import { useLang, useSeo } from '../i18n'
import { pageLd } from '../seo'

// Builds an e-mail from the form and opens the visitor's mail app. Nothing is sent to a server.
export default function Contact() {
  const { t, lang } = useLang()
  const ui = t.PAGES.contact
  const seoTitle = `${t.UI.header.demo} — Contact`
  useSeo({ title: seoTitle, description: ui.lede, jsonLd: pageLd({ lang, path: '/contact', title: seoTitle, description: ui.lede, home: t.UI.header.home, crumbs: [['Contact', '/contact']] }) })
  const [params] = useSearchParams()
  const isQuote = params.get('topic') === 'quote'
  // arriving from "Custom modules" ticks that interest
  const [form, setForm] = useState(() => ({
    name: '',
    email: '',
    company: '',
    role: '',
    sites: 0,
    interests: params.get('topic') === 'custom' ? [ui.interests.length - 1] : [],
    message: '',
  }))
  const [tried, setTried] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggle = (i) =>
    setForm((f) => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] }))
  const missing = ['name', 'email', 'company'].filter((k) => !form[k].trim())

  const submit = (e) => {
    e.preventDefault()
    setTried(true)
    if (missing.length) return
    const lines = [
      `${ui.name}: ${form.name}`,
      `${ui.email}: ${form.email}`,
      `${ui.company}: ${form.company}`,
      form.role && `${ui.role}: ${form.role}`,
      `${ui.sites}: ${ui.siteOptions[form.sites]}`,
      form.interests.length && `${ui.interest} ${form.interests.map((i) => ui.interests[i]).join(', ')}`,
      form.message && `\n${form.message}`,
    ].filter(Boolean)
    const subject = isQuote ? t.PAGES.pricing.quote + ' — Stepup' : ui.subject
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }

  const field = (k, label, type = 'text', required = false, auto) => (
    <label className={`field${tried && required && !form[k].trim() ? ' invalid' : ''}`}>
      <span>
        {label}
        {required && <em> *</em>}
      </span>
      <input type={type} value={form[k]} onChange={set(k)} required={required} autoComplete={auto} aria-invalid={tried && required && !form[k].trim()} />
    </label>
  )

  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[['Contact']]} scene="plane" />
      <section className="section alt">
        <div className="wrap contact-grid">
          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="field-row">
              {field('name', ui.name, 'text', true, 'name')}
              {field('email', ui.email, 'email', true, 'email')}
            </div>
            <div className="field-row">
              {field('company', ui.company, 'text', true, 'organization')}
              {field('role', ui.role, 'text', false, 'organization-title')}
            </div>
            <fieldset className="field">
              <legend>{ui.sites}</legend>
              <div className="seg">
                {ui.siteOptions.map((o, i) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={form.sites === i}
                    onClick={() => setForm((f) => ({ ...f, sites: i }))}
                  >
                    {form.sites === i && <motion.span layoutId="seg-pill" className="seg-pill" />}
                    <span>{o}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="field">
              <legend>{ui.interest}</legend>
              <div className="chips">
                {ui.interests.map((o, i) => (
                  <button key={o} type="button" aria-pressed={form.interests.includes(i)} onClick={() => toggle(i)}>
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="field">
              <span>{ui.message}</span>
              <textarea rows={4} value={form.message} onChange={set('message')} />
            </label>
            {tried && missing.length > 0 && <p className="form-error">* {ui.required}</p>}
            <button type="submit" className="btn btn-solid btn-square">
              <Send size={18} aria-hidden /> {ui.submit}
            </button>
            <p className="form-note">{ui.note}</p>
          </form>

          <Reveal className="contact-side" delay={0.1}>
            <h2 className="mp-h2">{ui.nextTitle}</h2>
            <ol className="next-steps">
              {ui.next.map((s, i) => (
                <li key={i}>
                  <span>{i + 1}</span>
                  <p>{s}</p>
                </li>
              ))}
            </ol>
            <div className="direct">
              <Mail size={20} aria-hidden />
              <div>
                <strong>{ui.direct}</strong>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
