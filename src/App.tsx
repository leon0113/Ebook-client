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
// import Guest from './routes/Guest'
// import Private from './routes/Private'
import NewBookCreate from './pages/NewBookCreate'
import UpdateBook from './pages/UpdateBook'
import Private from './routes/Private'
import Guest from './routes/Guest'
import AuthorRegister from './pages/AuthorRegister'
import UpdateAuthor from './pages/UpdateAuthor'
import Author from './routes/Author'
import NotFound from './pages/NotFound'
import BookPage from './pages/BookPage'
import Cart from './pages/Cart'


function App() {

  return (
    <Container>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/book/:slug' element={<BookPage />} />
        <Route path='/not-found' element={<NotFound />} />
        <Route path='/cart' element={<Cart />} />

        <Route element={<Private />}>
          <Route path='/new-user' element={<NewUser />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/update-profile' element={<UpdateProfile />} />
          <Route path='/author-registration' element={<AuthorRegister />} />

          <Route element={<Author />}>
            <Route path='/update-author' element={<UpdateAuthor />} />
            <Route path='/create-new-book' element={<NewBookCreate />} />
            <Route path='/update-book/:slug' element={<UpdateBook />} />
          </Route>

        </Route>

        <Route element={<Guest />} >
          <Route path='/sign-up' element={<SignUp />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>

      <Toaster position="top-center" />
    </Container>
  )
}

export default App
