import express from "express";
import { refreshToken, userLogin, userLogout, userRegister } from "../controllers/authControllers";

const authRoute = express.Router();

authRoute.post("/register", userRegister);
authRoute.post("/login", userLogin);
authRoute.post("/refresh-token", refreshToken);
authRoute.post("/logout", userLogout);

export default authRoute;
