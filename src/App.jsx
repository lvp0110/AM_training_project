import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Techlist from './pages/Techlist'
// import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/techlist" element={<Techlist />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
export default App