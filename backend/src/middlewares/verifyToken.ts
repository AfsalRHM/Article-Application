import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodes";
import { verifyAccessToken } from "../utils/jwt";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(StatusCode.NOT_FOUND).json({ message: "Token Unavailable" });
      return;
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new Error("Token Expired");
    }

    next();
  } catch (error: any) {
    res.status(StatusCode.UNAUTHORIZED).json({ message: "Invalid Token" });
  }
};
