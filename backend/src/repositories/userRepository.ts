import User from "../models/userModel";
import { UpdateProfileData } from "../service/interfaces/IuserService";

export const findUserById = async (userId: string) => {
  return await User.findById(userId);
};

export const blockArticleForUser = async (
  userId: string,
  articleId: string
) => {
  return await User.findByIdAndUpdate(
    userId,
    { $addToSet: { blocked_articles: articleId } },
    { new: true }
  );
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileData
) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        dob: data.dob,
        phone_number: data.phone_number,
      },
    },
    { new: true }
  );
};

export const updateUserPassword = async (
  userId: string,
  hashedPassword: string
) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: { password: hashedPassword } },
    { new: true }
  );
};

export const updateUserPreferences = async (
  userId: string,
  selectedCategories: string[]
) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: { preferences: selectedCategories } },
    { new: true }
  );
};
