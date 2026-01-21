import pool from "../database/config.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors.js";
import { join, extname } from "path";
import Jwt from "jsonwebtoken";
import fs from 'fs'

class UserService {
  async register(body, files, next) {
      const { username, password,email,otp} = body;
      const socketId = process.socketId
      const { file } = files;
      console.log(username,email,otp,socketId);
      // console.log(body);
      

      let otps = fs.readFileSync(join(process.cwd(),"src","database","otp.json"),"utf-8")

      otps = JSON.parse(otps)

    const existOtp = otps.find(item => item.otp == otp && item.email == email)
    
    if(!existOtp){
      throw new   BadRequestError("email or otp wrong",400)
    }

    if(existOtp.expire < Date.now()){
      throw new BadRequestError("OTP muddati tugadi",400)
    }

      const fileName = new Date().getTime() + extname(file.name);
      console.log(fileName);
      
      const existFile = [".png", ".jpg", ".jpeg", ".svg"];

      if (!existFile.includes(extname(file.name))) {
        throw new BadRequestError("file mos kelmadi", 400);
      }

      const existName = await pool.query(
        "select * from users where username = $1",
        [username]
      );

      if (existName.rowCount) {
        throw new ConflictError("User mavjud", 409);
      }

      const newUser = await pool.query(
        "insert into users(username,email,password,avatar,socket_id) values($1,$2,$3,$4,$5) RETURNING *",
        [username,email, await hashPassword(password),fileName,socketId]
      );

      file.mv(
        join(process.cwd(), "src", "uploads", "pictures", fileName),
        (err) => {
          if (err) {
            throw new InternalServerError(err, 500);
          }
        }
      );
      return {
        status: 201,
        message: "User success created",
        avatar: fileName,
        accessToken: Jwt.sign(
          { id: newUser.rows[0].id, username: newUser.rows[0].username },
          process.env.JWT_PASSWORD,
          { expiresIn: "1h" }
        ),
        refreshToken: Jwt.sign(
          { id: newUser.rows[0].id, username: newUser.rows[0].username },
          process.env.JWT_PASSWORD,
          { expiresIn: "1d" }
        ),
      };
  }

  async login(body, next) {
    try {
      const { username, password } = body;

      const existUser = await pool.query(
        "select * from users where username = $1",
        [username]
      );

      if (!existUser.rowCount) {
        throw new NotFoundError("username or password wrong", 404);
      }

      if (!(await comparePassword(password, existUser.rows[0].password))) {
        throw new NotFoundError("username or password wrong", 404);
      }

      return {
        status: 201,
        message: "User success login",
        avatar: existUser.rows[0].avatar,
        accessToken: Jwt.sign(
          { id: existUser.rows[0].id, username: existUser.rows[0].username },
          process.env.JWT_PASSWORD,
          { expiresIn: "1h" }
        ),
        refreshToken: Jwt.sign(
          { id: existUser.rows[0].id, username: existUser.rows[0].username },
          process.env.JWT_PASSWORD,
          { expiresIn: "1d" }
        ),
      };
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    const users = await pool.query("select id,username,avatar from users");
    return users.rows;
  }
}

export default new UserService();
