import { Pool } from "pg";
import { config } from "dotenv";
config()

const pool = new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD
})
 
async function db_connect(){
    try {
        pool.connect()
        console.log("✅Database is connection");
    } catch (error) {
        console.log("❌Database is deactivate");
    }
}

db_connect()
export default pool