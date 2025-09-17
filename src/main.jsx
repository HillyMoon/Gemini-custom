import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Theme from './Theme.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme>
      <App />
    </Theme>
  </StrictMode>,
)