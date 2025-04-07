import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiLock,
  FiList,
} from "react-icons/fi";
import { userRegister } from "../../api/authRequest";
import { showSuccessToast } from "../../utils/iziToastUtils";

type FormDataType = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  password: string;
  confirmPassword: string;
};

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

type RegisterComponentType = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const RegisterComponent = ({ setIsLogin }: RegisterComponentType) => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormDataType>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const password = watch("password");

  const onSubmit = async (data: FormDataType) => {
    try {
      setIsLoading(true);

      const { confirmPassword, ...formData } = data;

      const response = await userRegister({
        ...formData,
        articlePreferences: selectedPreferences,
      });

      if (response.status == true) {
        showSuccessToast("User Registration Successfull");
        setIsLogin(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreference = (category: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {errors.root?.serverError && (
            <p className="mt-1 text-sm text-red-600">
              {errors.root.serverError.message}
            </p>
          )}
          <div>
            <label
              htmlFor="firstName"
              className="flex items-center text-sm font-medium text-purple-700"
            >
              <FiUser className="mr-2 text-purple-500" /> First Name
            </label>
            <div className="mt-1">
              <input
                id="firstName"
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="appearance-none block w-full px-3 py-2 border border-purple-200 rounded-md shadow-sm placeholder-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="flex items-center text-sm font-medium text-purple-700"
            >
              <FiUser className="mr-2 text-purple-500" /> Last Name
            </label>
            <div className="mt-1">
              <input
                id="lastName"
                type="text"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                className="appearance-none block w-full px-3 py-2 border border-purple-200 rounded-md shadow-sm placeholder-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="flex items-center text-sm font-medium text-blue-700"
          >
            <FiMail className="mr-2 text-blue-500" /> Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="appearance-none block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm placeholder-blue-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="flex items-center text-sm font-medium text-green-700"
          >
            <FiPhone className="mr-2 text-green-500" /> Phone number
          </label>
          <div className="mt-1">
            <input
              id="phone"
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
              className="appearance-none block w-full px-3 py-2 border border-green-200 rounded-md shadow-sm placeholder-green-300 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="dob"
            className="flex items-center text-sm font-medium text-amber-700"
          >
            <FiCalendar className="mr-2 text-amber-500" /> Date of Birth
          </label>
          <div className="mt-1">
            <input
              id="dob"
              type="date"
              {...register("dob", {
                required: "Date of birth is required",
                validate: (value) => {
                  const dob = new Date(value);
                  const ageDiffMs = Date.now() - dob.getTime();
                  const ageDate = new Date(ageDiffMs);
                  const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                  return age >= 15 || "You must be at least 15 years old";
                },
              })}
              className="appearance-none block w-full px-3 py-2 border border-amber-200 rounded-md shadow-sm placeholder-amber-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            />
            {errors.dob && (
              <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="flex items-center text-sm font-medium text-red-700"
          >
            <FiLock className="mr-2 text-red-500" /> Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 10,
                  message: "Password must be at most 10 characters",
                },
              })}
              className="appearance-none block w-full px-3 py-2 border border-red-200 rounded-md shadow-sm placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="flex items-center text-sm font-medium text-red-700"
          >
            <FiLock className="mr-2 text-red-500" /> Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="appearance-none block w-full px-3 py-2 border border-red-200 rounded-md shadow-sm placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-pink-700">
            <FiList className="mr-2 text-pink-500" /> Article Preferences
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {articleCategories.map((category) => {
              const colorSet = categoryColors[category];
              return (
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  key={category}
                  onClick={() => togglePreference(category)}
                  className={`p-2 border rounded-md cursor-pointer text-center shadow-sm ${
                    selectedPreferences.includes(category)
                      ? `${colorSet.bg} ${colorSet.border} ${colorSet.text} font-medium`
                      : "bg-white border-gray-200 text-gray-700"
                  }`}
                >
                  {category}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Register"
            )}
          </motion.button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-purple-500">
              Already have an account?
            </span>
          </div>
        </div>

        <div className="mt-6" onClick={() => setIsLogin(true)}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-full flex justify-center py-2 px-4 border border-purple-200 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:cursor-pointer"
          >
            Sign in
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterComponent;
