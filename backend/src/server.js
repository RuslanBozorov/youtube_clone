import express from "express";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import indexRouter from "./routers/index.js";
import cors from "cors";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import {Server} from 'socket.io'
import http from 'http'
import Jwt from 'jsonwebtoken'
import pool from "./database/config.js";
config();



const app = express();
app.use(express.json());
app.use(fileUpload())
app.use(cors());

app.use(indexRouter.userRouter);
app.use(indexRouter.fileRouter);
app.use(indexRouter.messageRouter);
app.use(indexRouter.otpRouter);


const server = http.createServer(app, {
  cors: { origin: "*"},
  transports: ["websocket", "polling"],
});
const io = new Server(server)

io.on("connection", async socket => {
 try {
   process.socketId = socket.id
   process.io = io
  const token = socket.handshake.auth.headers
  const user = Jwt.verify(token,process.env.JWT_PASSWORD)
  await pool.query("update users set socket_id=$1 where id=$2",[socket.id,user.id]) 
  //tokenni vaqti tugagan bulishi mumkin agar malumot chiqmasa
  // console.log(user.id,socket.id);
 } catch (error) {
  console.log(error);
   
 }
  
}); 

app.use(errorMiddleware);

server.listen(process.env.PORT, () => console.log("Server is Running"));
 