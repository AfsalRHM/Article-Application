import { Types } from "mongoose";

export default interface userType {
  _id?: Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  dob: string;
  password: string;
  preferences: string[];
  blocked_articles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
