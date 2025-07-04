import React, { useContext } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/chat-app-assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'
const ProfilePage = () => {
  const {authuser  ,update} = useContext(AuthContext)
  const [selectedImage , setSelectedImage] = useState(null)
  const navigate = useNavigate()
  const [name , setName] = useState(authuser.fullName)
  const [bio , setBio] = useState(authuser.bio)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      if (!selectedImage) {
        console.log("No image selected, updating name and bio");
        const success = await update({ fullName: name, bio });
        if (success) navigate('/');
        return;
      }

      const base64Img = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      });

      const success = await update({ profilePic: base64Img, fullName: name, bio });
      if (success) navigate('/');
    } catch (err) {
      console.error("Error during handleSubmit:", err.message);
    }
  };




  return (
    <div className=' min-h-screen flex bg-no-repeat items-center bg-cover justify-center'>
      <div className='w-5/6 backdrop-blur-2xl max-w-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit}className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg '>Profile details</h3>
          <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImage(e.target.files[0])} type='file' id='avatar' accept='.png , .jpg , .jpeg' hidden></input>
            <img src={selectedImage?URL.createObjectURL(selectedImage):assets.avatar_icon} className={`w-12 h-12 ${selectedImage && 'rounded-full'}`}></img>
            upload Profile image
          </label>
          <input type='text' onChange={(e)=>setName(e.target.value)}required placeholder='Your Name'  value={name}className='p-2  border border-gray-500 rounded-md focus:outline-none focus:ring focus:ring-violet-500'></input>
          <textarea  onChange={(e)=>setBio(e.target.value)}required placeholder='your bio' value ={bio}rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'></textarea>
          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-full text-lg p-2 pointer-cursor'>Save</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}`} src={ authuser.profilePic || assets.logo_icon}></img>
      </div>
    </div>
  )
}

export default ProfilePage
