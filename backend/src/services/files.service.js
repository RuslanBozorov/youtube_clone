import pool from "../database/config.js";
import { config } from "dotenv";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors.js";
import { extname, join } from "path";
import fs from "fs";
config()
class FileService {
  async getUserFiles(userId, next) {
    try {
      let files = await pool.query("select * from files where user_id=$1", [
        userId,
      ]);
      console.log(files.rows);

      if (!files.rowCount) {
        return {
          status: 200,
          message: "User has no videos",
          files: [],
        };
      }

      return {
        status: 200,
        files: files.rows,
      };
    } catch (error) {
      next(error);
    }
  }


  async getAllFiles(req){
      const {title} = req.query

      let files
      
      if(!title){
        files = await pool.query("select files.id, files.title, files.size, files.created_at, files.file_name, json_build_object('id',users.id, 'name', users.username,'avatar', users.avatar) as users from files inner join users on users.id = files.user_id ")
      }else{
        files = await pool.query(`select files.id, files.title, files.size, files.created_at, files.file_name, json_build_object('id',users.id, 'name', users.username,'avatar', users.avatar) as users from files  inner join users on users.id = files.user_id where title ilike '%${title}%' `)
      }

      return{
        status:200,
        files:files.rows
      }       
      }




  async getFile(req){
    const {file_name} = req.params
    

    const existFile = [
        ".mp4",
        ".webm",
        ".mpeg",
        ".avi",
        ".mkv",
        ".m4v",
        ".ogm",
        ".mov",
        ".mpg",
      ];

      const existFileAvatar = [".png",".jpg",".jpeg",".svg"]
        

      let filePath
      if(existFile.includes(extname(file_name))){
          filePath  = join(process.cwd(),'src','uploads','videos',file_name)
      }else if(existFileAvatar.includes(extname(file_name))){
        
          filePath  = join(process.cwd(),'src','uploads','pictures',file_name)
      }else{

       throw new NotFoundError("file name topilmadi",404)
      }

      return {
        status:200,
        filePath
      }
  }   

  async createFile(req, next) {
    try {
      const { title, userId } = req.body;
      const { file } = req.files;

      const existFile = [
        ".mp4",
        ".webm",
        ".mpeg",
        ".avi",
        ".mkv",
        ".m4v",
        ".ogm",
        ".mov",
        ".mpg",
      ];

      if (!existFile.includes(extname(file.name))) {
        throw new BadRequestError("Not supportes file", 400);
      }

      const fileName = new Date().getTime() + extname(file.name);

      const existUser = await pool.query("select * from users where id=$1", [
        userId,
      ]);

      if (!existUser.rowCount) {
        throw new NotFoundError("User not found", 404);
      }

      await file.mv(
        join(process.cwd(), "src", "uploads", "videos", fileName),
        (err) => {
          if (err) {
            throw new InternalServerError(err, 500);
          }
        }
      );

      file.size = +(file.size/1024/1024).toFixed(2)

      await pool.query(
        "insert into files(title,file_name,size,user_id) values($1,$2,$3,$4)",
        [title, fileName, file.size, userId]
      );

      return {
        status: 201,
        message: "Video successfuly save",
        file: `${file.size}mb`,
      };
    } catch (error) {
      next(error);
    }
  }


  async fileUpdate(req,next){
    const {id} = req.user 
    const {fileId} = req.params
    const {title} = req.body


    const existFile = await pool.query(
      "select * from files where id=$1 and user_id=$2",
      [fileId, id]
    );
    if (!existFile.rowCount) {
      throw new NotFoundError("Not found file of this user", 404);
    }

    await pool.query("update files set title=$1 where id=$2",[title,fileId])

    return {
        status:201,
        message:"File succesfully updated"
    }
  }


  async deleteFile(req, next) {
    const { id } = req.user;
    const { fileId } = req.params;

    const existFile = await pool.query(
      "select * from files where id=$1 and user_id=$2",
      [fileId, id]
    );
    if (!existFile.rowCount) {
      throw new NotFoundError("Not found file of this user", 404);
    }

    await pool.query("delete from files where id=$1", [fileId]);
    fs.unlinkSync(
      join(
        process.cwd(),
        "src",
        "uploads",
        "videos",
        existFile.rows[0].file_name
      )
    );
    return {
      status: 200,
      message: "File successfuly deleted",
    };
  }


  async downloadFile(req){
    // ustoz shunaqa download yozib kenglar degan ekan
  }
  
}

export default new FileService();

/*
[
{

id:1,
title:"Salom",
size:23,
createdAt:"2026-01-12",
file_name:"Ali.png"
user:{
id:1,
username:"Ali",
avatar:"2343232.png"
}

}
]
*/