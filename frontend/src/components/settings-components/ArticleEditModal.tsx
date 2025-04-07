import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiTag, FiSave, FiImage, FiPlus, FiTrash } from "react-icons/fi";
import articleType from "../../interface/IarticleInterface";
import { uploadToCloudinary } from "../../config/cloudinaryConfig";
import { showSuccessToast } from "../../utils/iziToastUtils";
import { useForm } from "react-hook-form";
import { editArticle } from "../../api/articleRequest";
import { useNavigate } from "react-router-dom";

const articleCategories = [
  "Technology",
  "Science",
  "Health",
  "Business",
  "Entertainment",
  "Sports",
  "Politics",
  "Education",
];

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

interface ArticleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: articleType;
}

const ArticleEditModal: React.FC<ArticleEditModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      title: article.title,
      description: article.description || "",
    },
  });

  const [category, setCategory] = useState(article.category);
  const [tags, setTags] = useState(article.tags || []);
  const [newTag, setNewTag] = useState("");
  const [imageUrl, setImageUrl] = useState(article.coverImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const response = await uploadToCloudinary({
        currentImage: fileArray[0],
        uploadPreset: "article_preset",
      });
      setImageUrl(response);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const onValid = async (data: any) => {
    if (tags.length === 0) {
      alert("Please add at least one tag.");
      return;
    }

    const updated = {
      id: article._id!.toString(),
      title: data.title,
      category,
      description: data.description,
      tags,
      image: imageUrl,
    };

    try {
      const response = await editArticle({ userId: article.author, updated });

      if (response.status) {
        showSuccessToast(response.message);
        navigate("/settings");
      } else {
        setError("root.serverError" as any, {
          type: "manual",
          message: response.data.message,
        });
      }
    } catch (err: any) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((error: any) => {
          setError(error.path, {
            type: "manual",
            message: error.message,
          });
        });
      }
      console.error("Submission error:", err);
      alert("Something went wrong.");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
          Edit Article
        </h2>

        <form onSubmit={handleSubmit(onValid)} className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
              })}
              className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-purple-300 focus:ring-purple-500"
              }`}
              placeholder="Edit title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
              })}
              placeholder="Edit description..."
              rows={4}
              className={`w-full px-4 py-3 text-base border rounded-lg resize-none focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-purple-300 focus:ring-purple-500"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiTag className="text-purple-500" />
              <span className="text-purple-700 font-medium">Edit Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {articleCategories.map((cat) => {
                const isSelected = category === cat;
                const styles = categoryColors[cat];
                return (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(cat)}
                    type="button"
                    className={`px-4 py-1 rounded-full border text-sm font-medium transition-all ${
                      isSelected
                        ? `${styles.bg} ${styles.border} ${styles.text}`
                        : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cover Image
            </label>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Cover"
                className="rounded-lg w-full max-h-60 object-cover border"
              />
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-200"
            >
              <FiImage />
              Change Cover Image
            </button>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          {/* Tag Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-sm rounded-full"
                >
                  <span>{tag}</span>
                  <FiTrash
                    size={14}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-grow px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Add new tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center"
            >
              <FiSave className="mr-2" />
              Save Changes
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ArticleEditModal;
