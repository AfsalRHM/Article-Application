import express from "express";
import { userLogin, userRegister } from "../controllers/authControllers";

const authRoute = express.Router();

authRoute.post("/register", userRegister);
authRoute.post("/login", userLogin);

export default authRoute;
