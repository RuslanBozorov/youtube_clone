import messageService from "../services/message.service.js"
class MessageController{
    async createMessage(req,res,next){
        try {
            const data = await messageService.createMessage(req)
            if(data){
                return res.status(data.status).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    async getAllMessages(req,res,next){
        try {
            const data = await messageService.getAllMessages(req)
        if(data){
            return res.status(data.status).json(data)
        }
        } catch (error) {
            next(error)
        }
    }


}

export default new MessageController()