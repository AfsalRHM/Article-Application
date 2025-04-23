import express from "express";
import { createArticle, deleteArticle, disLikeArticle, editArticle, getArticlesByPreference, getUserArticles, likeArticle } from "../controllers/articleController";

const articleRoute = express.Router();

articleRoute.get("/", getArticlesByPreference);
articleRoute.get("/user/:userId", getUserArticles);

articleRoute.post("/", createArticle);

articleRoute.put("/:articleId", editArticle);

articleRoute.patch("/:articleId/like", likeArticle);
articleRoute.patch("/:articleId/dislike", disLikeArticle);

articleRoute.delete("/:articleId", deleteArticle);

export default articleRoute;
