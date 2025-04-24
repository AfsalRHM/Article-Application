import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiImage, FiSave, FiX, FiTag, FiCalendar } from "react-icons/fi";
import NavBar from "../components/shared/NavBar";
import { uploadToCloudinary } from "../config/cloudinaryConfig";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { createArticle } from "../api/articleRequest";
import { useForm } from "react-hook-form";
import mongoose from "mongoose";
import articleType from "../interface/IarticleInterface";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "../utils/iziToastUtils";

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

const NewArticlePage = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<articleType>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      coverImage: "",
      tags: [],
    },
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    register("coverImage", {
      required: "Cover image is required",
    });
    register("tags", {
      validate: (val) =>
        val && val.length > 0 ? true : "At least one tag is required",
    });
  }, [register]);

  useEffect(() => {
    setValue("coverImage", coverImage || "");
  }, [coverImage, setValue]);

  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const handleTagAdd = () => {
    const trimmed = currentTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setCurrentTag("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const response = await uploadToCloudinary({
        currentImage: fileArray[0],
        uploadPreset: "article_preset",
      });
      setCoverImage(response);
    }
  };

  const onSubmit = async (data: articleType) => {
    if (!data.category) {
      alert("Please select a category before publishing.");
      return;
    }

    try {
      const articleData = {
        ...data,
        author: new mongoose.Types.ObjectId(userId),
      };

      const response = await createArticle(articleData);

      if (response.status) {
        showSuccessToast(response.message);
        navigate("/");
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
  };

  return (
    <div className="min-h-screen bg-purple-50">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
            Create New Article
          </h1>

          {errors.root?.serverError && (
            <p className="mt-1 text-sm text-red-600">
              {errors.root.serverError.message}
            </p>
          )}

          {/* Cover Image */}
          <div className="mb-8">
            <div
              className="relative h-64 bg-white border-2 border-dashed border-purple-300 rounded-lg overflow-hidden flex flex-col items-center justify-center cursor-pointer"
              onClick={() =>
                document.getElementById("cover-image-upload")?.click()
              }
            >
              {coverImage ? (
                <>
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverImage(null);
                    }}
                  >
                    <FiX className="text-purple-600" />
                  </button>
                </>
              ) : (
                <>
                  <FiImage className="text-purple-400 text-4xl mb-2" />
                  <p className="text-purple-500">Click to upload cover image</p>
                </>
              )}
              <input
                type="file"
                id="cover-image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            {errors.coverImage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.coverImage.message}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter your article title..."
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
              })}
              className={`w-full px-4 py-3 text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-500 ring-red-500"
                  : "border-purple-300 focus:ring-purple-500"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category Selector */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FiTag className="text-purple-500" />
              <span className="text-purple-700 font-semibold text-lg">
                Select Category
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {articleCategories.map((cat) => {
                const isSelected = cat === selectedCategory;
                const colorSet = categoryColors[cat];

                return (
                  <motion.button
                    key={cat}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setValue("category", cat)}
                    className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors duration-200 ${
                      isSelected
                        ? `${colorSet.bg} ${colorSet.border} ${colorSet.text}`
                        : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </motion.button>
                );
              })}
            </div>
            {!selectedCategory && (
              <p className="text-red-500 text-sm mt-2">
                Please select a category
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FiTag className="text-purple-500" />
              <span className="text-purple-700 font-semibold text-lg">
                Tags
              </span>
            </div>
            <div className="p-3 bg-white border border-purple-300 rounded-lg">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-purple-100 px-3 py-1 rounded-full flex items-center"
                  >
                    <span className="text-purple-700 text-sm">{tag}</span>
                    <button
                      className="ml-2 text-purple-500 hover:text-purple-700"
                      onClick={() => handleTagRemove(tag)}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add tags..."
                  className="flex-grow p-2 text-sm border border-purple-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleTagAdd();
                    }
                  }}
                />
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 rounded-r-md"
                  onClick={handleTagAdd}
                >
                  Add
                </button>
              </div>
            </div>
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <textarea
              placeholder="Write your article content here..."
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 30,
                  message: "Description must be at least 30 characters",
                },
              })}
              className={`w-full h-96 p-4 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                errors.description
                  ? "border-red-500 ring-red-500"
                  : "border-purple-300 focus:ring-purple-500"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="bg-white p-4 border border-purple-300 rounded-lg mb-6 flex items-center">
            <FiCalendar className="text-purple-500 mr-2" />
            <span className="text-purple-700">
              This article will be published today
            </span>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center"
              onClick={handleSubmit(onSubmit)}
            >
              <FiSave className="mr-2" />
              Publish Article
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NewArticlePage;
