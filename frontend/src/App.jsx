import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import Home from './pages/Landing'
import GTranslate from './components/Gtranslate'
import ProducerDashboard from './pages/Producer'
import Analytics from './pages/producer/analytics'
import Products from './pages/producer/products'
import Settings from './pages/producer/settings'
import Restrictions from './pages/Origin'
import ComplianceFormPage from './pages/Compliance'
import RouteMap from './pages/producer/ShipmentsSingle'
import RetailerDashboard from './pages/Retailer'
import Receive from './pages/Receive'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GTranslate/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/producer' element={<ProducerDashboard />} />
        <Route path='/Analytics' element={<Analytics />} />
        <Route path='/Products' element={<Products />} />
        <Route path='/Settings' element={<Settings />} />
        <Route path='/Shipments' element={<RouteMap />} />
        <Route path='/origin' element={<Restrictions />} />
        <Route path='/compliance' element={<ComplianceFormPage />} />
        <Route path='/Retailer' element={<RetailerDashboard />} />
        <Route path='/receiver' element={<Receive />} />
      </Routes>
    </>
  )
}

export default App
