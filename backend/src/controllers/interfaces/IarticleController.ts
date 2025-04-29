import { Request, Response } from "express";

export interface IArticleController {
  createArticle(req: Request, res: Response): Promise<void>;
  getArticlesByPreference(req: Request, res: Response): Promise<void>;
  likeArticle(req: Request, res: Response): Promise<void>;
  disLikeArticle(req: Request, res: Response): Promise<void>;
  getUserArticles(req: Request, res: Response): Promise<void>;
  editArticle(req: Request, res: Response): Promise<void>;
  deleteArticle(req: Request, res: Response): Promise<void>;
  disLikeArticle(req: Request, res: Response): Promise<void>;
}
