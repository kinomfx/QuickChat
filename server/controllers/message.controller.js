import cloudinary from "../lib/cloudinary.lib.js";
import { Message } from "../models/message.models.js";
import { User } from "../models/user.models.js";
import {io , userSocketMap} from "../server.js"

//get all users except the logged in user

export const GetAllUsersForSideBar = async (req , res) => {
    try {
        const user_id = req.user._id
        const filteredUsers = await User.find({_id:{$ne:user_id}}).select("-password"); 
        //count number of unseen messages
        const unseen_messages = {};
        const promises = filteredUsers.map(async(user , idx)=>{
            const messages = await Message.find({Sender_Id:user._id , RecieverId:user_id , seen:false})
            if(messages.length > 0){
                unseen_messages[user._id] = messages.length
            }
        })
        await Promise.all(promises)
        return res.json({success:true , 
            users:filteredUsers ,
            unseen_messages
        })
       
    } catch (error) {
        console.log(error.message)
        return res.json({
            success:false,
            message:error.message
        })
    }
};

export const GetMessagesOfSelectedUser = async (req , res)=>{
    try {
        const {id:SelectedUserId} = req.params
        const my_id = req.user._id

        const messages = await Message.find({
            $or:[
                {SenderId:SelectedUserId , RecieverId:my_id},
                {SenderId:my_id , RecieverId:SelectedUserId}
            ]
        })

        await Message.updateMany({SenderId:SelectedUserId , RecieverId:my_id} , {seen:true});
        return res.json({success:true , messages})
    } catch (error) {
        console.log(error.message)
        return res.json({
            success:false,
            message:error.message
        })
    }
}

//api to mark messages as seen using message id 

export const MarkMessageAsSeen = async(req , res)=>{
    try {
        const {id} = req.params
        await Message.findByIdAndUpdate(id , {seen:true})
        return res.json({success:true})
    } catch (error) {
        console.log(error.message)
        return res.json({
            success:false,
            message:error.message
        })
    }
}


export const SendMessage = async (req ,res)=>{
    try {
        const {text , image} = req.body;
        const RecieverId = req.params.id;
        const SenderId = req.user._id
        let imageURL;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({SenderId , RecieverId , text , image:imageURL })
        console.log("✅ New Message:", newMessage);
        const RecieverSocketId = userSocketMap[RecieverId]
        if(RecieverSocketId){
            io.to(RecieverSocketId).emit("newMessage" , newMessage)
        }
        return res.json({
            success:true , 
            newMessage
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            success:false,
            message:error.message
        })
    }
}