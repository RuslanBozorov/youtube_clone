import { Router } from "express";
import userController from '../controllers/user.controller.js'
import validation from "../middleware/validation.js";
const router = Router()


router
    .post("/api/register",validation.register,userController.register)
    .post("/api/login",validation.login,userController.login)

    .get("/api/users",userController.getAllUser)



export default router    