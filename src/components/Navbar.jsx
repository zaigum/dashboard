import React, { useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { MdEmail } from "react-icons/md";  
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, useNavigate } from "react-router-dom";  

const Navbar = ({
  toggleSidebar,
  isSidebarOpen,
  handleLogout,
  username,
  email,
  avatarSrc,  
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();  

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (menuItem) => {
    setAnchorEl(null);
    navigate(`/${menuItem.toLowerCase()}`);  
  };

  return (
    <div className="h-16 p-2 flex justify-between items-center px-4 border-b border-gray-200">
      {!isSidebarOpen && (
        <button className="focus:outline-none" onClick={toggleSidebar}>
          <FaBars />
        </button>
      )}
      <div className="flex items-center space-x-4 flex-grow">
        <div className="relative flex-grow">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            className="rounded-lg px-10 py-1 ml-3 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Search"
          />
        </div>
        <button
          className="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium mui-1ufdgwe focus:outline-none"
          type="button"
          aria-label="Contacts"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
          </svg>
          <span className="MuiTouchRipple-root mui-w0pj6f"></span>
        </button>
        <button
          className="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium mui-1ufdgwe focus:outline-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
          </svg>
          <span className="MuiTouchRipple-root mui-w0pj6f"></span>
        </button>
        <div>
          <Avatar
            alt="User Avatar"
            src={avatarSrc}  
            onClick={handleMenuOpen}
          />

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            getContentAnchorEl={null}
            elevation={2}
            PaperProps={{
              style: {
                borderRadius: 8,
                marginTop: 8,
              },
            }}
          >
            <MenuItem disabled>
              <div className="text-sm font-bold w-36 text-gray-700">
                User Info
              </div>
            </MenuItem>
            <MenuItem onClick={() => handleMenuClose("Account")}>
              <AccountCircleIcon fontSize="small" />
              <span className="ml-2">{username}</span>
            </MenuItem>
            <MenuItem onClick={() => handleMenuClose("Settings")}>
              <SettingsIcon fontSize="small" />
              <span className="ml-2">Settings</span>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" />
              <span className="ml-2">Logout</span>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
