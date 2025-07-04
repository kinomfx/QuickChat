import React, { useState , useContext } from 'react'
import assets from '../assets/chat-app-assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'
import { Navigate } from 'react-router-dom'

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("SignUp") 
  const [fullName , setFullName] = useState("")
  const [email , setEmail] = useState("")
  const[password , setPassword] = useState("")
  const [bio , setBio] = useState("");
  const [isDataSubmitted , setIsDataSubmitted] = useState(false)
  const {login} = useContext(AuthContext)
  const onSubmitHandler = (e)=>{
    e.preventDefault()
    if(currentState==='SignUp' && !isDataSubmitted){
      setIsDataSubmitted(true)
      
      return
    }
    console.log(currentState);
    login(currentState=="SignUp"?'signup':'login' , {fullName, email , password , bio });
    
  }
  return (
    <div className='min-h-screen w-screen flex bg-cover bg-repeat-none bg-center items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/*-------Left-------*/}
      <img src={assets.logo_big} className='w-[min(30vw , 250px)]' alt="Logo" />
      
      {/*-------Right-------*/}
      <form onSubmit={onSubmitHandler} className=' text-white border-2px bg-white/8 border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        
          <h2 className='flex font-medium text-2xl justify-between items-center'>{currentState}
            {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)}src={assets.arrow_icon} className='w-5 cursor-pointer' alt="Arrow Icon" />}
          </h2>

        {currentState==="SignUp" && !isDataSubmitted &&  (
          <input type='text' required placeholder='fullname' name='fullname' onChange={(e)=>setFullName(e.target.value)} value={fullName}
         className=' text-white p-2 border border-gray-500 rounded-md focus:outline-none'></input>
        )}

        {!isDataSubmitted &&(
          <>
            <input onChange={(e)=>{
              setEmail(e.target.value)
            }} type='text'  value={email} placeholder='Email Address' name='email' className='p-2 border border-gray-500 rounded rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required></input>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="text"
              placeholder="Password"
              name="password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required 

            />

          
          </>
        )}

        {currentState==='SignUp' && isDataSubmitted && (
          <textarea rows = {4} name="bio" id="" placeholder='Enter Your Bio' 
          className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' required
          onChange={(e)=>setBio(e.target.value )} value={bio}></textarea>
        )}
        <button  type="submit" className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currentState==='SignUp'?'Create Account':'Login'}
        </button>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type='checkbox'></input>
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className='flex flex-col gap-2'>
          {currentState==='SignUp'?(
            <p className='text-sm text-gray-600'>Already have an account ? <span 
            onClick={()=>{setCurrentState('Login'); setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
          ):(
            <p  className='text-sm text-gray-600'>Create an account <span 
            onClick={()=>setCurrentState('SignUp')}className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
