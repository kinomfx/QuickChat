import React, { useContext, useEffect , useState } from 'react'
import assets, { messagesDummyData } from '../assets/chat-app-assets/assets';
import { useRef } from 'react';
import { FormatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const ChatContainer = () => {
    const {message, sendMessage , getMessages ,setSelectedUser , selecteduser} = useContext(ChatContext);
    const {authuser ,onlineuser} = useContext(AuthContext);
    const [input , setInput] = useState("")

    const isOnline = true
    const scrollEnd = useRef()
    useEffect(() => {
    console.log("Messages:", message); 
    setTimeout(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, 100);
    }, [message]);
    useEffect(()=>{
            if (selecteduser?._id) {
                getMessages(selecteduser._id);
            }
    }, [selecteduser])
    useEffect(()=>{
            if(scrollEnd.current  && message){
                scrollEnd.current.scrollIntoView({ behavior: "smooth" });
            }
    } , [])

    const handleMessage = async (e) => {
    e.preventDefault();
    if (!input || input.trim() === '') return;
    console.log("Sending message:", input); // ✅ add this
    await sendMessage({ text: input.trim() });
    setInput('');
    setTimeout(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, 100);
    };
    const handleImage = async(e)=>{
        const file = e.target.files[0];
        if(!file || !file.type.startsWith('image/')){
            toast.error('select an image file')
            return; 
        }
        const reader = new FileReader();

        reader.onloadend = async ()=>{
            await sendMessage({image:reader.result})
            e.target.value = '';
        }
        reader.readAsDataURL(file);
    }

    return selecteduser?(
    <div className='h-full overflow-y-auto overflow-x-auto scroll-hidden relative backdrop-blur-lg'>
        {/*-------Header -------- */}

      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selecteduser.profilePic?selecteduser.profilePic:assets.avatar_icon} className='w-8 rounded-full'></img>
        <p className='flex-1  text-lg text-white flex items-center gap-2'>
            {selecteduser.fullName}
            <span className={onlineuser.includes(selecteduser._id)?`w-2 h-2 rounded-full  bg-green-500`:'w-2 h-2 rounded-full bg-gray-500'}></span>
        </p>
        <img src={assets.arrow_icon} alt='arrow_icon' className='md:hidden max-w-7' onClick={()=>{
            setSelectedUser(null)
        }}></img>
        <img src={assets.help_icon} alt='help' className='max-md:hidden  max-w-5'></img>
      </div>
      


      {/*-------Chat -------- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-auto scroll-hidden  p-3 pb-6'>
        {message?.map((message , idx)=>{
            console.log(message.SenderId === authuser._id)
            return (<div key={idx} className={`flex  items-end gap-2 justify-end ${message.SenderId!=authuser._id && 'flex-row-reverse'}`}>
                {message.image?(<img className = 'max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' src={message.image}></img>):(<p className={`p-2  max-w-[200px] md:text-sm font-light rounded-lg  mb-8  break-all bg-violet-500/3 text-white ${message.senderId===authuser._id?'rounded-br-none':'rounded-bl-none'}`}>{message.text}</p>)}

                <div className='text-center text-xs'>
                    <img src={message?.SenderId?.toString() ===authuser?._id?.toString() ? authuser?.profilePic || assets.avatar_icon : selecteduser?.profilePic|| assets.avatar_icon } className='w-7 rounded-full'></img>
                    <p className='text-gray-500'>{FormatMessageTime(message.createdAt)}</p>
                
                </div>
            </div>)
            
            })}
             <div ref={scrollEnd}>

            </div>
        </div>
        {/*-------Footer -------- */}
        <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3  p-3'>
            <div className='flex-1 flex items-center justify-center bg-gray-100/12 px-3 rounded-full'>
                <input type='text' placeholder='send a message' 
                className='flex-1 text-sm p-2 border-none rounded-lg outline-none text-white placeholder-gray-400'
                onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{
                    e.key==='Enter'?handleMessage(e):null
                }} value={input}></input>
                <input type='file' id='image' accept="image/png  , image/jpeg" hidden onChange={handleImage}></input>
                <label htmlFor='image'>
                    <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' ></img>
                </label>
            </div>
            <img src={assets.send_button} className='w-7 cursor-pointer' onChange={handleImage}></img>
        </div>
    </div>
  ):(
    <div className='flex  flex-col items-center  justify-center gap-2  text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} className='max-w-16'></img>
        <p className='text-lg font-medium text-white'>Chat anytime Anywhere</p>
    </div>
  )
}

export default ChatContainer;
