import express from "express";
import { createArticle, deleteArticle, disLikeArticle, editArticle, getArticlesByPreference, getUserArticles, likeArticle } from "../controllers/articleController";
import { verifyToken } from "../middlewares/verifyToken";

const articleRoute = express.Router();

articleRoute.get("/", verifyToken, getArticlesByPreference);
articleRoute.get("/user/:userId", verifyToken, getUserArticles);

articleRoute.post("/", verifyToken, createArticle);

articleRoute.put("/:articleId", verifyToken, editArticle);

articleRoute.patch("/:articleId/like", verifyToken, likeArticle);
articleRoute.patch("/:articleId/dislike", verifyToken, disLikeArticle);

articleRoute.delete("/:articleId", verifyToken, deleteArticle);

export default articleRoute;
