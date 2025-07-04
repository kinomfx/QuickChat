import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String ,
        required:true , 
    } ,
    email:{
        type:String , 
        required:true , 
        unique:true , 
    },
    password:{
        type:String , 
        required:true,
        minlength:[3 , 'it should be of length 3']
    },
    profilePic:{
        type:String , 
        default:""
    },
    bio:{
        type:String , 
    }

} , {timestamps:true})

export const User = mongoose.model("User" , userSchema);