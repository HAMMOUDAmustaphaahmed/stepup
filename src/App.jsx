import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { motion, MotionConfig } from 'framer-motion'
import Header from './components/Header'
import { Footer } from './components/Blocks'
import { LinkInterceptor, ProgressBar, ScrollManager, StickyCta } from './components/Navigation'
import Home from './pages/Home'
import Platform from './pages/Platform'
import ModulesPage from './pages/ModulesPage'
import ModulePage from './pages/ModulePage'
import AiPage from './pages/AiPage'
import Contact from './pages/Contact'
import { Solutions, Pricing, DiagnosticPage, FaqPage, NotFound } from './pages/SimplePages'
import { LangProvider } from './i18n'
import { SmoothScroll } from './components/Motion'
import Chatbot from './components/Chatbot'

// The first page is already in the prerendered HTML, so only later navigations fade in.
function Page({ first, children }) {
  return (
    <motion.main initial={first ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
      {children}
    </motion.main>
  )
}

export default function App({ lang }) {
  const { pathname } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    first.current = false
  }, [])
  return (
    <LangProvider lang={lang}>
      <MotionConfig reducedMotion="user">
        <SmoothScroll />
        <ScrollManager />
        <LinkInterceptor />
        <ProgressBar />
        <Header />
        {/* keyed on the path so each page fades in */}
        <Page key={pathname} first={first.current}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/modules/:slug" element={<ModulePage />} />
            <Route path="/ai" element={<AiPage />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/diagnostic" element={<DiagnosticPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Page>
        <Footer />
        <StickyCta />
        <Chatbot />
      </MotionConfig>
    </LangProvider>
  )
}
