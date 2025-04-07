import React, { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/shared/NavBar";
import ProfileSettings from "../components/settings-components/ProfileSettings";
import PasswordSettings from "../components/settings-components/PasswordSettings";
import PreferencesSettings from "../components/settings-components/PreferencesSettings";
import MyArticlesSettings from "../components/settings-components/MyArticlesSettings";

const tabs = ["Profile", "Password", "Preferences", "My Articles"];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return <ProfileSettings />;
      case "Password":
        return <PasswordSettings />;
      case "Preferences":
        return <PreferencesSettings />;
      case "My Articles":
        return <MyArticlesSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 md:px-10">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Settings
              </h1>
              <p className="text-indigo-100 mt-2">
                Manage your account and preferences
              </p>
            </div>

            {/* Tabs and Content */}
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <div className="md:w-64 bg-gray-50 p-4 md:p-6">
                <div className="space-y-1">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:cursor-pointer ${
                        activeTab === tab
                          ? "bg-indigo-100 text-indigo-700 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {tab}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-4 md:p-8">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {renderTabContent()}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="text-center mt-6 text-gray-500 text-sm">
            <p>Need help? Contact support@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
