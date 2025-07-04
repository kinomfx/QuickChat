import { createContext , useState } from "react";
import axios from "axios"
import {toast} from "react-hot-toast";
import { useEffect } from "react";
import {io} from "socket.io-client"
const backend_url = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backend_url
const tokenFromStorage = localStorage.getItem("token");
if (tokenFromStorage) {
    axios.defaults.headers.common["token"] = tokenFromStorage;
}
export const AuthContext = createContext();
export const AuthProvider = ({children})=>{

    const [token , setToken] = useState(localStorage.getItem("token"))
    const [authuser , setAuthUser] = useState(null)
    const [onlineuser , setOnlineUser] = useState([])
    const [socket , setSocket] = useState(null)

    // connect socket function  to handle socket connection  and online users updates

    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return 
        const newSocket = io(backend_url ,{
            query:{
                userId:userData._id,   
                 
            }
        }) 
        newSocket.connect()
        setSocket(newSocket) 

        newSocket.on("getOnlineUsers" , (userIds)=>{
            setOnlineUser(userIds)
        })
    }





    //making every axios request have a token with its url also
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token
            CheckAuth();
        }
    } , [])
    //check if user is  authenticated and if so  , set the user data and connect  the socket
    const CheckAuth = async()=>{
        try {
            const {data} = await axios.get('api/auth/check')
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error.message);
        }
    }

    //login functions to get user logged in 

    const login = async (state , credentials)=>{
        try {
            const {data} = await axios.post(`/api/auth/${state}` , credentials);
            console.log("Response from backend:", data);
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token" ,data.token)
                localStorage.setItem("authUser", JSON.stringify(data.userData));
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //logout functions to handle user logout and socket disconnection 
    const logout = async ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("authUser");
        setToken(null)
        setAuthUser(null)
        setOnlineUser([])
        axios.defaults.headers.common["token"] = null;
        toast.success("logged out successfully")
        socket?.disconnect();
    } 

    //update user profile 
    const update = async (body) => {
        try {
            console.log("Axios token:", axios.defaults.headers.common["token"]);
            const { data } = await axios.put("/api/auth/update-profile", body);
            console.log("Update response:", data);
            if (data.success) {
            setAuthUser(data.user);
            toast.success("Update successful");
            return true;
            } else {
            toast.error("Update failed");
            return false;
            }
        } catch (error) {
            console.error("Update error:", error.message);
            toast.error(error.message);
            return false;
        }
    };



    const value = {
        axios ,
        authuser ,
        onlineuser ,
        socket,
        login,
        logout , 
        update

    }

    return (
        <AuthContext.Provider value = {value}>
            {children}
        </AuthContext.Provider>
    )
}