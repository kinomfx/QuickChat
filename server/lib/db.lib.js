import mongoose from "mongoose";


export const ConnectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/chat-app`)
        console.log("DB Connected")
    } catch (error) {
        console.log(error);
        throw error;
    }
    
}