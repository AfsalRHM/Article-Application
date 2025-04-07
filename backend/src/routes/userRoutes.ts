import express from "express";
import { blockArticleForUser, getUserData, updateUserPasswordData, updateUserPreferenceData, updateUserProfileData } from "../controllers/userController";

const userRoute = express.Router();

userRoute.post("/get-user-data", getUserData);
userRoute.post("/block-article-user", blockArticleForUser);

userRoute.patch("/update-user-profile-data", updateUserProfileData);
userRoute.patch("/update-user-password-data", updateUserPasswordData);
userRoute.patch("/update-user-preference-data", updateUserPreferenceData);

export default userRoute;
