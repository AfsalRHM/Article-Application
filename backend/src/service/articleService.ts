import * as yup from "yup";

import { articleValidation } from "../validators/articleValidators";
import {
  deleteArticleById,
  findArticleById,
  findArticlesByAuthor,
  findArticlesByPreference,
  insertArticle,
  updateArticleByAuthor,
  updateArticleDislikes,
  updateArticleLikes,
} from "../repositories/articleRepository";
import { findUserById } from "../repositories/userRepository";

import IArticleService from "./interfaces/IarticleService";

export const _createArticle: IArticleService["createArticle"] = async (data: {
  author: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
}) => {
  try {
    await articleValidation.validate(data, { abortEarly: false });

    const articleData = await insertArticle(data);

    if (!articleData) {
      throw new Error("Unable to create article");
    }

    return articleData;
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const validationErrors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      throw { type: "validation", errors: validationErrors };
    }
    console.error("Error in createArticle service:", error.message);
    throw new Error(error.message || "Error while creating article");
  }
};

export const _getArticlesByPreference: IArticleService["getArticlesByPreference"] = async (userId: string, userPreference: string[]) => {
    try {
      const userData = await findUserById(userId);
      if (!userData) {
        throw new Error("User not found");
      }

      const blockedArticles = userData.blocked_articles;

      const articles = await findArticlesByPreference(
        userId,
        userPreference,
        blockedArticles
      );

      return articles;
    } catch (error: any) {
      console.error("Error in getArticlesByPreference service:", error.message);
      throw new Error(
        error.message || "Failed to fetch articles by preference"
      );
    }
  };

export const _likeOrUnlikeArticle: IArticleService["likeOrUnlikeArticle"] = async (articleId: string, userId: string) => {
    try {
      const article = await findArticleById(articleId);

      if (!article) {
        throw new Error("Article not found");
      }

      const alreadyLiked = article.likes.includes(userId);

      const updatedArticle = await updateArticleLikes(
        articleId,
        userId,
        alreadyLiked
      );

      return { updatedArticle, alreadyLiked };
    } catch (error: any) {
      console.error("Error in likeOrUnlikeArticle service:", error.message);
      throw new Error(error.message || "Failed to like/unlike article");
    }
  };

export const _dislikeOrUndislikeArticle: IArticleService["dislikeOrUndislikeArticle"] = async (articleId: string, userId: string) => {
    try {
      const article = await findArticleById(articleId);

      if (!article) {
        throw new Error("Article not found");
      }

      const alreadyDisliked = article.dis_likes.includes(userId);

      const updatedArticle = await updateArticleDislikes(
        articleId,
        userId,
        alreadyDisliked
      );

      return { updatedArticle, alreadyDisliked };
    } catch (error: any) {
      console.error(
        "Error in dislikeOrUndislikeArticle service:",
        error.message
      );
      throw new Error(error.message || "Failed to dislike/undislike article");
    }
  };

export const _getUserArticlesService: IArticleService["getUserArticles"] = async (userId: string) => {
    try {
      const articles = await findArticlesByAuthor(userId);
      return articles;
    } catch (error: any) {
      console.error("Error in getUserArticlesService:", error.message);
      throw new Error(error.message || "Failed to fetch user articles");
    }
  };

export const _editArticleService: IArticleService["editArticle"] = async (
  articleId: string,
  userId: string,
  updatedData: {
    title: string;
    category: string;
    description: string;
    tags: string[];
    image: string;
  }
) => {
  try {
    const { title, category, description, tags, image } = updatedData;

    const article = await updateArticleByAuthor(articleId, userId, {
      title,
      category,
      description,
      tags,
      coverImage: image,
    });

    return article;
  } catch (error: any) {
    console.error("Error in editArticleService:", error.message);
    throw new Error(error.message || "Failed to update article");
  }
};

export const _deleteArticleService: IArticleService["deleteArticle"] = async (
  articleId: string
) => {
  try {
    const result = await deleteArticleById(articleId);
    return result;
  } catch (error: any) {
    console.error("Error in deleteArticleService:", error.message);
    throw new Error(error.message || "Failed to delete article");
  }
};
