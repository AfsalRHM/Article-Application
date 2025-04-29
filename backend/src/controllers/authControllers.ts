import { Request, Response } from "express";
import * as yup from "yup";

import {
  loginValidation,
  registerValidation,
} from "../validators/userValidators";

import { isEmailTaken, registerUser, loginUser } from "../service/authService";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

import { StatusCode } from "../constants/statusCodes";
import { JwtPayload } from "jsonwebtoken";
import { IAuthController } from "./interfaces/IauthController";

export const userRegister: IAuthController["userRegister"] = async (
  req: Request,
  res: Response
) => {
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

    const emailExists = await isEmailTaken(email);
    if (emailExists) {
      res.status(StatusCode.CONFLICT).json({
        status: true,
        message: "User with email already registered",
      });
    }

    const newUser = await registerUser({
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      email,
      dob,
      password,
      preferences: articlePreferences,
    });

    res.status(StatusCode.OK).json({
      status: true,
      message: "User Registered Successfully",
      data: newUser,
    });
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(StatusCode.BAD_REQUEST).json({ errors });
    }
    console.error("Register Error:", error.message);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

export const userLogin: IAuthController["userLogin"] = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await loginValidation.validate(req.body, { abortEarly: false });
    const { identifier, password } = req.body;

    const user = await loginUser(identifier, password);
    if (!user) {
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
      return;
    }

    const { password: _, ...userData } = user;

    const accessToken = signAccessToken({
      userId: user?._id,
      userEmail: user?.email,
    });
    const refreshToken = signRefreshToken({
      userId: user?._id,
      userEmail: user?.email,
    });

    res
      .status(StatusCode.OK)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        status: true,
        message: "Login successful",
        accessToken,
        data: userData,
      });
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(StatusCode.BAD_REQUEST).json({ errors });
      return;
    }
    console.error("Login Error:", error.message);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Login failed" });
  }
};

export const refreshToken: IAuthController["refreshToken"] = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "No refresh token found" });
    }

    const decoded = verifyRefreshToken(token) as JwtPayload;
    const accessToken = signAccessToken({
      userId: decoded.userId,
      userEmail: decoded.userEmail,
    });

    res.status(StatusCode.OK).json({ accessToken });
  } catch (error: any) {
    console.error("Refresh Token Error:", error.message);
    res
      .status(StatusCode.UNAUTHORIZED)
      .json({ message: "Invalid refresh token" });
  }
};

export const userLogout: IAuthController["userLogout"] = async (
  req: Request,
  res: Response
) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(StatusCode.OK).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout Error:", error.message);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Logout failed" });
  }
};
