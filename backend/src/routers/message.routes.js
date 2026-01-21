import { Router } from "express";
import messageController from '../controllers/message.controller.js'
import checkToken from '../middleware/checkToken.js'
const router = Router()

router
    .post("/api/message/:user_id_to",checkToken,messageController.createMessage)
    .get("/api/message/:user_id_to",checkToken,messageController.getAllMessages)

    
export default router     