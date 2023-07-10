import dotenv from "dotenv";
dotenv.config();
export default {
  "host": process.env.REDIS_HOST,
  "port": Number(process.env.REDIS_PORT || "6379"),
  "password": process.env.REDIS_PASSWORD
}