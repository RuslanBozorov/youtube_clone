import pool from "../database/config.js"
import {NotFoundError, UnauthorizedError } from "../utils/errors.js"
import JWT from 'jsonwebtoken'
export default async(req,res,next)=>{
  try {
     const {token} = req.headers
    //  console.log(token);
     
    if(!token){
        throw new UnauthorizedError("Don't send without token")
    }

    const data = JWT.verify(token,process.env.JWT_PASSWORD)
    // console.log(data);

   const user = await pool.query("select * from users where id=$1",[data.id])
  //  console.log(user);
   
   
   if(!user.rowCount){
        throw new NotFoundError("user not found",404)
   }

   req.user = data
   next()

  } catch (error) {
    if(error.name === "TokenExpiredError"){
        error.status=400
        next(error)
    }else{
        next(error)
    }    
  }

    
    
}