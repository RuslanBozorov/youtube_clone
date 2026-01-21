import fileService from "../services/files.service.js";

class FileController {
  async createFile(req, res, next) {
    try {
      const data = await fileService.createFile(req, next);
      if (data) {
        return res.status(data.status).json(data);
      }
    } catch (error) {
      console.log(error);
      
      next(error);
    }
  }

  async getUserFiles(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await fileService.getUserFiles(userId, next);
      return res.status(200).json({
        status: 200,
        files: data.files,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const data = await fileService.getUserById(req, next);
      return res.status(200).json({
        status: 200,
        files: data.files,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllFiles(req, res, next) {
    try {
      const data = await fileService.getAllFiles(req);

      return res.status(data.status).json({
        status: data.status,
        files: data.files,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFile(req, res, next) {
    try {
      const data = await fileService.getFile(req);
      return res.sendFile(data.filePath);
    } catch (error) {
      next(error);
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
      const userId = req.user.id;
      const fileId = Number(req.params.id);
      const data = await fileService.deleteFile({ userId, fileId });
      return res.status(200).json({
        status: 200,
        message: "File deleted",
        deleted: data.deleted,
      });
    } catch (error) {
      next(error);
    }
  }

  async download(req, res, next) {
    try {
      const data = await fileService.download(req);
      if (data) {
        return res.status(data.status).download(data.filePath);
      }
    } catch (error) {
      next(error);
    }
  }
  async search(req, res, next) {
    try {
      const files = await fileService.search(req.params);
      if (files) {
        return res.status(200).json({
          status: 200,
          files,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new FileController();
