import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiPlusCircle, FiSearch, FiSettings } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { removeData } from "../../redux/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../api/authRequest";
import { RootState } from "../../redux/store";

type navbarType = {
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
  searchTerm?: string;
};

const NavBar = ({ setSearchTerm, searchTerm }: navbarType) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(removeData());
    userLogout();
    navigate("/auth/login");
  };

  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-purple-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center hover:cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Articule
              </motion.div>
            </div>
          </Link>

          {/* Search */}
          {setSearchTerm == undefined ? null : (
            <div className="relative mx-4 flex-grow max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles or authors..."
                className="block w-full pl-10 pr-3 py-2 border border-purple-300 rounded-full bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm!(e.target.value)}
              />
            </div>
          )}

          {/* Icons + Profile */}
          <div className="flex items-center space-x-4">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/new-article">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 rounded-full hover:bg-purple-100 hover:cursor-pointer"
                  aria-label="New blog"
                >
                  <FiPlusCircle className="text-purple-600 text-xl" />
                </motion.button>
              </Link>
              <Link to="/settings">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-2 rounded-full hover:bg-purple-100 hover:cursor-pointer"
                  aria-label="Settings"
                >
                  <FiSettings className="text-purple-600 text-xl" />
                </motion.button>
              </Link>
            </div>

            {/* Profile Icon */}
            <div className="relative">
              <div
                className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="font-medium text-sm">
                  {userData.userName.split(" ").map((name) => name[0])}
                </span>
              </div>

              {/* Dropdown - available on all screens */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-col gap-2 z-50"
                  >
                    {/* Extra options only on small screens */}
                    <div className="md:hidden flex flex-col gap-2">
                      <Link to="/new-article">
                        <button className="flex items-center gap-2 px-2 py-1 hover:bg-purple-200 rounded">
                          <FiPlusCircle className="text-purple-600" /> New
                          Article
                        </button>
                      </Link>
                      <Link to="/settings">
                        <button className="flex items-center gap-2 px-2 py-1 hover:bg-purple-200 rounded">
                          <FiSettings className="text-purple-600" /> Settings
                        </button>
                      </Link>
                    </div>

                    {/* Log Out - shown always */}
                    <button
                      className="flex items-center gap-2 px-2 py-1 hover:bg-red-200 rounded"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="text-red-600" /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
