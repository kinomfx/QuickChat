import React from 'react'
import assets, { userDummyData } from '../assets/chat-app-assets/assets';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext.jsx';
import { useContext  , useState} from 'react';
import { ChatContext } from '../../context/ChatContext.jsx';
import { useEffect } from 'react';
const SideBar = () => {
    const [input , setInput] = useState(false)
    const {getUsers , setSelectedUser , users, selecteduser , unseenmessages , setUnseenMessages} = useContext(ChatContext)
    const {logout , onlineuser} = useContext(AuthContext);
    const filteredUser = typeof input === 'string' && input.trim() !== ''
        ? users.filter((user) =>
            user.fullName.toLowerCase() === input.trim().toLowerCase()
            )
        : users;
    useEffect(()=>{
        getUsers();
    } ,[onlineuser])
    const navigate = useNavigate()
  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-auto scroll-hidden text-white ${selecteduser?'max-md:hidden':''}`}>
      <div className='pb-5'>
        <div className='flex justify-center items-center'>
            <img src={assets.logo} alt='logo' className='max-w-40'></img>
            <div className='relative py-2 group'>
                 <img src={assets.menu_icon} alt='logo' className='max-h-5 cursor-pointer'></img>
                 <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
                    <p onClick={()=>{
                        navigate('/profile')
                    }} className='cursor-pointer text-sm'>Edit Profile</p>
                    <hr className='my-2 border-t border-gray-500'></hr>
                    <p className='cursor-pointer text-sm' onClick={()=>logout()}>Logout</p>
                 </div>
            </div>
        </div>
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
            <img src={assets.search_icon} alt='search' className='w-3 '></img>
            <input type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' onChange={(e)=>setInput(e.target.value)} placeholder='Search User'/>
        </div>
      </div>
      <div className='flex flex-col'>
                    {filteredUser.map((user ,idx)=>(
                        <div key={idx} onClick={()=>{
                            setSelectedUser(user);
                            setUnseenMessages((prev)=>({...prev , [user._id]:0}))
                        }} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selecteduser?._id===user._id && 'bg-[#282142]/50'}`}>
                                <img src={user?.profilePic || assets.avatar_icon} alt='profile_pic' className='w-[35px] aspect-[1/1] rounded-full'/>
                                <div className='flex flex-col leading-5'>
                                    <p>{user?.fullName}</p>
                                    {
                                        onlineuser.includes(user._id)?
                                        <span className='text-green-400 text-xs'>Online</span>:
                                        <span className='text-neutral-400 text-xs'>Offline</span>
                                    }
                                </div>
                                {
                                    unseenmessages[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 text-white'>{unseenmessages[user._id]}</p>
                                }
                        </div>
                    ))}
      </div>
    </div>
  )
}

export default SideBar;
