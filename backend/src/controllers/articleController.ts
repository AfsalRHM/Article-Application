import { Request, Response } from "express";
import { articleValidation } from "../validators/articleValidators";

import Article from "../models/articleModel";
import User from "../models/userModel";

import * as yup from "yup";
import { StatusCode } from "../constants/statusCodes";

export const createArticle = async (req: Request, res: Response) => {
  try {
    await articleValidation.validate(req.body, { abortEarly: false });

    const { author, title, description, category, tags, coverImage } = req.body;

    const articleData = await Article.insertOne({
      author,
      title,
      description,
      category,
      tags,
      coverImage,
    });

    if (articleData) {
      res.status(StatusCode.OK).json({
        status: true,
        message: "Article Created Succesfully",
        data: articleData,
      });
    } else {
      res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Unable to Create Article" });
    }
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.map((err) => ({
        path: err.path,
        message: err.message,
      }));
      res.status(StatusCode.BAD_REQUEST).json({ errors });
      return;
    }
    console.log(error.message, "error on the createArticle controller");
    res
      .status(StatusCode.BAD_REQUEST)
      .json({ message: "error while validate" });
  }
};

export const getArticlesByPreference = async (req: Request, res: Response) => {
  try {
    const { userId, userPreference } = req.body;

    if (userPreference.length === 0) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Invalid or missing preferences" });
      return;
    }

    const userData = await User.findById(userId);
    if (!userData) {
      res.status(StatusCode.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    const blockedArticles = userData!.blocked_articles;

    const articles = await Article.find({
      category: { $in: userPreference },
      author: { $ne: userId },
      _id: { $nin: blockedArticles },
    })
      .sort({ createdAt: -1 })
      .populate("author");

    res
      .status(StatusCode.OK)
      .json({ message: "The Request is successfull", data: articles });
  } catch (error: any) {
    console.log(
      error.message,
      "error on the getArticlesByPreference controller"
    );
    res
      .status(StatusCode.BAD_REQUEST)
      .json({ message: "Server Error! try later.." });
  }
};

export const likeArticle = async (req: Request, res: Response) => {
  try {
    const { userId, articleId } = req.body;

    if (!userId || !articleId) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Invalid or missing user id or article id" });
      return;
    }

    const article = await Article.findById(articleId);

    if (!article) {
      res.status(StatusCode.NOT_FOUND).json({ message: "Article not found" });
      return;
    }

    const alreadyLiked = article.likes.includes(userId);

    let updatedArticle;

    if (alreadyLiked) {
      updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { $addToSet: { likes: userId }, $pull: { dis_likes: userId } },
        { new: true }
      );
    }

    res.status(StatusCode.OK).json({
      message: alreadyLiked ? "Article unliked" : "Article liked",
      data: updatedArticle,
    });
  } catch (error: any) {
    console.error("Error in likeArticle controller:", error.message);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Server Error! Try later." });
  }
};

export const disLikeArticle = async (req: Request, res: Response) => {
  try {
    const { userId, articleId } = req.body;

    if (!userId || !articleId) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Invalid or missing user id or article id" });
      return;
    }

    const article = await Article.findById(articleId);

    if (!article) {
      res.status(StatusCode.NOT_FOUND).json({ message: "Article not found" });
      return;
    }

    const alreadyDisLiked = article.dis_likes.includes(userId);

    let updatedArticle;

    if (alreadyDisLiked) {
      updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { $pull: { dis_likes: userId } },
        { new: true }
      );
    } else {
      updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { $addToSet: { dis_likes: userId }, $pull: { likes: userId } },
        { new: true }
      );
    }

    res.status(StatusCode.OK).json({
      message: alreadyDisLiked ? "Article disliked" : "Article unDisliked",
      data: updatedArticle,
    });
  } catch (error: any) {
    console.error("Error in disLikeArticle controller:", error.message);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Server Error! Try later." });
  }
};

export const getUserArticles = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res
        .status(StatusCode.BAD_REQUEST)
        .json({ message: "Invalid or missing user id" });
      return;
    }

    const articleData = await Article.find({ author: userId });

    res.status(StatusCode.OK).json({
      message: "Article Data Fetched Successfully",
      data: articleData,
    });
  } catch (error: any) {
    console.error("Error in getUserArticles controller:", error.message);
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Server Error! Try later." });
  }
};

export const editArticle = async (req: Request, res: Response) => {
  try {
    const { userId, updated } = req.body;
    const { id, title, category, description, tags, image } = updated;

    const article = await Article.findOneAndUpdate(
      { _id: id, author: userId },
      {
        title,
        category,
        description,
        tags,
        coverImage: image,
      },
      { new: true }
    );

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
    console.log(error.message, "Error in editArticle controller");
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong while updating the article",
    });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.body;

    const article = await Article.deleteOne({ _id: articleId });

    if (!article) {
      res.status(StatusCode.NOT_FOUND).json({
        status: false,
        message: "Article not found or you're not authorized",
      });
      return;
    }

    res.status(StatusCode.OK).json({
      status: true,
      message: "Article Deleted successfully",
      data: article,
    });
  } catch (error: any) {
    console.log(error.message, "Error in deleteArticle controller");
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong while updating the article",
    });
  }
};
