// MyArticlesSettings.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEye, FiTrash2, FiEdit, FiRefreshCw } from "react-icons/fi";
import { deleteArticle, getUserArticles } from "../../api/articleRequest";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import articleType from "../../interface/IarticleInterface";
import ArticleViewModal from "./ArticleViewModal";
import ArticleEditModal from "./ArticleEditModal";
import { showErrorToast } from "../../utils/iziToastUtils";

const MyArticlesSettings: React.FC = () => {
  const [articles, setArticles] = useState<articleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedArticle, setSelectedArticle] = useState<articleType | null>(
    null
  );
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const userId = useSelector((state: RootState) => state.user.userId);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await getUserArticles({ userId });
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDeleteArticle = async (id: string) => {
    const response = await deleteArticle({articleId: id});
    if (response.status) {
      setArticles(articles.filter((article) => article._id!.toString() !== id));
    } else {
      showErrorToast("Article Deletion Failed...")
    }
  };

  const handleOpenView = (article: articleType) => {
    setSelectedArticle(article);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (article: articleType) => {
    setSelectedArticle(article);
    setIsEditOpen(true);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Articles</h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <FiRefreshCw className="animate-spin text-purple-600 w-8 h-8" />
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No articles found
          </h3>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <FiEdit className="mr-2" />
              Create New Article
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article, index) => (
                <motion.tr
                  key={index}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {article.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 hover:cursor-pointer"
                        onClick={() => handleOpenView(article)}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900 hover:cursor-pointer"
                        onClick={() => handleOpenEdit(article)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteArticle(article._id!.toString())
                        }
                        className="text-red-600 hover:text-red-900  hover:cursor-pointer"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedArticle && (
        <>
          <ArticleViewModal
            isOpen={isViewOpen}
            onClose={() => setIsViewOpen(false)}
            article={selectedArticle}
          />
          <ArticleEditModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            article={selectedArticle}
          />
        </>
      )}
    </div>
  );
};

export default MyArticlesSettings;
