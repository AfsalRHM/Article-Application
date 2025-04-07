import { Types } from "mongoose";

export default interface articleType {
  _id?: Types.ObjectId;
  author: any;
  category: string;
  coverImage?: string;
  title: string;
  description: string;
  tags?: string[];
  likes?: string[];
  dis_likes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
