import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './story.css'
import './mirror.css'
import './v4.css'
import './pages.css'
import './motion.css'
import './rtl.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
