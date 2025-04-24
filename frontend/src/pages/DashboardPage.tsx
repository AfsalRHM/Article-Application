import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiSearch, FiRefreshCw, FiInfo } from "react-icons/fi";
import NavBar from "../components/shared/NavBar";
import { getPreferenceArticles } from "../api/articleRequest";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import articleType from "../interface/IarticleInterface";
import { format } from "date-fns";
import ArticlePage from "../components/dashboard-components/ArticlePage";

const categoryColors: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Technology: {
    bg: "bg-purple-100",
    border: "border-purple-500",
    text: "text-purple-800",
  },
  Science: {
    bg: "bg-blue-100",
    border: "border-blue-500",
    text: "text-blue-800",
  },
  Health: {
    bg: "bg-green-100",
    border: "border-green-500",
    text: "text-green-800",
  },
  Business: {
    bg: "bg-amber-100",
    border: "border-amber-500",
    text: "text-amber-800",
  },
  Entertainment: {
    bg: "bg-pink-100",
    border: "border-pink-500",
    text: "text-pink-800",
  },
  Sports: { bg: "bg-red-100", border: "border-red-500", text: "text-red-800" },
  Politics: {
    bg: "bg-orange-100",
    border: "border-orange-500",
    text: "text-orange-800",
  },
  Education: {
    bg: "bg-teal-100",
    border: "border-teal-500",
    text: "text-teal-800",
  },
};

const HomePage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<articleType | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState<articleType[] | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<
    articleType[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const {userId, userPreference} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await getPreferenceArticles({ userPreference, userId });
        setArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (articles) {
      setFilteredArticles(
        articles.filter(
          (article) =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            article.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [articles, searchTerm]);

  const openArticle = (article: articleType) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  const getCategoryColors = (category: string) => {
    return (
      categoryColors[category] || {
        bg: "bg-gray-100",
        border: "border-gray-500",
        text: "text-gray-800",
      }
    );
  };

  const formatDate = ({ createdDate }: { createdDate: string }) => {
    const formatedDate = format(new Date(createdDate), "PPP");
    return formatedDate;
  };

  const calculateReadingTime = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }): string => {
    const imageCount = 1;
    const wordsPerMinute = 200;
    const totalWords =
      title.trim().split(/\s+/).length + description.trim().split(/\s+/).length;

    const minutesFromText = totalWords / wordsPerMinute;
    const minutesFromImages = imageCount * 0.2;

    const totalTime = minutesFromText + minutesFromImages;
    const roundedTime = Math.ceil(totalTime);

    return `${roundedTime} min read`;
  };

  const maxVisibleCategories = 3;
  const visibleCategories = userPreference.slice(0, maxVisibleCategories);
  const hiddenCount = userPreference.length - maxVisibleCategories;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <NavBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Articles Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {visibleCategories.map((category: string) => {
                const colorSet = getCategoryColors(category);
                return (
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    key={category}
                  >
                    <button
                      className={`px-4 py-1 ${colorSet.bg} ${colorSet.border} ${colorSet.text} rounded-full text-sm font-medium transition-colors duration-200`}
                    >
                      {category}
                    </button>
                  </motion.div>
                );
              })}

              {hiddenCount > 0 && (
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button className="px-4 py-1 bg-gray-100 border border-gray-300 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200">
                    +{hiddenCount} more
                  </button>
                </motion.div>
              )}
            </div>

            <button className="px-4 py-1 bg-gray-100 border border-gray-500 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-300 hover:cursor-pointer">
              Manage Preferences
            </button>
          </div>

          {isLoading ? (
            // Loading state UI
            <div className="flex flex-col items-center justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mb-4"
              >
                <FiRefreshCw className="w-12 h-12 text-purple-500" />
              </motion.div>
              <p className="text-gray-600 font-medium">Loading articles...</p>
            </div>
          ) : filteredArticles == null || filteredArticles.length === 0 ? (
            // Empty state - No search results
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="bg-amber-100 rounded-full p-4 mb-4">
                <FiSearch className="w-10 h-10 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Articles Found
              </h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                {searchTerm ? (
                  <>
                    No articles match your search for "
                    <span className="font-semibold">{searchTerm}</span>".
                  </>
                ) : (
                  "There are currently no articles available in your selected preferences."
                )}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-medium hover:bg-gray-300 transition-colors duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            // Articles grid
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredArticles.map((article, index) => {
                const colorSet = getCategoryColors(article.category);
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => openArticle(article)}
                    className="border border-purple-100 rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center mr-2">
                            <span className="text-xs font-bold">
                              {article.author.first_name
                                .substring(0, 1)
                                .toUpperCase() +
                                article.author.last_name
                                  .substring(0, 1)
                                  .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {article.author.first_name}
                            </p>
                            <p>
                              {formatDate({
                                createdDate:
                                  article.createdAt!.toLocaleString(),
                              })}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-2 ${colorSet.bg} ${colorSet.text} border ${colorSet.border}`}
                        >
                          {article.category}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between text-gray-500 text-sm">
                          <div className="flex items-center">
                            <FiClock className="mr-1" />
                            {calculateReadingTime({
                              title: article.title,
                              description: article.description,
                            })}
                          </div>
                          <div className="flex items-center">
                            <FiInfo className="cursor-pointer hover:text-purple-600" />
                          </div>
                        </div>
                      </div>
                      <div className="md:w-1/3">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Article view popup */}
      {selectedArticle && (
        <ArticlePage
          closeArticle={closeArticle}
          articleData={selectedArticle}
          getCategoryColors={getCategoryColors}
        />
      )}
    </div>
  );
};

export default HomePage;
