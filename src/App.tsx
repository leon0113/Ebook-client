import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Container from './components/common/Container'
import Home from './pages/Home'
import NewUser from './pages/NewUser'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import UpdateProfile from './pages/UpdateProfile'
import Verify from './pages/Verify'
// import Guest from './routes/Guest'
// import Private from './routes/Private'
import AuthorPage from './pages/AuthorPage'
import AuthorRegister from './pages/AuthorRegister'
import BookPage from './pages/BookPage'
import Cart from './pages/Cart'
import NewBookCreate from './pages/NewBookCreate'
import NotFound from './pages/NotFound'
import Orders from './pages/Orders'
import PaymentSuccess from './pages/PaymentSuccess'
import Rate from './pages/Rate'
import UpdateAuthor from './pages/UpdateAuthor'
import UpdateBook from './pages/UpdateBook'
import Author from './routes/Author'
import Guest from './routes/Guest'
import Private from './routes/Private'
import MyLibrary from './pages/Mylibrary'


function App() {

  return (
    <Container>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/book/:slug' element={<BookPage />} />
        <Route path='/not-found' element={<NotFound />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/author/:id' element={<AuthorPage />} />

        <Route element={<Private />}>
          <Route path='/new-user' element={<NewUser />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/update-profile' element={<UpdateProfile />} />
          <Route path='/author-registration' element={<AuthorRegister />} />
          <Route path='/payment-success' element={<PaymentSuccess />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/rate/:bookId' element={<Rate />} />
          <Route path='/library' element={<MyLibrary />} />

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
