import express from "express";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import indexRouter from "./routers/index.js";
import nodemailer from 'nodemailer'
import fs from "fs";
import { join } from "path";
import cors from "cors";

config();

const app = express();
app.use(cors());
app.use("/file", express.static(join(process.cwd(), "src", "uploads")));
app.use(fileUpload());
app.use(express.json());
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
    from:"'Google' <frontendruslan@gmail.com>",
    to:email,
    subject:"Tasdiqlash kodi",
    html:`<p>Bu kodni hech kimga bermang</p> <h2>${otp}</h2> <input type="text"> <button>junat</button> `
  })

  return res.status(200).send("Tasdiqlash kodi yuborildi")
})

app.use((error, req, res, next) => {
  // console.log(error.status);

  if (error.status && error.status < 500) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
      name: error.name,
    });
  } else {
    let errorText = `\n\n[${new Date()}--${req.method}--${req.url}--${
      error.message
    }] ${error.stack}`;

    fs.appendFileSync(
      join(process.cwd(), "src", "logs", "logger.txt"),
      errorText
    );

    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      name: error.name,
    });
  }
});

app.listen(process.env.PORT, () => console.log("Server is Running"));
