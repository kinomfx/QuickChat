import {Router} from "express"
import { CheckAuth, Login, SignUp, UpdateUser } from "../controllers/user.controller.js"
import { protectRoute } from "../Middleware/Auth.middleware.js";

const UserRouter = Router()

UserRouter.post("/signup" , SignUp);

UserRouter.post("/login" , Login);

UserRouter.put("/update-profile" , protectRoute,UpdateUser);

UserRouter.get("/check",protectRoute,CheckAuth);

export default UserRouter;