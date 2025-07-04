//signup new user 

import cloudinary from "../lib/cloudinary.lib.js";
import { GenerateToken } from "../lib/utils.js";
import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs"

export const SignUp = async(req , res)=>{
    console.log("BODY IS:", req.body);
    const {fullName , email , password ,profilePic, bio} = req.body;
    console.log(fullName , email , password ,profilePic, bio)
    try {
        if(!fullName || !email || !password || !bio){
            console.log("something is wrong")
            return res.status(400).json({
              message:"Bad Request"  ,
              success:false
            })
        }
        
        const existingUser =  await User.findOne({
            $and:[
                {email}
            ]
        })
        console.log(existingUser)
        if(existingUser){
            console.log("something went wrong here ")
            return res.status(400).json({
              message:"You already have an account"  ,
              success:false
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password , salt)
        const newUser = await User.create({fullName:fullName , email:email , password:hash ,  bio:bio})
        const token = await GenerateToken(newUser._id)
        console.log("everything is fine till here")
        return res.status(200).json({
            success:true , 
            message:"New user added",
            userData:newUser,
            token:token
        })
    } catch (error) {
        console.log(error.message);
        console.log("something went wrong")
        return res.status(400).json({
            success:false , 
            message:error.message,
        })
    }
}


//login function 

export const Login = async(req , res)=>{
    try {
        const { email , password } = req.body;
        const existedUser = await User.findOne({
            email
        })
        if(!existedUser){
            return res.status(400).json({
                success:false , 
                message:"User not found"
            })
        }
        const isPassCorrect = await bcrypt.compare(password , existedUser?.password)
        if(!isPassCorrect){
            return res.status(400).json({
                success:false , 
                message:"email or password is incorrect"
            })
        }
        const token = await GenerateToken(existedUser._id)
        return res.status(200).json({
            success:true , 
            message:"login successful",
            userData:existedUser,
            token:token
        })
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            success:false , 
            message:error.message,
        })
    }

}

//authenticate the user

export const CheckAuth = async(req , res)=>{
    res.json({success:true , user:req.user})
}


//user profile updater

export const UpdateUser = async(req , res)=>{
    try {
        const {profilePic , bio , fullName} = req.body;
        const UserId = req.user._id;
        let updatedUser;
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(UserId , {bio , fullName} , {new:true })
            return res.status(200).json({
                success:true , 
                message:"profile updated",
                user:updatedUser
            })
        }else{
            const upload = await cloudinary.uploader.upload(profilePic)
            updatedUser = await User.findByIdAndUpdate(UserId , {profilePic:upload.secure_url , bio , fullName} , {new:true})
            return res.status(200).json({
                success:true , 
                message:"profile updated",
                user:updatedUser
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
                sucess:false, 
                message:error.message
        })
    }
}
