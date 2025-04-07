import { motion } from "framer-motion";
import { FiThumbsDown, FiThumbsUp, FiX } from "react-icons/fi";
import articleType from "../../interface/IarticleInterface";
import { format } from "date-fns";
import {
  blockArticleForUser,
  disLikeArticle,
  likeArticle,
} from "../../api/articleRequest";
import { showErrorToast } from "../../utils/iziToastUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

type GetCategoryColorsType = (category: string) => {
  bg: string;
  border: string;
  text: string;
};

interface articlePageType {
  closeArticle: () => void;
  articleData: articleType;
  getCategoryColors: GetCategoryColorsType;
}

const ArticlePage = ({
  closeArticle,
  articleData,
  getCategoryColors,
}: articlePageType) => {
  const userId = useSelector((state: RootState) => state.userId);

  const [likeCount, setLikeCount] = useState<number>(articleData.likes!.length);
  const [likeStatus, setLikeStatus] = useState<boolean>(false);
  const [disLikeStatus, setDisLikeStatus] = useState<boolean>(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    setLikeStatus(articleData.likes!.includes(userId));
    setDisLikeStatus(articleData.dis_likes!.includes(userId));
  }, []);

  const handleLike = async (articleId: string) => {
    setDisLikeStatus(false);
    if (likeStatus) {
      setLikeStatus(false);
      setLikeCount(likeCount - 1);
    } else {
      setLikeStatus(true);
      setLikeCount(likeCount + 1);
    }
    try {
      await likeArticle({ userId, articleId });
    } catch (error) {
      setDisLikeStatus(true);
      setLikeCount(likeCount - 1);
      console.log("Error on the handleLike function", error);
      showErrorToast("Unable to perform the action. try later...");
    }
  };

  const handleDisLike = async (articleId: string) => {
    if (likeStatus) {
      setLikeCount(likeCount - 1);
    }
    setLikeStatus(false);
    if (disLikeStatus) {
      setDisLikeStatus(false);
    } else {
      setDisLikeStatus(true);
    }
    try {
      await disLikeArticle({ userId, articleId });
    } catch (error) {
      setLikeStatus(true);
      console.log("Error on the handleDisLike function", error);
      showErrorToast("Unable to perform the action. try later...");
    }
  };

  const onBlockClick = () => {
    setShowConfirmModal(true);
  };

  const handleBlock = async () => {
    try {
      const articleId = articleData._id!.toString();
      const response = await blockArticleForUser({ userId, articleId });

      if (response) {
        setShowBlockModal(true);
      }
    } catch (error) {
      setLikeStatus(true);
      console.log("Error on the handleBlock function", error);
      showErrorToast("Unable to perform the action. try later...");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="relative">
            <button
              onClick={closeArticle}
              className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md z-10 hover:bg-purple-100"
              aria-label="Close"
            >
              <FiX className="text-purple-800 hover:cursor-pointer" />
            </button>

            <img
              src={articleData.coverImage}
              alt={articleData.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">
                    {articleData.author.first_name
                      .substring(0, 1)
                      .toUpperCase() +
                      articleData.author.last_name
                        .substring(0, 1)
                        .toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {articleData.author.first_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate({
                      createdDate: articleData.createdAt!.toLocaleString(),
                    })}{" "}
                    ·{" "}
                    {calculateReadingTime({
                      title: articleData.title,
                      description: articleData.description,
                    })}
                  </p>
                </div>
              </div>

              {articleData.category && (
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 ${
                    getCategoryColors(articleData.category).bg
                  } ${getCategoryColors(articleData.category).text} border ${
                    getCategoryColors(articleData.category).border
                  }`}
                >
                  {articleData.category}
                </span>
              )}

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {articleData.title}
              </h1>
              <p className="text-gray-700 mb-8 leading-relaxed whitespace-pre-line">
                {articleData.description}
              </p>

              <div className="flex items-center justify-between border-t border-purple-100 pt-6">
                <div className="flex space-x-6">
                  <button
                    className="flex items-center text-gray-600 hover:text-purple-600 hover:cursor-pointer"
                    onClick={() => handleLike(articleData._id!.toString())}
                  >
                    {likeStatus ? (
                      <FaThumbsUp className="mr-2" />
                    ) : (
                      <FiThumbsUp className="mr-2" />
                    )}
                    <span>{likeCount}</span>
                  </button>
                  <button
                    className="flex items-center text-gray-600 hover:text-red-600 hover:cursor-pointer"
                    onClick={() => handleDisLike(articleData._id!.toString())}
                  >
                    {disLikeStatus ? (
                      <FaThumbsDown className="mr-2" />
                    ) : (
                      <FiThumbsDown className="mr-2" />
                    )}
                  </button>
                </div>
                <button
                  className="flex items-center text-gray-600 hover:text-purple-600 hover:cursor-pointer"
                  onClick={() => onBlockClick()}
                >
                  <FcCancel size={23} className="mr-2" />
                  <span>block</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md text-center shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Confirm Block</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to block this article? You won’t see it
              again unless you unblock it from settings.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleBlock();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded hover:cursor-pointer"
              >
                Block
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="border border-gray-300 px-4 py-2 rounded hover:cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md text-center shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Article Blocked</h2>
            <p className="text-gray-700 mb-6">
              The article has been blocked. If you want to revert this change,
              you can manage it from settings.
            </p>
            <button
              onClick={() => {
                setShowBlockModal(false);
                closeArticle();
                navigate("/");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticlePage;
