import {Router} from "express"
import { GetAllUsersForSideBar, GetMessagesOfSelectedUser, MarkMessageAsSeen, SendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../Middleware/Auth.middleware.js";

const MessageRouter = Router();

MessageRouter.get('/users' , protectRoute ,GetAllUsersForSideBar)
MessageRouter.get('/:id' , protectRoute ,GetMessagesOfSelectedUser)
MessageRouter.put('/mark/:id' , protectRoute ,MarkMessageAsSeen)
MessageRouter.post('/send/:id' , protectRoute , SendMessage)
export default MessageRouter;