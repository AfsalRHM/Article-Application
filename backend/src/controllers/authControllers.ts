import { Request, Response } from "express";
import {
  loginValidation,
  registerValidation,
} from "../validators/userValidators";

import * as yup from "yup";
import User from "../models/userModel";

import bcrypt from "bcryptjs";

type userDataType = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  dob: string;
  password: string;
  preferences: string[];
};

export const userRegister = async (req: Request, res: Response) => {
  try {
    await registerValidation.validate(req.body, { abortEarly: false });

    const {
      firstName,
      lastName,
      phone,
      email,
      dob,
      password,
      articlePreferences,
    } = req.body;

    const emailExists = await User.findOne({ email: email });

    if (emailExists) {
      res
        .status(409)
        .json({ status: true, message: "User with email already registered" });
      return;
    } else {
      const encryptedPassword = bcrypt.hashSync(password, 10);

      const userData = await User.insertOne({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phone,
        dob,
        password: encryptedPassword,
        preferences: articlePreferences,
      });

      if (userData) {
        res.status(200).json({
          status: true,
          message: "User Registered Successfully",
          data: userData,
        });
      } else {
        res.status(200).json({ message: "Unable to Register User" });
      }
    }
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(400).json({ errors });
      return;
    }
    console.log(error.message, "error on the userRegister controller");
    res.status(400).json({ message: "error while validate" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    await loginValidation.validate(req.body, { abortEarly: false });

    const { identifier, password } = req.body;

    const existingUser: userDataType | null = await User.findOne({
      $or: [{ email: identifier }, { phone_number: identifier }],
    }).lean();

    if (!existingUser) {
      res.status(404).json({ message: "Invalid Credential" });
    } else if (existingUser) {
      const passwordCompare = bcrypt.compareSync(
        password,
        existingUser.password
      );

      if (passwordCompare) {
        const { password, ...userFilteredData } = existingUser;

        res.status(200).json({
          status: true,
          message: "User Login Successfull",
          data: userFilteredData,
        });
      } else {
        res.status(401).json({ message: "Invalid Credential" });
      }
    }
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(400).json({ errors });
      return;
    }
    console.log(error.message, "error on the userLogin controller");
    res.status(400).json({ message: "error while validate" });
  }
};
