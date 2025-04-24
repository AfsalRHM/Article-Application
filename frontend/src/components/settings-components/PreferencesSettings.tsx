// PreferencesSettings.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiSave, FiRefreshCw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { updateUserPreference } from "../../api/userRequest";
import { assignData } from "../../redux/slice/userSlice";
// import { updateUserPreferences } from "../../redux/actions/userPreferenceActions";

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

const PreferencesSettings: React.FC = () => {
  const dispatch = useDispatch();

  const { userId, userPreference } = useSelector(
    (state: RootState) => state.user
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    // Set selected categories from redux store
    setSelectedCategories([...userPreference]);
  }, [userPreference]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      setMessage({
        text: "Please select at least one category.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateUserPreference({
        userId,
        selectedCategories,
      });
      dispatch(
        assignData({
          userId: response.data._id,
          userMail: response.data.email,
          userName: [response.data.first_name, response.data.last_name].join(
            " "
          ),
          userPreference: response.data.preferences,
        })
      );
      setMessage({
        text: "Preferences updated successfully!",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: "Failed to update preferences. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Article Preferences
      </h2>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-500"
              : "bg-red-100 text-red-800 border border-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <p className="text-gray-600 mb-4">
        Select categories that interest you the most. We'll use these to
        personalize your reading experience.
      </p>

      <form onSubmit={handlePreferencesSubmit}>
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {articleCategories.map((category) => {
              const colorSet = categoryColors[category];
              const isSelected = selectedCategories.includes(category);

              return (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  key={category}
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`w-full px-4 py-3 rounded-md border transition-colors duration-200 ${
                      isSelected
                        ? `${colorSet.bg} ${colorSet.border} ${colorSet.text}`
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <FiEdit size={16} />
                        </motion.div>
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{selectedCategories.length}</span>{" "}
            categories selected
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
          >
            {isSubmitting ? (
              <>
                <FiRefreshCw className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreferencesSettings;
