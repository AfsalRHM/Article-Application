import { Request, Response } from "express";
import User from "../models/userModel";
import Article from "../models/articleModel";

import bcrypt from "bcryptjs";

export const blockArticleForUser = async (req: Request, res: Response) => {
  try {
    const { userId, articleId } = req.body;

    if (!userId || !articleId) {
      res
        .status(400)
        .json({ message: "Invalid or missing user id or article id" });
      return;
    }

    const article = await Article.findById(articleId);
    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { blocked_articles: articleId },
      },
      { new: true }
    );

    const { password, ...fileteredUserData } = userData!.toObject();

    res.status(200).json({
      message: "Article Blocker for the User",
      data: fileteredUserData,
    });
  } catch (error: any) {
    console.error("Error in blockArticleForUser controller:", error.message);
    res.status(500).json({ message: "Server Error! Try later." });
  }
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: "Invalid or missing user id" });
      return;
    }

    const userData = await User.findById(userId);
    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password, ...fileteredUserData } = userData!.toObject();

    res.status(200).json({
      message: "User Data Fetched Successfully",
      data: fileteredUserData,
    });
  } catch (error: any) {
    console.error("Error in getUserData controller:", error.message);
    res.status(500).json({ message: "Server Error! Try later." });
  }
};

export const updateUserProfileData = async (req: Request, res: Response) => {
  try {
    const { userId, data } = req.body;

    if (!userId) {
      res.status(400).json({ message: "Invalid or missing user id" });
      return;
    }

    const userData = await User.findById(userId);
    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    userData.first_name = data.first_name;
    userData.last_name = data.last_name;
    userData.email = data.email;
    userData.dob = data.dob;
    userData.phone_number = data.phone_number;

    await userData.save();

    const { password, ...fileteredUserData } = userData!.toObject();

    res.status(200).json({
      message: "User Data Updated Successfully",
      data: fileteredUserData,
    });
  } catch (error: any) {
    console.error("Error in updateUserProfileData controller:", error.message);
    res.status(500).json({ message: "Server Error! Try later." });
  }
};

export const updateUserPasswordData = async (req: Request, res: Response) => {
  try {
    const { userId, data } = req.body;

    if (!userId) {
      res.status(400).json({ message: "Invalid or missing user id" });
      return;
    }

    const userData = await User.findById(userId);
    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const passwordMatch = bcrypt.compareSync(
      data.currentPassword,
      userData.password
    );

    if (!passwordMatch) {
      res.status(401).json({
        message: "Incorrect Current Password",
      });
      return;
    }

    const hashedPassword = bcrypt.hashSync(data.newPassword, 10);

    userData.password = hashedPassword;

    await userData.save();

    const { password, ...fileteredUserData } = userData!.toObject();

    res.status(200).json({
      message: "User Data Updated Successfully",
      data: fileteredUserData,
    });
  } catch (error: any) {
    console.error("Error in updateUserPasswordData controller:", error.message);
    res.status(500).json({ message: "Server Error! Try later." });
  }
};

export const updateUserPreferenceData = async (req: Request, res: Response) => {
  try {
    const { userId, selectedCategories } = req.body;

    if (!userId) {
      res.status(400).json({ message: "Invalid or missing user id" });
      return;
    }

    const userData = await User.findById(userId);
    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    userData.preferences = selectedCategories;

    await userData.save();

    const { password, ...fileteredUserData } = userData!.toObject();

    res.status(200).json({
      message: "User Preference Updated Successfully",
      data: fileteredUserData,
    });
  } catch (error: any) {
    console.error("Error in updateUserPreferenceData controller:", error.message);
    res.status(500).json({ message: "Server Error! Try later." });
  }
};
