import React, { useContext } from 'react'
import { Routes , Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext.jsx'


const App = () => {
  const {authuser} = useContext(AuthContext)
  console.log(authuser);
  return (
    <div className='bg-[url("./bgImage.svg")] bg-contain'>
      <Toaster></Toaster>
      <Routes>
        <Route path ='/' element={authuser?<HomePage/>:<Navigate to='/login'/>}/>
        <Route path ='/login' element={!authuser?<LoginPage/>:<Navigate to='/'/>}/>
        <Route path ='/profile' element={authuser?<ProfilePage/>:<Navigate to='/login'/>}/>
      </Routes>
    </div>
  )
}

export default App
