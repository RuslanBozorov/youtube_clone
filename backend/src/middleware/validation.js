import { BadRequestError, InternalServerError, NotFoundError } from "../utils/errors.js";
import validations from "../validations/validations.js";

class UserMiddleware {
  register = (req, res, next) => {
    try {
      const { error } = validations.registerSchema.validate(req.body);


    if (error) {
       throw  next(new BadRequestError(error.details[0].message,400,))
    }
    next();
    } catch (error) {
      next(error)
    }
  };

  login = (req, res, next) => {
    try {
      const { error } = validations.loginSchema.validate(req.body);


    if (error) {
        throw next(new NotFoundError(error.details[0].message,400,))
    }
    next();
    } catch (error) {
       next(error)
    }
  };


  createFile = (req, res, next) => {
    try {
      const { error } = validations.createFile.validate(req.body);


    if (error) {
        throw next(new BadRequestError(error.details[0].message,400,))
    }
    next();
    } catch (error) {
       next(error)
    }
  };


  fileUpdateSchema = (req,res,next)=>{
    try {
      const { error } = validations.fileUpdateSchema.validate(req.body);


    if (error) {
        throw next(new BadRequestError(error.details[0].message,400,))
    }
    next();
    } catch (error) {
       next(error)
    }
  }

}

export default new UserMiddleware();
