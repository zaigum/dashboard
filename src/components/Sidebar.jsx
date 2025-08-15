import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartLine,
  FaUser,
  FaCog,
  FaTimes,
  FaBlog,
  FaEye,
  FaChevronDown,
} from "react-icons/fa";
import logo from "../assets/logo.png";

const Sidebar = ({
  isOpen,
  toggleSidebar,
  setSelectedMenuItem,
  selectedMenuItem,
}) => {
  const [isAnalyticsDropdownOpen, setAnalyticsDropdownOpen] = useState(false);

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    localStorage.setItem("selectedMenuItem", menuItem);
  };

  const handleAnalyticsDropdown = () => {
    setAnalyticsDropdownOpen(!isAnalyticsDropdownOpen);
  };

  useEffect(() => {
    const storedMenuItem = localStorage.getItem("selectedMenuItem");
    if (storedMenuItem) {
      setSelectedMenuItem(storedMenuItem);
    }
  }, [setSelectedMenuItem]);

  return (
    <div
      className={`bg-gray-800 text-white h-full w-64 fixed top-0 left-0 z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } shadow-lg`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-9 h-9 mr-3 rounded-full" />
          <span className="text-xl font-bold">DashLite</span>
        </div>
        <button
          className="text-gray-400 hover:text-white lg:hidden"
          onClick={toggleSidebar}
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>

      {/* Analytics Dropdown Section */}
      <div className="p-4">
        <div
          className="flex items-center justify-between p-3 bg-gray-700 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-600"
          onClick={handleAnalyticsDropdown}
        >
          <div>
            <h1 className="font-semibold text-white">Analytics</h1>
            <p className="text-sm text-gray-400">Production</p>
          </div>
          <FaChevronDown
            className={`text-gray-400 transform transition-transform duration-300 ${
              isAnalyticsDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isAnalyticsDropdownOpen && (
          <div className="mt-2 bg-gray-700 rounded-md shadow-inner">
            <ul className="py-2">
              <li className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 cursor-pointer transition-colors duration-200">
                Development
              </li>
              <li className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 cursor-pointer transition-colors duration-200">
                Staging
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 px-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/overview"
              onClick={() => handleMenuItemClick("Overview")}
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                selectedMenuItem === "Overview"
                  ? "bg-gray-700 text-white font-semibold"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaChartLine className="mr-3 w-4 h-4" />
              <span>Overview</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog-write"
              onClick={() => handleMenuItemClick("Blog")}
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                selectedMenuItem === "Blog"
                  ? "bg-gray-700 text-white font-semibold"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaBlog className="mr-3 w-4 h-4" />
              <span>Blog Write</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog-preview"
              onClick={() => handleMenuItemClick("BlogList")}
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                selectedMenuItem === "BlogList"
                  ? "bg-gray-700 text-white font-semibold"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaEye className="mr-3 w-4 h-4" />
              <span>Blog Preview</span>
            </NavLink>
          </li>
        </ul>

        {/* Separator and Bottom Links */}
        <div className="mt-6 border-t border-gray-700 pt-6">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/account"
                onClick={() => handleMenuItemClick("Account")}
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                  selectedMenuItem === "Account"
                    ? "bg-gray-700 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <FaUser className="mr-3 w-4 h-4" />
                <span>Account</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                onClick={() => handleMenuItemClick("Settings")}
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                  selectedMenuItem === "Settings"
                    ? "bg-gray-700 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <FaCog className="mr-3 w-4 h-4" />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;