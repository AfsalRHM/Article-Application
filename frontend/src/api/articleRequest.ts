import articleType from "../interface/IarticleInterface";
import { apiRequest } from "./apiRequest";

export const createArticle = (articleData: articleType) => {
  return apiRequest("post", "/articles", articleData);
};

type getAllArticlesType = {
  userPreference: string[];
  userId: string;
};

export const getPreferenceArticles = ({
  userPreference,
  userId,
}: getAllArticlesType) => {
  const queryString = userPreference
    .map((cat: string) => `category=${encodeURIComponent(cat)}`)
    .join("&");
  const url = `/articles?${queryString}&id=${userId}`;

  return apiRequest("get", url);
};

type likeArticleType = {
  userId: string;
  articleId: string;
};

export const likeArticle = ({ userId, articleId }: likeArticleType) => {
  return apiRequest("patch", `/articles/${articleId}/like`, {
    userId,
  });
};

type disLikeArticleType = {
  userId: string;
  articleId: string;
};

export const disLikeArticle = ({ userId, articleId }: disLikeArticleType) => {
  return apiRequest("patch", `/articles/${articleId}/dislike`, {
    userId,
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
  return apiRequest("post", `/users/${userId}/block-article`, {
    articleId,
  });
};

type getUserArticlesType = {
  userId: string;
};

export const getUserArticles = ({ userId }: getUserArticlesType) => {
  return apiRequest("get", `/articles/user/${userId}`);
};

type editArticleType = {
  userId: string;
  updated: any;
};

export const editArticle = ({ userId, updated }: editArticleType) => {
  return apiRequest("put", `/articles/${updated.id}`, {
    userId,
    updated,
  });
};

type deleteArticleType = {
  articleId: string;
};

export const deleteArticle = ({ articleId }: deleteArticleType) => {
  return apiRequest("delete", `/articles/${articleId}`);
};
