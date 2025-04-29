import Article from "../models/articleModel";

export const findArticleById = async (articleId: string) => {
  return await Article.findById(articleId);
};

export const insertArticle = async (data: {
  author: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
}) => {
  return await Article.insertOne(data);
};

export const findArticlesByPreference = async (
  userId: string,
  userPreference: string[],
  blockedArticles: string[]
) => {
  return await Article.find({
    category: { $in: userPreference },
    author: { $ne: userId },
    _id: { $nin: blockedArticles },
  })
    .sort({ createdAt: -1 })
    .populate("author");
};

export const updateArticleLikes = async (
  articleId: string,
  userId: string,
  alreadyLiked: boolean
) => {
  if (alreadyLiked) {
    return await Article.findByIdAndUpdate(
      articleId,
      { $pull: { likes: userId } },
      { new: true }
    );
  } else {
    return await Article.findByIdAndUpdate(
      articleId,
      { $addToSet: { likes: userId }, $pull: { dis_likes: userId } },
      { new: true }
    );
  }
};

export const updateArticleDislikes = async (
  articleId: string,
  userId: string,
  alreadyDisliked: boolean
) => {
  if (alreadyDisliked) {
    return await Article.findByIdAndUpdate(
      articleId,
      { $pull: { dis_likes: userId } },
      { new: true }
    );
  } else {
    return await Article.findByIdAndUpdate(
      articleId,
      { $addToSet: { dis_likes: userId }, $pull: { likes: userId } },
      { new: true }
    );
  }
};

export const findArticlesByAuthor = async (userId: string) => {
  return await Article.find({ author: userId });
};

export const updateArticleByAuthor = async (
  articleId: string,
  userId: string,
  updatedData: {
    title: string;
    category: string;
    description: string;
    tags: string[];
    coverImage: string;
  }
) => {
  return await Article.findOneAndUpdate(
    { _id: articleId, author: userId },
    updatedData,
    { new: true }
  );
};

export const deleteArticleById = async (articleId: string) => {
  return await Article.deleteOne({ _id: articleId });
};
