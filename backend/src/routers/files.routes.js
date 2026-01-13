import { Router } from "express";
import fileController from '../controllers/files.controller.js'
import validation from "../middleware/validation.js";
import checkToken from "../middleware/checkToken.js";
const router = Router()


router
    .get("/api/files/oneUser",checkToken,fileController.getAllFiles)
    .post("/api/files",validation.createFile,fileController.createFile)
    .put("/api/files/:fileId",checkToken,validation.fileUpdateSchema,fileController.fileUpdateSchema)
    .delete("/api/files/:fileId",checkToken,fileController.deleteFile)
    



export default router    