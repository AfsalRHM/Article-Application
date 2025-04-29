import ArticleData from "../../interfaces/articleInterface";

export interface ArticleInput {
  author: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
}

export interface ArticleUpdateInput {
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
}

export interface LikeDislikeResponse {
  updatedArticle: ArticleData | null;
  alreadyLiked?: boolean;
  alreadyDisliked?: boolean;
}

export default interface IArticleService {
  createArticle(data: ArticleInput): Promise<ArticleData>;

  getArticlesByPreference(
    userId: string,
    preferences: string[]
  ): Promise<any[]>;

  likeOrUnlikeArticle(
    articleId: string,
    userId: string
  ): Promise<LikeDislikeResponse>;

  dislikeOrUndislikeArticle(
    articleId: string,
    userId: string
  ): Promise<LikeDislikeResponse>;

  getUserArticles(userId: string): Promise<any[]>;

  editArticle(
    articleId: string,
    userId: string,
    updatedData: ArticleUpdateInput
  ): Promise<any>;

  deleteArticle(articleId: string): Promise<any>;
}
