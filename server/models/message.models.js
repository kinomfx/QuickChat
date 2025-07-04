import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    SenderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true , 
    },
    RecieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true , 
    },
    text:{
        type:String 
    },
    image:{
        type:String , 
    } , 
    seen :{
        type:Boolean ,
        default:false
    }
} , {timestamps:true})


export const Message = mongoose.model("Message" , messageSchema);