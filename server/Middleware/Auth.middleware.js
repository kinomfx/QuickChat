 //middleware to protect routes

import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"
export const protectRoute = async(req , res , next)=>{
    try {
        const token = req.headers.token;
        const decoded =  jwt.verify(token , process.env.JWT_SECRET)
        console.log("this is the decoded token " , decoded)
        console.log("Decoded ID:", decoded.userId, "Type:", typeof decoded.userId);
        const user = await User.findById(decoded.userId);
        console.log(user)
        if(!user) return res.json({
             success:false,
             message:"user not found"
        })
        req.user = user
        next();
    } catch (error) {
        console.log(error.message)
        res.json({
             success:false,
             message:error.message
        })
    }
 }