import userService from "../services/user.service.js";

class UserController {
  async register(req, res, next) {
    try {
      const data = await userService.register(req.body, req.files, next);
      if (data) {
        return res.status(data.status).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async login(req,res,next){
    try {
        const data = await userService.login(req.body,next)
        if(data){
            return res.status(data.status).json(data)
        }
    } catch (error) {
        next(error)
    }
  }


  async getAllUser(req,res,next){
    try {
        const data = await userService.getAllUsers(next)
        if(!data.length){
            return res.status(200).json({
                status:200,
                message:"Users empty"
            })
        }

        return res.status(200).json({
            status:200,
            data
        })
    } catch (error) {
        next(error)
    }
  }
}

export default new UserController();
