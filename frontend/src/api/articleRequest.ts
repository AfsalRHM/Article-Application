import articleType from "../interface/IarticleInterface";
import { apiPrivate } from "./private/apiPrivate";


export const createArticle = (articleData: articleType) => {
  return apiPrivate("post", "/articles", articleData);
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

  return apiPrivate("get", url);
};

type likeArticleType = {
  userId: string;
  articleId: string;
};

export const likeArticle = ({ userId, articleId }: likeArticleType) => {
  return apiPrivate("patch", `/articles/${articleId}/like`, {
    userId,
  });
};

type disLikeArticleType = {
  userId: string;
  articleId: string;
};

export const disLikeArticle = ({ userId, articleId }: disLikeArticleType) => {
  return apiPrivate("patch", `/articles/${articleId}/dislike`, {
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
  return apiPrivate("post", `/users/${userId}/block-article`, {
    articleId,
  });
};

type getUserArticlesType = {
  userId: string;
};

export const getUserArticles = ({ userId }: getUserArticlesType) => {
  return apiPrivate("get", `/articles/user/${userId}`);
};

type editArticleType = {
  userId: string;
  updated: any;
};

export const editArticle = ({ userId, updated }: editArticleType) => {
  return apiPrivate("put", `/articles/${updated.id}`, {
    userId,
    updated,
  });
};

type deleteArticleType = {
  articleId: string;
};

export const deleteArticle = ({ articleId }: deleteArticleType) => {
  return apiPrivate("delete", `/articles/${articleId}`);
};
