import User from "../models/userModel";
import { UserData } from "../interfaces/userInterface";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const findUserByIdentifier = async (identifier: string | number) => {
  return await User.findOne({
    $or: [{ email: identifier }, { phone_number: identifier }],
  }).lean();
};

export const createUser = async (user: UserData) => {
  return await User.insertOne(user);
};
