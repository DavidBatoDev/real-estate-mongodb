import {
  BrowserRouter as Router, 
  Routes, 
  Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Header from './components/Header'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
