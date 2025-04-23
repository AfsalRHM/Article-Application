import express from "express";
import { blockArticleForUser, getUserData, updateUserPasswordData, updateUserPreferenceData, updateUserProfileData } from "../controllers/userController";

const userRoute = express.Router();

userRoute.get("/:userId", getUserData);

userRoute.post("/:userId/block-article", blockArticleForUser);

userRoute.patch("/:userId/profile", updateUserProfileData);
userRoute.patch("/:userId/password", updateUserPasswordData);
userRoute.patch("/:userId/preference", updateUserPreferenceData);

export default userRoute;
