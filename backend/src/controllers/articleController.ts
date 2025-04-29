import { Request, Response } from "express";

import { StatusCode } from "../constants/statusCodes";

import {
  _createArticle,
  _deleteArticleService,
  _dislikeOrUndislikeArticle,
  _editArticleService,
  _getArticlesByPreference,
  _getUserArticlesService,
  _likeOrUnlikeArticle,
} from "../service/articleService";

import { IArticleController } from "./interfaces/IarticleController";

export const createArticle: IArticleController["createArticle"] = async (
  req: Request,
  res: Response
) => {
  try {
    const { author, title, description, category, tags, coverImage } = req.body;

    const articleData = await _createArticle({
      author,
      title,
      description,
      category,
      tags,
      coverImage,
    });

    res.status(StatusCode.OK).json({
      status: true,
      message: "Article Created Successfully",
      data: articleData,
    });
  } catch (error: any) {
    if (error.type === "validation") {
      res.status(StatusCode.BAD_REQUEST).json({ errors: error.errors });
      return;
    }
    console.error("Error in createArticleController:", error.message);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.message || "Server Error! Try later.",
    });
  }
};

export const getArticlesByPreference: IArticleController["getArticlesByPreference"] = async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | string[] | undefined;
      const userPreference = category ? ([] as string[]).concat(category) : [];
      const userId = req.query.id as string;

      if (userPreference.length === 0) {
        res
          .status(StatusCode.BAD_REQUEST)
          .json({ message: "Invalid or missing preferences" });
        return;
      }

      if (!userId) {
        res
          .status(StatusCode.NOT_FOUND)
          .json({ message: "Unable to fetch User Id" });
        return;
      }

      const articles = await _getArticlesByPreference(userId, userPreference);

      res.status(StatusCode.OK).json({
        message: "The Request is successful",
        data: articles,
      });
    } catch (error: any) {
      console.error(
        "Error in getArticlesByPreferenceController:",
        error.message
      );
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: error.message || "Server Error! Try later.." });
    }
  };

export const likeArticle: IArticleController["likeArticle"] = async (
  req: Request,
  res: Response
) => {
  try {
    const articleId = req.params.articleId;
    const { userId } = req.body;

    if (!userId || !articleId) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Invalid or missing user id or article id" });
      return;
    }

    const { updatedArticle, alreadyLiked } = await _likeOrUnlikeArticle(
      articleId,
      userId
    );

    res.status(StatusCode.OK).json({
      message: alreadyLiked ? "Article unliked" : "Article liked",
      data: updatedArticle,
    });
  } catch (error: any) {
    console.error("Error in likeArticleController:", error.message);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Server Error! Try later." });
  }
};

export const disLikeArticle: IArticleController["disLikeArticle"] = async (
  req: Request,
  res: Response
) => {
  try {
    const articleId = req.params.articleId;
    const { userId } = req.body;

    if (!userId || !articleId) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Invalid or missing user id or article id" });
      return;
    }

    const { updatedArticle, alreadyDisliked } =
      await _dislikeOrUndislikeArticle(articleId, userId);

    res.status(StatusCode.OK).json({
      message: alreadyDisliked ? "Article disliked" : "Article undisliked",
      data: updatedArticle,
    });
  } catch (error: any) {
    console.error("Error in disLikeArticleController:", error.message);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Server Error! Try later." });
  }
};

export const getUserArticles: IArticleController["getUserArticles"] = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Invalid or missing user id" });
      return;
    }

    const articleData = await _getUserArticlesService(userId);

    res.status(StatusCode.OK).json({
      message: "Article Data Fetched Successfully",
      data: articleData,
    });
  } catch (error: any) {
    console.error("Error in getUserArticlesController:", error.message);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Server Error! Try later." });
  }
};

export const editArticle: IArticleController["editArticle"] = async (
  req: Request,
  res: Response
) => {
  try {
    const articleId = req.params.articleId;
    const { userId, updated } = req.body;

    const article = await _editArticleService(articleId, userId, updated);

    if (!article) {
      res.status(StatusCode.NOT_FOUND).json({
        status: false,
        message: "Article not found or you're not authorized",
      });
      return;
    }

    res.status(StatusCode.OK).json({
      status: true,
      message: "Article updated successfully",
      data: article,
    });
  } catch (error: any) {
    console.error("Error in editArticleController:", error.message);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong while updating the article",
    });
  }
};

export const deleteArticle: IArticleController["deleteArticle"] = async (
  req: Request,
  res: Response
) => {
  try {
    const articleId = req.params.articleId;

    const result = await _deleteArticleService(articleId);

    if (result.deletedCount === 0) {
      res.status(StatusCode.NOT_FOUND).json({
        status: false,
        message: "Article not found or you're not authorized",
      });
      return;
    }

    res.status(StatusCode.OK).json({
      status: true,
      message: "Article deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in deleteArticleController:", error.message);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong while deleting the article",
    });
  }
};
