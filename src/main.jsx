import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import HeaderBar from './components/HeaderBar.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <HeaderBar />
    <App />
  </BrowserRouter>
)
