import dotenv from "dotenv";
dotenv.config();
export default {
    "port": process.env.PORT,
    "secret": process.env.SECRET,
    "expiresIn": 2592000,
    "admin": process.env.ADMIN,
    "api": process.env.API
}