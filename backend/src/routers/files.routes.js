import { Router } from "express";
import fileController from "../controllers/files.controller.js";
import validation from "../middleware/validation.js";
import checkToken from "../middleware/checkToken.js";
const router = Router();

router
  .get("/api/files/all", fileController.getAllFiles)
  .get("/api/files/oneUser", checkToken, fileController.getUserFiles)
  .get("/api/files/:id", fileController.getUserById)

  .get("/file/:file_name", fileController.getFile)
  .get("/api/file/download/:file_name", fileController.download)
  .post(
    "/api/files",
    checkToken,
    validation.createFile,
    fileController.createFile
  )
  .put(
    "/api/files/:fileId",
    checkToken,
    validation.fileUpdateSchema,
    fileController.fileUpdateSchema
  )
  .delete("/api/files/:id", checkToken, fileController.deleteFile)
  .get("/api/search/:data", fileController.search);

export default router;
