import React, { useState, useContext } from "react";
import Sidebar from "../UI/Sidebar";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { LogOut } from "lucide-react";

const Settings = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { setUser } = useContext(UserContext);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("token");
    // optionally navigate to login
    setShowSignOutModal(false);
    window.location.href = "/login";
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"} min-h-screen flex`}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
          
          {/* Theme Option */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Theme</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 sm:text-xs">Toggle between dark and light mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>

          {/* Sign Out Option */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold sm:text-md">Account</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 sm:text-xs">Sign out from your account</p>
            </div>
            <button
              onClick={() => setShowSignOutModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition "
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Sign Out</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to sign out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
