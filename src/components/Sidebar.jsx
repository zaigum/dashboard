import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartLine,
  FaBoxes,
  FaBuilding,
  FaUser,
  FaCog,
  FaSignInAlt,
  FaUserPlus,
  FaExclamationTriangle,
  FaTimes,
  FaChevronUp,
  FaChevronDown,
  FaBlog,
  FaEye,
} from "react-icons/fa";
import logo from "../assets/logo.png";

const Sidebar = ({
  isOpen,
  toggleSidebar,
  setSelectedMenuItem,
  selectedMenuItem,
}) => {
  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    localStorage.setItem("selectedMenuItem", menuItem);
  };

  useEffect(() => {
    const storedMenuItem = localStorage.getItem("selectedMenuItem");
    if (storedMenuItem) {
      setSelectedMenuItem(storedMenuItem);
    }
  }, []);

  return (
    <div
      className={`bg-gray-950 text-white border-r	  h-full w-64 fixed top-0 left-0 z-50 transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-3 flex justify-between items-center">
        <img src={logo} alt="Logo" className="w-14 h-14 mr-2 rounded-full" />
        <button
          className="text-gray-300 hover:text-white px-2 py-2 rounded transition duration-300 focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaTimes />
        </button>
      </div>
      <div className="border-stone-200 rounded-xl ml-4 mr-4 bg-gray-800 relative">
        <div className="p-4">
          <h1 className="font-bold text-white">Analytics</h1>
          <p className="text-gray-200 text-sm">Production</p>
        </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 right-4">
          <FaChevronUp className="text-gray-600 text-sm cursor-pointer" />
          <FaChevronDown className="text-gray-600 text-sm cursor-pointer" />
        </div>
      </div>
      <div className="border-t mt-4 border-gray-700"></div>
      <nav className="mt-4 flex-1">
        <ul>
          <li className="  p-2">
            <NavLink
              to="/blog-write"
              onClick={() => handleMenuItemClick("Blog")}
              className={`flex items-center px-4 py-2 rounded transition duration-300 ${
                selectedMenuItem === "Blog"
                  ? "text-white font-bold bg-gray-700"
                  : "text-gray-300 hover:text-white"
              }`}
              activeClassName="text-white font-bold bg-gray-700"
            >
              <FaBlog className="mr-3" />
              <span className="text-sm">Blog Write</span>
            </NavLink>
          </li>
          <li className="  p-2">
            <NavLink
              to="/blog-preview"
              onClick={() => handleMenuItemClick("BlogList")}
              className={`flex items-center px-4 py-2 rounded transition duration-300 ${
                selectedMenuItem === "BlogList"
                  ? "text-white font-bold bg-gray-700"
                  : "text-gray-300 hover:text-white"
              }`}
              activeClassName="text-white font-bold bg-gray-700"
            >
              <FaEye className="mr-3" />
              <span className="text-sm"> Blog Preview</span>
            </NavLink>
          </li>

          <li className="  p-2">
            <NavLink
              to="/overview"
              onClick={() => handleMenuItemClick("Overview")}
              className={`flex items-center px-4 py-2 rounded transition duration-300 ${
                selectedMenuItem === "Overview"
                  ? "text-white font-bold bg-gray-700"
                  : "text-gray-300 hover:text-white"
              }`}
              activeClassName="text-white font-bold bg-gray-700"
            >
              <FaChartLine className="mr-3" />
              <span className="text-sm">Overview</span>
            </NavLink>
          </li>

          <li className="  p-2">
            <NavLink
              to="/account"
              onClick={() => handleMenuItemClick("Account")}
              className={`flex items-center px-4 py-2 rounded transition duration-300 ${
                selectedMenuItem === "Account"
                  ? "text-white font-bold bg-gray-700"
                  : "text-gray-300 hover:text-white"
              }`}
              activeClassName="text-white font-bold bg-gray-700"
            >
              <FaUser className="mr-3" />
              <span className="text-sm">Account</span>
            </NavLink>
          </li>
          <li className="  p-2">
            <NavLink
              to="/settings"
              onClick={() => handleMenuItemClick("Settings")}
              className={`flex items-center px-4 py-2 rounded transition duration-300 ${
                selectedMenuItem === "Settings"
                  ? "text-white font-bold bg-gray-700"
                  : "text-gray-300 hover:text-white"
              }`}
              activeClassName="text-white font-bold bg-gray-700"
            >
              <FaCog className="mr-3" />
              <span className="text-sm">Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
