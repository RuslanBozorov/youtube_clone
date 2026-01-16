import express from "express";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import indexRouter from "./routers/index.js";
import nodemailer from 'nodemailer'
import fs from "fs";
import { join } from "path";
import cors from "cors";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/file", express.static(join(process.cwd(), "src", "uploads")));
app.use(fileUpload());
app.use(indexRouter.userRouter);
app.use(indexRouter.fileRouter);

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"frontendruslan@gmail.com",
    pass:"fymb etmw gxnm pspw"
  }

})

app.post("/send",async(req,res)=>{
  const {email} = req.body
  const otp = Math.round(Math.random()*1000000)
 await transporter.sendMail({
    from:"'Youtube' <frontendruslan@gmail.com>",
    to:email,
    subject:"Tasdiqlash kodi",
    html:`<p>Bu kodni hech kimga bermang</p> <h2>${otp}</h2> <input type="text"> <button>junat</button> `
  })

 let otps = fs.readFileSync(join(process.cwd(),"src","database","otp.json"),"utf-8")

 otps = JSON.parse(otps) || []

 let newOtp = {
  otp,
  email,
  expire:new Date().getTime() + 120000 * 5
 }
 otps.push(newOtp)
 fs.writeFileSync(join(process.cwd(),'src','database','otp.json'),JSON.stringify(otps,null,4))
 
  return res.status(200).json({
    status:200,
    message:"Kod yuborildi"
  })
})



 
app.use(errorMiddleware)

app.listen(process.env.PORT,"::", () => console.log("Server is Running"));
