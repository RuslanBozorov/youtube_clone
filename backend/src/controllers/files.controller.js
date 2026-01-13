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

  async getUserFiles(req, res, next) {
    try {
      const data = await fileService.getUserFiles(req.user.id, next);
      return res.status(data.status).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getAllFiles(req, res, next) {
    try {
      const data = await fileService.getAllFiles(req, next);
      if (data) {
        return res.status(data.status).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async getFile(req,res,next){
    try {
      const data = await fileService.getFile(req)
      if(data){
        return res.status(data.status).sendFile(data.filePath)
      }
    } catch (error) {
      next(error)
    }
  }
  

  async downloadFile(req,res,next){
    try {
      const data = await fileService.downloadFile(req)
      if(data){
        return res.status(data.status).sendFile(data.filePath)
      }
    } catch (error) {
      next(error)
    }
  }

  async fileUpdateSchema(req, res, next) {
    try {
      const data = await fileService.fileUpdate(req, next);
      if (data) {
        return res.status(data.status).json(data);
      }
    } catch (error) {
      next(error);
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
