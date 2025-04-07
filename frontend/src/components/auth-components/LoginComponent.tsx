import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FiMail, FiPhone, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../api/authRequest";
import { assignData } from "../../redux/slice/userSlice";
import { useDispatch } from "react-redux";
import { showSuccessToast } from "../../utils/iziToastUtils";

type LoginFormData = {
  identifier: string;
  password: string;
};

type userDataType = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  preferences: string[];
};

type LoginComponentType = {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginComponent = ({ setIsLogin }: LoginComponentType) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setUserData = (userData: userDataType) => {
    dispatch(
      assignData({
        accessToken: "no token",
        userId: userData._id,
        userMail: userData.email,
        userPreference: userData.preferences,
      })
    );
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await userLogin(data);

      setUserData(response.data);
      showSuccessToast("Login Successfull..");
      navigate("/");
    } catch (error) {
      setErrorMessage("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center space-x-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLoginMethod("email")}
          className={`px-4 py-2 rounded-md flex items-center ${
            loginMethod === "email"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <FiMail className="mr-2" /> Email
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLoginMethod("phone")}
          className={`px-4 py-2 rounded-md flex items-center ${
            loginMethod === "phone"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <FiPhone className="mr-2" /> Phone
        </motion.button>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
        >
          {errorMessage}
        </motion.div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="identifier"
            className="flex items-center text-sm font-medium text-blue-700"
          >
            {loginMethod === "email" ? (
              <>
                <FiMail className="mr-2 text-blue-500" /> Email address
              </>
            ) : (
              <>
                <FiPhone className="mr-2 text-green-500" /> Phone number
              </>
            )}
          </label>
          <div className="mt-1">
            <input
              id="identifier"
              type={loginMethod === "email" ? "email" : "number"}
              placeholder={
                loginMethod === "email"
                  ? "you@example.com"
                  : "10-digit phone number"
              }
              {...register("identifier", {
                required: `${
                  loginMethod === "email" ? "Email" : "Phone number"
                } is required`,
                pattern:
                  loginMethod === "email"
                    ? {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      }
                    : {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number",
                      },
              })}
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 ${
                loginMethod === "email"
                  ? "border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                  : "border-green-200 focus:ring-green-500 focus:border-green-500"
              }`}
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-600">
                {errors.identifier.message}
              </p>
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-600"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/forgot-password"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Forgot your password?
            </motion.a>
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
              "Sign in"
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
              Don't have an account?
            </span>
          </div>
        </div>

        <div className="mt-6" onClick={() => setIsLogin(false)}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-full flex justify-center py-2 px-4 border border-purple-200 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:cursor-pointer"
          >
            Create account
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginComponent;
