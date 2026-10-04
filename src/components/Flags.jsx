import { useId } from 'react'

// Inline SVG flags (emoji flags don't render on Windows).
function GB() {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <clipPath id={`gb-s-${id}`}>
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <clipPath id={`gb-t-${id}`}>
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <g clipPath={`url(#gb-s-${id})`}>
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" clipPath={`url(#gb-t-${id})`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

function FR() {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill="#002654" d="M0 0h1v2H0z" />
      <path fill="#fff" d="M1 0h1v2H1z" />
      <path fill="#CE1126" d="M2 0h1v2H2z" />
    </svg>
  )
}

function IT() {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill="#009246" d="M0 0h1v2H0z" />
      <path fill="#fff" d="M1 0h1v2H1z" />
      <path fill="#CE2B37" d="M2 0h1v2H2z" />
    </svg>
  )
}

function ES() {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill="#AA151B" d="M0 0h3v2H0z" />
      <path fill="#F1BF00" d="M0 .5h3v1H0z" />
    </svg>
  )
}

// Arabic is shown with the Tunisian flag; change ARABIC_FLAG below for another country.
function TN() {
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill="#E70013" d="M0 0h1200v800H0z" />
      <circle cx="600" cy="400" r="200" fill="#fff" />
      <circle cx="600" cy="400" r="150" fill="#E70013" />
      <circle cx="640" cy="400" r="120" fill="#fff" />
      <polygon fill="#E70013" points={TN_STAR} />
    </svg>
  )
}

// five-pointed star inside the crescent, one point facing the hoist
const TN_STAR = Array.from({ length: 10 }, (_, k) => {
  const r = k % 2 ? 36 : 90
  const a = Math.PI + (k * Math.PI) / 5
  return `${(630 + r * Math.cos(a)).toFixed(1)},${(400 + r * Math.sin(a)).toFixed(1)}`
}).join(' ')

const ARABIC_FLAG = TN

export const LANGUAGES = [
  { code: 'fr', label: 'Français', short: 'FR', Flag: FR },
  { code: 'en', label: 'English', short: 'EN', Flag: GB },
  { code: 'ar', label: 'العربية', short: 'AR', Flag: ARABIC_FLAG, rtl: true },
  { code: 'es', label: 'Español', short: 'ES', Flag: ES },
  { code: 'it', label: 'Italiano', short: 'IT', Flag: IT },
]
