import dotenv from "dotenv";
dotenv.config();
export default {
    mongoUri: process.env.MONGO_URI,
    mongoName: process.env.MONGO_NAME
}