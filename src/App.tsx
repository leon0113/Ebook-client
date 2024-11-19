import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Container from './components/common/Container'
import Verify from './pages/Verify'
import NewUser from './pages/NewUser'


function App() {

  return (
    <Container>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/new-user' element={<NewUser />} />
      </Routes>
    </Container>
  )
}

export default App
