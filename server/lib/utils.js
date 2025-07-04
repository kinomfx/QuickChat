import jwt from "jsonwebtoken"

//function that generates tokens so we can authenticate users

export const GenerateToken = async (userId )=>{
    const token =   jwt.sign({userId} ,process.env.JWT_SECRET);
    return token;
}