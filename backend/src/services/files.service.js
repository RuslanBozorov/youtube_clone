import pool from "../database/config.js";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/errors.js";
import { extname, join } from "path";
import fs from "fs";
import { log } from "console";
class FileService {
  async getAllFiles(userId, next) {
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

      if (file.size / 1024 / 1024 < 1) {
        file.size = Math.ceil(file.size / 1024 / 1024);
      } else {
        Math.floor(file.size / 1024 / 1024);
      }

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

  
}

export default new FileService();
