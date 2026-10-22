import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PlantStory from '../sections/PlantStory'
import Mirror from '../sections/Mirror'
import Compare from '../sections/Compare'
import Cockpit from '../sections/Cockpit'
import { ZoomFrame } from '../components/Motion'
import { Standards, Cta } from '../components/Blocks'
import { Reveal, Title } from '../components/ui'
import { useLang, useSeo } from '../i18n'
import { orgLd, websiteLd, softwareLd, webPageLd } from '../seo'
import { MODULES } from '../data/modules'

function Explore() {
  const { t } = useLang()
  const ui = t.PAGES.home
  return (
    <section className="section explore">
      <div className="wrap">
        <Reveal className="center head-block">
          <span className="eyebrow">{ui.exploreEyebrow}</span>
          <h2 className="title">
            <Title parts={ui.exploreTitle} />
          </h2>
        </Reveal>
        <div className="explore-grid">
          {ui.cards.map((c, i) => (
            <Reveal key={c.to} delay={(i % 3) * 0.07}>
              <Link to={c.to} className="explore-card">
                <span className="ec-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                <ArrowUpRight className="ec-arrow" size={22} aria-hidden />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { t, lang } = useLang()
  useSeo({
    jsonLd: [
      orgLd(),
      websiteLd(lang),
      softwareLd({ lang, description: t.meta.description, features: MODULES.map((m) => `${t.MOD[m.slug].name}: ${t.MOD[m.slug].summary}`) }),
      webPageLd({ lang, path: '/', title: t.meta.title, description: t.meta.description }),
    ],
  })
  return (
    <>
      <PlantStory />
      <div id="after-story" />
      <Standards />
      <Mirror />
      <ZoomFrame>
        <Compare />
      </ZoomFrame>
      <Cockpit />
      <Explore />
      <Cta />
    </>
  )
}
