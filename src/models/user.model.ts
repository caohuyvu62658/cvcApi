import { Schema, Document, model, Model } from "mongoose";

interface IUser {
  username?: string,
  password?: string,
  createdAt?: Date,
  updatedAt?: Date
}
interface IUserDocument extends Document, IUser {

}
interface IUserModel extends Model<IUserDocument> {

}
const schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});
const User = model<IUser, IUserModel>("User", schema);
export {
  User,
  IUserDocument,
  IUserModel,
  IUser
}
export default User;