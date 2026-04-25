import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PaymentProvider } from './context/PaymentContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PaymentProvider>
      <App />
    </PaymentProvider>
  </React.StrictMode>,
)
