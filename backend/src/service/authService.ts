import bcrypt from "bcryptjs";
import { UserData } from "../interfaces/userInterface";
import {
  findUserByEmail,
  findUserByIdentifier,
  createUser,
} from "../repositories/authRepository";

import { IAuthService } from "./interfaces/IauthService";

const mapUserDocumentToUserData = (doc: any): UserData => {
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    ...obj,
    _id: obj._id.toString(),
  };
};

export const isEmailTaken: IAuthService["isEmailTaken"] = async (
  email: string
) => {
  const userDoc = await findUserByEmail(email);
  return userDoc ? mapUserDocumentToUserData(userDoc) : null;
};

export const registerUser: IAuthService["registerUser"] = async (user) => {
  const hashedPassword = bcrypt.hashSync(user.password, 10);
  const userDoc = await createUser({ ...user, password: hashedPassword });
  return mapUserDocumentToUserData(userDoc);
};

export const loginUser: IAuthService["loginUser"] = async (
  identifier,
  password
) => {
  const userDoc = await findUserByIdentifier(identifier);
  if (!userDoc) return null;

  const isValidPassword = bcrypt.compareSync(password, userDoc.password);
  return isValidPassword ? mapUserDocumentToUserData(userDoc) : null;
};
