import express from "express";
import { createArticle, deleteArticle, disLikeArticle, editArticle, getArticlesByPreference, getUserArticles, likeArticle } from "../controllers/articleController";

const articleRoute = express.Router();

articleRoute.post("/create-article", createArticle);
articleRoute.post("/get-articles", getArticlesByPreference);
articleRoute.post("/like-article", likeArticle);
articleRoute.post("/dis-like-article", disLikeArticle);
articleRoute.post("/get-user-articles", getUserArticles);
articleRoute.post("/edit-article", editArticle);
articleRoute.delete("/delete-article", deleteArticle);

export default articleRoute;
