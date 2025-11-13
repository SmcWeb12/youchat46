// GroupsPage.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Users } from "lucide-react";

const GroupsPage = ({ groups }) => {
  const [search, setSearch] = useState("");
  const location = useLocation();

  const getLinkClass = (path) =>
    location.pathname === path
      ? "bg-blue-600 text-white"
      : "text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200";

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex justify-center items-start py-6">
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-300 dark:border-gray-700">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center bg-gray-200 dark:bg-gray-800">
          <h1 className="text-lg font-semibold text-black dark:text-white">Groups</h1>

          {/* Create Group Button */}
          <Link
            to="/groupchat"
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${getLinkClass(
              "/groupchat"
            )}`}
          >
            <Users className="mr-2 w-4 h-4" />
            Create Group
          </Link>
        </div>

        {/* Search bar */}
        <div className="p-3 border-b border-gray-300 dark:border-gray-700 flex items-center bg-gray-100 dark:bg-gray-900">
          <Search className="text-gray-500 dark:text-gray-400 mr-3 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or start a new group"
            className="w-full bg-transparent outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
          />
        </div>

        {/* Groups list */}
        <div className="overflow-y-auto h-[75vh] scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-900">
          {filteredGroups.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">
              No groups found
            </div>
          ) : (
            filteredGroups.map((group) => (
              <Link
                to={`/groupchat/${group.id}`}
                key={group.id}
                className="flex items-center px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 border-b border-gray-300 dark:border-gray-700"
              >
                {/* Group Image */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={group.image || "https://via.placeholder.com/100"}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  {group.isActive && (
                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full"></span>
                  )}
                </div>

                {/* Group Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="truncate text-[15px] font-medium text-black dark:text-white">
                      {group.name}
                    </h3>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {group.time || "now"}
                    </span>
                  </div>
                  <p className="truncate text-[13px] text-gray-600 dark:text-gray-400 mt-0.5">
                    {group.lastMessage || "No messages yet"}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
