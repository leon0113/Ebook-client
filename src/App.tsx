import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Container from './components/common/Container'
import Verify from './pages/Verify'
import NewUser from './pages/NewUser'
import { Toaster } from 'react-hot-toast'
import Profile from './pages/Profile'
import UpdateProfile from './pages/UpdateProfile'
import Guest from './routes/Guest'
import Private from './routes/Private'


function App() {

  return (
    <Container>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/verify' element={<Verify />} />
        <Route element={<Private />} >
          <Route path='/new-user' element={<NewUser />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/update-profile' element={<UpdateProfile />} />
        </Route>
        <Route element={<Guest />} >
          <Route path='/sign-up' element={<SignUp />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </Container>
  )
}

export default App
