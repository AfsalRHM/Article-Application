import bcrypt from "bcryptjs";

import {
  blockArticleForUser,
  findUserById,
  updateUserPassword,
  updateUserPreferences,
  updateUserProfile,
} from "../repositories/userRepository";
import { findArticleById } from "../repositories/articleRepository";
import {
  UpdatePasswordData,
  UpdateProfileData,
} from "./interfaces/IuserService";

import IUserService from "./interfaces/IuserService";

export const _blockArticleForUser: IUserService["blockArticleForUser"] = async ({ userId, articleId }: { userId: string; articleId: string }) => {
    try {
      const article = await findArticleById(articleId);
      if (!article) {
        throw new Error("Article not found");
      }

      const user = await findUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const updatedUser = await blockArticleForUser(userId, articleId);
      if (!updatedUser) {
        throw new Error("Failed to update user with blocked article");
      }

      const { password, ...filteredUserData } = updatedUser.toObject();

      return filteredUserData;
    } catch (error: any) {
      console.error("Error in blockArticleForUserService:", error.message);
      throw new Error(error.message || "Failed to block article for user");
    }
  };

export const _getUserData: IUserService["getUserData"] = async (
  userId: string
) => {
  try {
    const userData = await findUserById(userId);
    if (!userData) {
      throw new Error("User not found");
    }

    const { password, ...filteredUserData } = userData.toObject();
    return filteredUserData;
  } catch (error: any) {
    console.error("Error in getUserData service:", error.message);
    throw new Error(error.message || "Failed to fetch user data");
  }
};

export const _updateUserProfileData: IUserService["updateUserProfileData"] = async (userId: string, data: UpdateProfileData) => {
    try {
      const userData = await findUserById(userId);
      if (!userData) {
        throw new Error("User not found");
      }

      const updatedUser = await updateUserProfile(userId, data);

      if (!updatedUser) {
        throw new Error("Failed to update user profile");
      }

      const { password, ...filteredUserData } = updatedUser.toObject();
      return filteredUserData;
    } catch (error: any) {
      console.error("Error in updateUserProfileData service:", error.message);
      throw new Error(error.message || "Failed to update user profile data");
    }
  };

export const _updateUserPasswordData: IUserService["updateUserPasswordData"] = async (userId: string, data: UpdatePasswordData) => {
    try {
      const userData = await findUserById(userId);
      if (!userData) {
        throw new Error("User not found");
      }

      const passwordMatch = bcrypt.compareSync(
        data.currentPassword,
        userData.password
      );
      if (!passwordMatch) {
        throw new Error("Incorrect current password");
      }

      const hashedPassword = bcrypt.hashSync(data.newPassword, 10);

      const updatedUser = await updateUserPassword(userId, hashedPassword);

      if (!updatedUser) {
        throw new Error("Failed to update user password");
      }

      const { password, ...filteredUserData } = updatedUser.toObject();
      return filteredUserData;
    } catch (error: any) {
      console.error("Error in updateUserPasswordData service:", error.message);
      throw new Error(error.message || "Failed to update user password");
    }
  };

export const _updateUserPreferenceData: IUserService["updateUserPreferenceData"] = async (userId: string, selectedCategories: string[]) => {
    try {
      const userData = await findUserById(userId);
      if (!userData) {
        throw new Error("User not found");
      }

      const updatedUser = await updateUserPreferences(
        userId,
        selectedCategories
      );

      if (!updatedUser) {
        throw new Error("Failed to update user preferences");
      }

      const { password, ...filteredUserData } = updatedUser.toObject();
      return filteredUserData;
    } catch (error: any) {
      console.error(
        "Error in updateUserPreferenceData service:",
        error.message
      );
      throw new Error(error.message || "Failed to update user preferences");
    }
  };
