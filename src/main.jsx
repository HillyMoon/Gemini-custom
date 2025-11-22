import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ThemeWrapper from './ThemeWrapper.jsx'
import App from './App.jsx'
import ModelViewer from './ModelViewer.jsx'
import './style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeWrapper>
      {/* <ModelViewer /> */}
      <App />
    </ThemeWrapper>
  </StrictMode>,
)