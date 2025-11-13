import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaUsers,
  FaCog,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const Navbar = ({ onLogout, darkMode, setDarkMode }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".navbar") && !event.target.closest(".settings-menu")) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleSettings = (e) => {
    e.stopPropagation();
    setIsSettingsOpen((prev) => !prev);
  };

  const closeMenus = () => setIsSettingsOpen(false);

  const getLinkClass = (path) =>
    location.pathname === path
      ? "text-yellow-400 font-semibold"
      : "text-white hover:text-yellow-300";

  return (
    <nav
      className={`navbar fixed top-0 left-0 w-full p-4 z-50 shadow-lg flex items-center justify-between transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-r from-blue-700 to-blue-500"
      }`}
    >
      {/* Logo */}
      <Link
        to="/home"
        className="text-white text-2xl font-bold flex items-center gap-2"
        onClick={closeMenus}
      >
        <FaHome /> YouChat
      </Link>

      {/* Settings Button */}
      <div className="relative">
        <button
          onClick={toggleSettings}
          className="text-white text-2xl hover:text-yellow-300 transition"
        >
          <FaCog />
        </button>

        {/* Settings Dropdown */}
        {isSettingsOpen && (
          <div
            className={`settings-menu absolute right-0 top-12 rounded-lg shadow-xl w-56 py-2 animate-slideDown transition-all ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-blue-600 text-white"
            }`}
          >
            <Link
              to="/home"
              className={`block px-4 py-2 ${getLinkClass("/home")}`}
              onClick={closeMenus}
            >
              <FaHome className="inline mr-2" /> Home
            </Link>
            <Link
              to="/profile/edit"
              className={`block px-4 py-2 ${getLinkClass("/profile/edit")}`}
              onClick={closeMenus}
            >
              <FaUserCircle className="inline mr-2" /> Profile
            </Link>
            <Link
              to="/groupchat"
              className={`block px-4 py-2 ${getLinkClass("/groupchat")}`}
              onClick={closeMenus}
            >
              <FaUsers className="inline mr-2" /> CreateGroup
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="w-full text-left px-4 py-2 flex items-center hover:text-yellow-300"
            >
              {darkMode ? (
                <>
                  <FaSun className="inline mr-2 text-yellow-300" /> Light Mode
                </>
              ) : (
                <>
                  <FaMoon className="inline mr-2" /> Dark Mode
                </>
              )}
            </button>

            <button
              onClick={() => {
                onLogout();
                closeMenus();
              }}
              className="w-full text-left px-4 py-2 hover:text-yellow-300"
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
