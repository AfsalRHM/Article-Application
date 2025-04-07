import articleType from "../interface/IarticleInterface";
import { apiRequest } from "./apiRequest";

export const createArticle = (articleData: articleType) => {
  return apiRequest("post", "/article/create-article", articleData);
};

type getAllArticlesType = {
  userPreference: string[];
  userId: string;
};

export const getAllArticles = ({
  userPreference,
  userId,
}: getAllArticlesType) => {
  return apiRequest("post", "/article/get-articles", {
    userPreference,
    userId,
  });
};

type likeArticleType = {
  userId: string;
  articleId: string;
};

export const likeArticle = ({ userId, articleId }: likeArticleType) => {
  return apiRequest("post", "/article/like-article", {
    userId,
    articleId,
  });
};

type disLikeArticleType = {
  userId: string;
  articleId: string;
};

export const disLikeArticle = ({ userId, articleId }: disLikeArticleType) => {
  return apiRequest("post", "/article/dis-like-article", {
    userId,
    articleId,
  });
};

type blockArticleForUserType = {
  userId: string;
  articleId: string;
};

export const blockArticleForUser = ({
  userId,
  articleId,
}: blockArticleForUserType) => {
  return apiRequest("post", "/user/block-article-user", {
    userId,
    articleId,
  });
};

type getUserArticlesType = {
  userId: string;
};

export const getUserArticles = ({ userId }: getUserArticlesType) => {
  return apiRequest("post", "/article/get-user-articles", {
    userId,
  });
};

type editArticleType = {
  userId: string;
  updated: any;
};

export const editArticle = ({ userId, updated }: editArticleType) => {
  return apiRequest("post", "/article/edit-article", {
    userId,
    updated,
  });
};

type deleteArticleType = {
  articleId: string;
};

export const deleteArticle = ({ articleId }: deleteArticleType) => {
  return apiRequest("delete", "/article/delete-article", {
    articleId,
  });
};
