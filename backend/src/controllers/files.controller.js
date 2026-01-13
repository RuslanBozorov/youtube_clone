import fileService from "../services/files.service.js";

class FileController {
  async createFile(req, res, next) {
    try {
      const data = await fileService.createFile(req, next);
      if (data) {
        return res.status(data.status).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllFiles(req, res, next) {
    try {
      const data = await fileService.getAllFiles(req.user.id, next);
      return res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }


  async fileUpdateSchema(req,res,next){
  try {
      const data = await fileService.fileUpdate(req,next)
    if(data){
        return res.status(data.status).json(data)
    }
  } catch (error) {
    next(error)
  }
  }


  async deleteFile(req, res, next) {
    try {
      const data = await fileService.deleteFile(req, next);
      if (data) {
        return res.status(data.status).json(data);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new FileController();
