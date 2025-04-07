import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLock, FiRefreshCw } from "react-icons/fi";
import { updateUserPassword } from "../../api/userRequest";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const PasswordSettings: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>();

  const userId = useSelector((state: RootState) => state.userId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const onSubmit = async (data: PasswordForm) => {
    setIsSubmitting(true);

    try {
      await updateUserPassword({
        userId,
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      });
      setMessage({ text: "Password changed successfully!", type: "success" });
      reset();
    } catch (error: any) {
      if (error.response.data.message == "Incorrect Current Password") {
        setMessage({
          text: "Incorrect Current Password. Please try again.",
          type: "error",
        });
      } else {
        setMessage({
          text: "Failed to change password. Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  const newPassword = watch("newPassword");

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>

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
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.currentPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            {...register("newPassword", {
              required: "New password is required",
              maxLength: {
                value: 10,
                message: "Password must be no more than 10 characters",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your new password",
              maxLength: {
                value: 10,
                message: "Password must be no more than 10 characters",
              },
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
        >
          {isSubmitting ? (
            <>
              <FiRefreshCw className="animate-spin mr-2" />
              Updating...
            </>
          ) : (
            <>
              <FiLock className="mr-2" />
              Update Password
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PasswordSettings;
