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
import RetailerDashboard from './pages/Retailer'
import Receive from './pages/Receive'
import RouteMap from './pages/RouteMap'
import AIAnalysisDashboard from './pages/AiAnalysis'
import BlockchainValidationDashboard from './pages/BlockchainAnalysis'
import ConsumerDashboard from './pages/ConsumerDashboard'
import PharmaDashboard from './pages/ConsumerDashboard'
import ItemImageCompliancePage from './pages/Reports'
import FraudDetectionPage from './pages/Fraud'
import SupplyChainDashboard from './pages/dashboard'
import Camera from './pages/camera'

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
        <Route path='/origin-verification' element={<Restrictions />} />
        <Route path='/compliance-check' element={<ComplianceFormPage />} />
        <Route path='/Retailer' element={<RetailerDashboard />} />
        <Route path='/receiver' element={<Receive />} />
        <Route path='/map' element={<RouteMap/>}/>
        <Route path='/Retailers' element={<RetailerDashboard />} />
        <Route path='/Maps' element={<RouteMap />} />
        <Route path='/aianalysis' element={<AIAnalysisDashboard />} />
        <Route path='/blockchainanalysis' element={<BlockchainValidationDashboard />} />
        <Route path='/consumer' element={<PharmaDashboard />} />
        <Route path='/report' element={<ItemImageCompliancePage />} />
        <Route path='/overall-fraud' element={<FraudDetectionPage />} />
        <Route path='/journey' element={<SupplyChainDashboard />} />
        <Route path='/camera' element={<Camera />} />
        <Route path='/map/:productId/:src/:destination' element={<RouteMap />} />
      </Routes>
    </>
  )
}

export default App
