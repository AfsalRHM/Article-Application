import { Request, Response } from "express";

import { StatusCode } from "../constants/statusCodes";

import {
  _blockArticleForUser,
  _getUserData,
  _updateUserPasswordData,
  _updateUserPreferenceData,
  _updateUserProfileData,
} from "../service/userService";
import { IUserController } from "./interfaces/IuserController";

export const blockArticleForUser: IUserController["blockArticleForUser"] = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const { articleId } = req.body;

      if (!userId || !articleId) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: "Invalid or missing user id or article id" });
        return;
      }

      const respone = await _blockArticleForUser({ userId, articleId });

      res.status(StatusCode.OK).json({
        message: "Article Blocker for the User",
        data: respone,
      });
    } catch (error: any) {
      console.error("Error in blockArticleForUser controller:", error.message);
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server Error! Try later." });
    }
  };

export const getUserData: IUserController["getUserData"] = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Invalid or missing user id" });
      return;
    }

    const userData = await _getUserData(userId);

    res.status(StatusCode.OK).json({
      message: "User Data Fetched Successfully",
      data: userData,
    });
  } catch (error: any) {
    console.error("Error in getUserData controller:", error.message);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Server Error! Try later." });
  }
};

export const updateUserProfileData: IUserController["updateUserProfileData"] = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const { data } = req.body;

      if (!userId) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: "Invalid or missing user id" });
        return;
      }

      const updatedUserData = await _updateUserProfileData(userId, data);

      res.status(StatusCode.OK).json({
        message: "User Data Updated Successfully",
        data: updatedUserData,
      });
    } catch (error: any) {
      console.error(
        "Error in updateUserProfileData controller:",
        error.message
      );
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server Error! Try later." });
    }
  };

export const updateUserPasswordData: IUserController["updateUserPasswordData"] = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const { data } = req.body;

      if (!userId) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: "Invalid or missing user id" });
        return;
      }

      const updatedUserData = await _updateUserPasswordData(userId, data);

      res.status(StatusCode.OK).json({
        message: "User Data Updated Successfully",
        data: updatedUserData,
      });
    } catch (error: any) {
      console.error(
        "Error in updateUserPasswordData controller:",
        error.message
      );
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server Error! Try later." });
    }
  };

export const updateUserPreferenceData: IUserController["updateUserPreferenceData"] = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const { selectedCategories } = req.body;

      if (!userId) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: "Invalid or missing user id" });
        return;
      }

      const updatedUserData = await _updateUserPreferenceData(
        userId,
        selectedCategories
      );

      res.status(StatusCode.OK).json({
        message: "User Preference Updated Successfully",
        data: updatedUserData,
      });
    } catch (error: any) {
      console.error(
        "Error in updateUserPreferenceData controller:",
        error.message
      );
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server Error! Try later." });
    }
  };
