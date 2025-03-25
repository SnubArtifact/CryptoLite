import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './components/DarkMode/DarkMode'
import Hero from './components/Hero/Hero'
import Login from './components/Login/Login'
import Home from './components/Main/Home'
import CryptoTable from './components/CryptoTable/CryptoTable'
import CoinDetail from './components/CoinDetail/CoinDetail'
import Portfolio from './components/Portfolio/Portfolio'

function App() {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Router>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
            <Route path="/table" element={<CryptoTable />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </Router>
      </div>
    </DarkModeProvider>
  )
}

export default App