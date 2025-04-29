import { Request, Response } from "express";

export interface IAuthController {
  userRegister(req: Request, res: Response): Promise<void>;
  userLogin(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
  userLogout(req: Request, res: Response): Promise<void>;
}
