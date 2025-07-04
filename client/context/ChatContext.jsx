import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const ChatContext = createContext();






export const ChatContextProvider = ({children})=>{

    const [message , setMessage] = useState([]);
    const [users , setUsers] = useState([]);
    const [selecteduser , setSelectedUser] = useState(null);
    const [unseenmessages , setUnseenMessages] = useState({});
    const {socket , axios} =useContext(AuthContext);

    //function to get all users for side bar
    const getUsers = async ()=>{
        try {
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseen_messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to get selected user
    const getMessages = async(userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessage(data.messages);
            }
        } catch (error) {
            toast.error(error.messages);
        }
    }
    
    const sendMessage = async (messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selecteduser._id}` , messageData)
            if(data.success){
                setMessage((previous)=>[...previous , data.newMessage]);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {   
            toast.error(error.message);
        }
    }

    //function to subscribe to messages for selected user
    const subscribeToMessages = async ()=>{
        if(!socket){
            return ;
        }
        else{
            socket.on("newMessage" , (newMessage)=>{
                if(selecteduser && newMessage.SenderId === selecteduser._id){
                    newMessage.seen = true;
                    setMessage((prev)=>[...prev , newMessage])
                    axios.put(`/api/messages/mark${newMessage._id}`)
                }else{
                    setUnseenMessages((prev)=>({...prev , [newMessage.SenderId] :prev[newMessage.SenderId]?prev[newMessage.SenderId]+1:1 }))
                }
            })
        }
    }

    //function  to unsubscribe from message 
    const unsubscribeMessage = ()=>{
        if(socket) socket.off("newMessage")
    }
    useEffect(()=>{
        subscribeToMessages();
        return ()=>{
            unsubscribeMessage()
        }
    } , [socket ,selecteduser])
    const value = {
        message , users , selecteduser ,  getUsers  , setMessage , sendMessage , setSelectedUser , unseenmessages,
        getMessages , setUnseenMessages
    }
    return(
        <ChatContext.Provider value = {value}>
            {children}
        </ChatContext.Provider>
    )
}