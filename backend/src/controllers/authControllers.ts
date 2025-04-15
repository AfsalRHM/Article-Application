import { Request, Response } from "express";
import {
  loginValidation,
  registerValidation,
} from "../validators/userValidators";

import * as yup from "yup";

import bcrypt from "bcryptjs";
import {
  checkMailDuplicate,
  findUser,
  insertUser,
} from "../service/authService";
import { StatusCode } from "../constants/statusCodes";

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

    const emailExists = await checkMailDuplicate({ email: email });

    if (emailExists) {
      res
        .status(StatusCode.CONFLICT)
        .json({ status: true, message: "User with email already registered" });
      return;
    } else {
      const encryptedPassword = bcrypt.hashSync(password, 10);

      const userData = await insertUser({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phone,
        dob,
        password: encryptedPassword,
        preferences: articlePreferences,
      });

      if (userData) {
        res.status(StatusCode.OK).json({
          status: true,
          message: "User Registered Successfully",
          data: userData,
        });
      } else {
        res.status(StatusCode.OK).json({ message: "Unable to Register User" });
      }
    }
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(StatusCode.BAD_REQUEST).json({ errors });
      return;
    }
    console.log(error.message, "error on the userRegister controller");
    res
      .status(StatusCode.BAD_REQUEST)
      .json({ message: "error while validate" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    await loginValidation.validate(req.body, { abortEarly: false });

    const { identifier, password } = req.body;

    const existingUser: userDataType | null | undefined = await findUser({
      identifier,
    });

    if (!existingUser) {
      res.status(StatusCode.NOT_FOUND).json({ message: "Invalid Credential" });
    } else if (existingUser) {
      const passwordCompare = bcrypt.compareSync(
        password,
        existingUser.password
      );

      if (passwordCompare) {
        const { password, ...userFilteredData } = existingUser;

        res.status(StatusCode.OK).json({
          status: true,
          message: "User Login Successfull",
          data: userFilteredData,
        });
      } else {
        res
          .status(StatusCode.UNAUTHORIZED)
          .json({ message: "Invalid Credential" });
      }
    }
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(StatusCode.BAD_REQUEST).json({ errors });
      return;
    }
    console.log(error.message, "error on the userLogin controller");
    res
      .status(StatusCode.BAD_REQUEST)
      .json({ message: "error while validate" });
  }
};
