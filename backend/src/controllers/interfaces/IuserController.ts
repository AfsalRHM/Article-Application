import { Request, Response } from "express";

export interface IUserController {
  blockArticleForUser(req: Request, res: Response): Promise<void>;
  getUserData(req: Request, res: Response): Promise<void>;
  updateUserProfileData(req: Request, res: Response): Promise<void>;
  updateUserPasswordData(req: Request, res: Response): Promise<void>;
  updateUserPreferenceData(req: Request, res: Response): Promise<void>;
}
