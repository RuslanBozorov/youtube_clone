import pool from "../database/config.js";
import { config } from "dotenv";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors.js";
import { extname, join } from "path";
import fs from "fs";
config();
class FileService{
  async getUserFiles(params, next) {
    const {id} = params
      let files = await pool.query("select f.title , f.size, f.created_at , f.file_name,json_build_object('id',u.id,'name',u.username,'avatar',u.avatar) as users from files as f inner join users as u on f.user_id = u.id  where u.id=$1", [id]);
      // console.log(files.rows);

      if (!files.rowCount) {
        throw new BadRequestError("User Not found",400)
      }

      return {
        files: files.rows,
      };
  }

  async getAllFiles(req) {
  const { title } = req.query

  let query = `
    SELECT 
      files.id, 
      files.title, 
      files.size, 
      files.created_at, 
      files.file_name,
      json_build_object(
        'id', users.id,
        'name', users.username,
        'avatar', users.avatar
      ) AS users
    FROM files
    INNER JOIN users ON users.id = files.user_id
  `

  let values = []

  if (title) {
    query += ` WHERE files.title ILIKE $1`
    values.push(`%${title}%`)
  }

  const files = await pool.query(query, values)

  return {
    status: 200,
    files: files.rows
  }
}



 async getFile(req) {
  const { file_name } = req.params;

  const existFile = [".mp4",".webm",".mpeg",".avi",".mkv",".m4v",".ogm",".mov",".mpg"];
  const existFileAvatar = [".png",".jpg",".jpeg",".svg"];

  const ext = extname(file_name).toLowerCase();

  let filePath;
  if (existFile.includes(ext)) {
    filePath = join(process.cwd(), "src", "uploads", "videos", file_name);
  } else if (existFileAvatar.includes(ext)) {
    filePath = join(process.cwd(), "src", "uploads", "pictures", file_name);
  } else {
    throw new NotFoundError("file name topilmadi", 404);
  }

  return { status: 200, filePath };
}
  async createFile(req, next) {
    try {
      const { title } = req.body;
      const userId = req.user.id  
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

      file.size = +(file.size / 1024 / 1024).toFixed(2);

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

  async fileUpdate(req, next) {
    const { id } = req.user;
    const { fileId } = req.params;
    const { title } = req.body;

    const existFile = await pool.query(
      "select * from files where id=$1 and user_id=$2",
      [fileId, id]
    );
    if (!existFile.rowCount) {
      throw new NotFoundError("Not found file of this user", 404);
    }

    await pool.query("update files set title=$1 where id=$2", [title, fileId]);

    return {
      status: 201,
      message: "File succesfully updated",
    };
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

  async download(req){
    const { file_name } = req.params;

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


    let filePath;
    if (existFile.includes(extname(file_name))) {
      filePath = join(process.cwd(), "src", "uploads", "videos", file_name);
    } else {
      throw new NotFoundError("file name not found", 404);
    }

    return {
      status: 200,
      filePath,
    };
    
  }

  async search(params){
    const {data} = params
     const JoinData = await pool.query("select f.title , f.size, f.created_at , f.file_name,json_build_object('id',u.id,'name',u.username,'avatar',u.avatar) as users from files as f inner join users as u on f.user_id = u.id where u.username ilike $1 or f.title ilike $2",[`%${data}%`,`%${data}%`])
     if(JoinData.rows.length === 0){
            throw new NotFoundError(404,`not found data about ${data}`)
        }

        return JoinData.rows 
  
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
