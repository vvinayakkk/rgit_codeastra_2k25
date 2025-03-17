import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/login'
import Home from './pages/Landing'
import GTranslate from './components/Gtranslate'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GTranslate/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App
