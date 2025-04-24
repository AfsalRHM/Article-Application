import express from "express";
import {
  blockArticleForUser,
  getUserData,
  updateUserPasswordData,
  updateUserPreferenceData,
  updateUserProfileData,
} from "../controllers/userController";
import { verifyToken } from "../middlewares/verifyToken";

const userRoute = express.Router();

userRoute.get("/:userId", verifyToken, getUserData);

userRoute.post("/:userId/block-article", verifyToken, blockArticleForUser);

userRoute.patch("/:userId/profile", verifyToken, updateUserProfileData);
userRoute.patch("/:userId/password", verifyToken, updateUserPasswordData);
userRoute.patch("/:userId/preference", verifyToken, updateUserPreferenceData);

export default userRoute;
