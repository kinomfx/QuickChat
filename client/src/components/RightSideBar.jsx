import React, { useContext } from 'react'
import assets, { imagesDummyData } from '../assets/chat-app-assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSideBar = () => {
  const {setSelectedUser , selecteduser , message  , onlineuser} = useContext(ChatContext);
  const {logout} = useContext(AuthContext);
  const imageData = message.filter((m) => m.image);
  const image = imageData.map((imageMessage)=>{
    return imageMessage.image;
  })
  console.log(image)
  return selecteduser && (
    <div className={`bg-[#8185B2]/10  text-white w-full relative scroll:hidden ${selecteduser?'max-md:hidden':''}`}>
        {/*-------Self Intro-------*/}
        <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
          <img src={selecteduser?.profilePic ||  assets.avatar_icon} alt='profilepic' className='w-20 aspect-[1/1]  rounded-full'></img>
          {onlineuser?.includes(selecteduser._id) && <p className='rounded-full w-2 h-2 bg-green-400'></p>}
          <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>{selecteduser.fullName}</h1>
          <p className='px-12 mx-auto'>{selecteduser.bio}</p>
        </div>
        {/*-------Media-------*/}
        <div className='flex justify-center'>
          <hr className='border-[#ffffff50] my-4 w-[85%]'/>
        </div>
        <div className='px-5 text-xs'>
          <p>Media</p>
          <div className='mt-2 max-h-[200px] overflow-y-scroll scroll-hidden grid grid-cols-2 gap-4 opacity-80'>
            {image.map((picture , idx)=>{

            return picture?(
              <div key={idx} className='cursor-pointer rounded'>
                <img src={picture} alt="media_pic" onClick={()=>{window.open(picture)}} className='h-full rounded-md' />
              </div>
            ):''})}
          </div>
        </div>
        <div className='flex justify-center items-center'>
          <button className='absolute flex-1 bottom-5 left-[calc(10%)] transform -translate-x--1/2 
        bg-gradient-to-r from-purple-400 to-violet-600 text white border-none text-sm font-light
        py-2 px-[calc(30%)] rounded-full cursor-pointer w-max[10px]' onClick={()=>{
          logout()
        }}>Logout</button>
        </div>
    </div>
  )
}

export default RightSideBar;
