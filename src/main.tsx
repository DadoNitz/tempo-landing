import '@fontsource/imbue/latin-800.css'
import '@fontsource/albert-sans/latin-400.css'
import '@fontsource/albert-sans/latin-500.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
