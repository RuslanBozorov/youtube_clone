import pool from '../database/config.js'
import {extname, join} from 'path'
import { InternalServerError } from '../utils/errors.js'
class MessageService{
    async createMessage(req){
       try {
         const {user_id_to} = req.params
        const {id} = req.user

        const user = await pool.query("select * from users where id=$1",[user_id_to])
        let file
        if(req.files){
            file=req.files.file
        }

        const fileName = req.files && new Date().getTime() + extname(file.name)
        // console.log(fileName);
        
     const newMessage = await pool.query("insert into message(message_type,message,user_id_to,user_to_from) values($1,$2,$3,$4) RETURNING *",
            [file ? file.mimetype:"text/plain",file ? fileName : req.body.text,user_id_to,id]
        )

        process.io.to(user.rows[0].socket_id).emit("send_message",newMessage.rows[0].message,file ? file.mimetype : "plan/text")

        file && file.mv(join(process.cwd(),'src','uploads','media',fileName),
        (err)=>{
            if(err){
                throw new InternalServerError(err,500)
            }
        }
        )

       return{
        status:201,
        message:"message send"
       }

       } catch (error) {
        console.log(error);
                
       }

    }


    async getAllMessages(req){
        const {user_id_to} = req.params
        const {id} = req.user 
        //user_to_from shuni adashib nomini boshqacha qilib quyipman dbda asli user_id_from
       const message = await pool.query(`select * from message where
            
            (user_to_from = $1 and user_id_to = $2) 
            or
            (user_id_to = $1 and user_to_from = $2)`,[id,user_id_to])  
            // console.log(message.rows);
           
    return{
        status:200,
        message:message.rows
    }        
    }
}

export default new MessageService() 