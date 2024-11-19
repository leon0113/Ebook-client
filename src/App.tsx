import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Container from './components/common/Container'


function App() {

  return (
    <Container>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </Container>
  )
}

export default App
