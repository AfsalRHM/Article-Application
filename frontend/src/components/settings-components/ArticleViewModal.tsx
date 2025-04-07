import React from "react";
import { motion } from "framer-motion";
import { FiX, FiTag, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import articleType from "../../interface/IarticleInterface";

interface ArticleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: articleType;
}

const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  if (!isOpen) return null;

  const formattedDate = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  const authorInitials =
    article.author?.first_name?.[0]?.toUpperCase() +
    article.author?.last_name?.[0]?.toUpperCase();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-600 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-purple-100 z-10 hover:cursor-pointer"
          aria-label="Close"
        >
          <FiX className="text-purple-800" />
        </button>

        {/* Cover Image */}
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-64 object-cover rounded-t-2xl"
            onError={(e) => {
              e.currentTarget.src = "/api/placeholder/800/400";
              e.currentTarget.alt = "Image not available";
            }}
          />
        )}

        <div className="p-8">
          {/* Author Info */}
          {article.author && (
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center mr-3 font-bold text-sm">
                {authorInitials || "AU"}
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {article.author.first_name} {article.author.last_name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formattedDate}
                </p>
              </div>
            </div>
          )}

          {/* Category Badge */}
          {article.category && (
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 bg-purple-100 text-purple-800 border border-purple-300">
              <FiTag className="inline-block mr-1" size={12} />
              {article.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          {/* Tags */}
          {article.tags!.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags!.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-50 text-purple-800 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {article.description ? (
              <div dangerouslySetInnerHTML={{ __html: article.description }} />
            ) : (
              <p className="italic text-gray-500 dark:text-gray-400">
                No content available.
              </p>
            )}
          </div>

          {/* Like & Dislike Count */}
          <div className="mt-8 flex gap-6 items-center text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <FiThumbsUp className="text-green-500" />
              <span>{article.likes!.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiThumbsDown className="text-red-500" />
              <span>{article.dis_likes!.length || 0}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArticleViewModal;
