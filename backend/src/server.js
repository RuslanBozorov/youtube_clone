import express from 'express'
import { config } from 'dotenv'
import fileUpload from 'express-fileupload'
import indexRouter from './routers/index.js'
import fs from 'fs'
import { join } from 'path'

config()

const app = express()
app.use(fileUpload())
app.use(express.json())
app.use(indexRouter.userRouter)
app.use(indexRouter.fileRouter)

app.use((error,req,res,next)=>{
    // console.log(error.status);
    
    if(error.status && error.status < 500){
        return res.status(error.status).json({
            status:error.status,
            message:error.message,
            name:error.name
        })
    }else{ 
        let errorText = `\n\n[${new Date()}--${req.method}--${req.url}--${error.message}] ${error.stack}`

        fs.appendFileSync(join(process.cwd(),'src','logs','logger.txt'),errorText)

         res.status(500).json({
            status:500,
            message:"Internal Server Error",
            name:error.name
        })
    }    


})



app.listen(process.env.PORT,()=> console.log("Server is Running"))

