import React, { useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import Navbar from "../components/UI/Navbar"; // import updated navbar

const socket = io("http://localhost:5000");

const ChatApp = ({ users, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-r from-gray-50 via-blue-50 to-white"
      }`}
    >
      <Navbar onLogout={onLogout} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="flex flex-grow pt-20">
        {/* LEFT PANEL - User List */}
        <div
          className={`w-full md:w-[340px] flex-shrink-0 shadow-xl border-r ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } flex flex-col`}
        >
          

          {/* Search */}
          <div
            className={`p-3 border-b ${
              darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
            }`}
          >
            <input
              type="text"
              placeholder="🔍 Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>

          {/* User List */}
          <div
            className={`flex-1 overflow-y-auto scrollbar-thin ${
              darkMode
                ? "scrollbar-thumb-gray-700 scrollbar-track-gray-800"
                : "scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            }`}
          >
            {filteredUsers.length === 0 ? (
              <p className="text-center mt-10 text-gray-400">No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <Link
                  key={user.id}
                  to={`/chat/${user.id}`}
                  onClick={() => setCurrentChat(user)}
                  className={`flex items-center gap-3 p-4 cursor-pointer border-b transition-all ${
                    currentChat?.id === user.id
                      ? darkMode
                        ? "bg-gray-700 border-l-4 border-blue-400"
                        : "bg-blue-50 border-l-4 border-blue-500"
                      : darkMode
                      ? "hover:bg-gray-800 border-gray-700"
                      : "hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <img
                    src={user.profileImage || "/path/to/placeholder.jpg"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm opacity-75 truncate">
                      {user.lastMessage || "No recent messages"}
                    </p>
                  </div>
                  <span className="text-xs opacity-60">{user.lastSeen}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Developer Info (hidden on small screens) */}
        <div
          className={`hidden md:flex flex-1 justify-center items-center px-10 overflow-y-auto ${
            darkMode
              ? "bg-gray-900 text-gray-200"
              : "bg-gradient-to-tr from-blue-100 to-white"
          }`}
        >
          <div
            className={`max-w-3xl w-full mx-auto p-10 shadow-2xl rounded-3xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <img
                src="/path/to/developer.jpg"
                alt="Developer"
                className="w-36 h-36 rounded-full border-4 border-blue-400 shadow-lg mb-6 object-cover"
              />
              <h2 className="text-3xl font-bold mb-2">Deepak Dev</h2>
              <p className="text-blue-500 font-medium mb-4">
                Frontend & App Developer | UI/UX Designer | AI Enthusiast
              </p>
              <p className="max-w-2xl leading-relaxed">
                I’m a passionate <strong>Frontend Developer</strong> who loves
                crafting interactive, high-performance applications with
                <strong> React, Tailwind CSS, Flutter, Firebase</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
