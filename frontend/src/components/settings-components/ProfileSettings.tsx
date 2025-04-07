import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiSave, FiRefreshCw } from "react-icons/fi";
import { getUserData, updateUserProfile } from "../../api/userRequest";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { assignData } from "../../redux/slice/userSlice";

type UserProfile = {
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  phone_number: string;
};

const ProfileSettings: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const userId = useSelector((state: RootState) => state.userId);

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProfile>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData({ userId });
        const fetchedUser = response.data;

        // Set form fields
        Object.entries(fetchedUser).forEach(([key, value]) =>
          setValue(key as keyof UserProfile, value as any)
        );

        dispatch(
          assignData({
            accessToken: "no token",
            userId: fetchedUser._id,
            userMail: fetchedUser.email,
            userPreference: fetchedUser.preferences,
          })
        );
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [setValue]);

  const onSubmit = async (data: UserProfile) => {
    setIsSubmitting(true);

    try {
      await updateUserProfile({ userId, data });
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (error) {
      setMessage({
        text: "Failed to update profile. Please try again.",
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
        Personal Information
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              {...register("first_name", {
                required: "First name is required",
              })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.first_name && (
              <p className="text-sm text-red-600 mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              {...register("last_name", {
                required: "Last name is required",
              })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                errors.last_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.last_name && (
              <p className="text-sm text-red-600 mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                errors.dob ? "border-red-500" : "border-gray-300"
              }`}
              {...register("dob", {
                required: "Date of birth is required",
                validate: (value) => {
                  const dob = new Date(value);
                  const today = new Date();
                  const age = today.getFullYear() - dob.getFullYear();
                  const hasBirthdayPassedThisYear =
                    today.getMonth() > dob.getMonth() ||
                    (today.getMonth() === dob.getMonth() &&
                      today.getDate() >= dob.getDate());

                  const actualAge = hasBirthdayPassedThisYear ? age : age - 1;

                  return actualAge >= 15 || "You must be at least 15 years old";
                },
              })}
            />

            {errors.dob && (
              <p className="text-sm text-red-600 mt-1">{errors.dob.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone_number", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                errors.phone_number ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone_number && (
              <p className="text-sm text-red-600 mt-1">
                {errors.phone_number.message}
              </p>
            )}
          </div>
        </div>

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
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
