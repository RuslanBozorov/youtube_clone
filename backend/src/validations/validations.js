import Joi from "joi";

class Validations{
    registerSchema = Joi.object({
        username:Joi.string().alphanum().min(3).max(20).required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$'))
    })


    loginSchema = Joi.object({
        username:Joi.string().alphanum().min(3).max(20).required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$'))
    })


    fileUpdateSchema = Joi.object({
        title:Joi.string().min(3).max(20).required(),
    })

    createFile = Joi.object({
        title:Joi.string().min(3).max(20).required(),
        userId:Joi.string().required()
    }) 


}

export default new Validations() 