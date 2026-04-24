/* global window */
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.scss'
import 'mapbox-gl/dist/mapbox-gl.css'
import App from './App'

createRoot(window.document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
