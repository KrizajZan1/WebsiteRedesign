import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import '@react-three/drei'
import '@react-three/fiber'

createRoot(document.getElementById('mainroot')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
