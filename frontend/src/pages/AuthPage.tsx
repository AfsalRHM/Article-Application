import { useState } from "react";
import { motion } from "framer-motion";
import { FiLogIn, FiUser } from "react-icons/fi";
import LoginComponent from "../components/auth-components/LoginComponent";
import RegisterComponent from "../components/auth-components/RegisterComponent";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center mb-4"
          >
            {isLogin ? (
              <FiLogIn className="h-8 w-8 text-white" />
            ) : (
              <FiUser className="h-8 w-8 text-white" />
            )}
          </motion.div>
        </div>
        {isLogin ? (
          <>
            <h2 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access your personalized articles
            </p>
          </>
        ) : (
          <>
            <h2 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join our community and start creating amazing articles
            </p>
          </>
        )}
      </motion.div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white py-8 px-4 shadow-lg shadow-purple-100 sm:rounded-lg sm:px-10 border border-purple-100"
        >
          {isLogin ? <LoginComponent setIsLogin={setIsLogin} /> : <RegisterComponent setIsLogin={setIsLogin} />}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
