import pool from '../database/config.js'
import { comparePassword, hashPassword } from '../utils/bcrypt.js';
import { ConflictError, InternalServerError, NotFoundError } from '../utils/errors.js';
import {join,extname} from 'path'
import Jwt from 'jsonwebtoken'
class UserService{

    async register(body,files,next){
        try {
            const {username,password} = body
        const {file} = files

        let fileName = new Date().getTime() + extname(file.name) ;
        
        
        const existName = await pool.query("select * from users where username = $1",[username])

        if(existName.rowCount){
          throw new ConflictError("User mavjud",409)
        }

        const newUser = await pool.query("insert into users(username,password,avatar) values($1,$2,$3) RETURNING *",
            [username,await hashPassword(password),fileName]
        )

        file.mv(join(process.cwd(),'src','uploads','pictures',fileName),(err)=>{
            if(err){
             throw new InternalServerError(err,500)
            }
        })

        return{
            status:201,
            message:"User success created",
            accessToken:Jwt.sign({id:newUser.rows[0].id,username:newUser.rows[0].username},process.env.JWT_PASSWORD,{expiresIn:'10m'}),
            refreshToken:Jwt.sign({id:newUser.rows[0].id,username:newUser.rows[0].username},process.env.JWT_PASSWORD,{expiresIn:'1d'})
        }
        } catch (error) {
            next(error)
        }
    }

    async login(body,next){
        try {
            const {username,password} = body

        const existUser = await pool.query("select * from users where username = $1",
            [username]
        )

        if(!existUser.rowCount){
          throw new NotFoundError("username or password wrong",404)
        }

        if(!(await comparePassword(password,existUser.rows[0].password))){
            throw new NotFoundError("username or password wrong",404)
        }

        return{
            status:201,
            message:"User success login",
            accessToken:Jwt.sign({id:existUser.rows[0].id,username:existUser.rows[0].username},process.env.JWT_PASSWORD,{expiresIn:'10m'}),
            refreshToken:Jwt.sign({id:existUser.rows[0].id,username:existUser.rows[0].username},process.env.JWT_PASSWORD,{expiresIn:'1d'})
        }
        } catch (error) {
            next(error)
        }
    }


    async getAllUsers(req,res,next){
       const users = await pool.query("select id,username,avatar from users")
       return users.rows
    }



}


export default new UserService()