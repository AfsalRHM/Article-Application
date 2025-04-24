import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets must be defined in environment variables.");
}

export const signAccessToken = (payload: object): string => {
  return jwt.sign(payload, ACCESS_SECRET!, { expiresIn: "1h" });
};

export const signRefreshToken = (payload: object): string => {
  return jwt.sign(payload, REFRESH_SECRET!, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, ACCESS_SECRET!);
};

export const verifyRefreshToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET!);
};
