import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import DeviceFrame from './components/DeviceFrame.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DeviceFrame>
        <App />
      </DeviceFrame>
    </BrowserRouter>
  </StrictMode>,
)
