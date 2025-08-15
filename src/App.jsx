import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import AccountContent from "./components/AccountContent";
import Sidebar from "./components/Sidebar";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Overview");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    localStorage.setItem("isSidebarOpen", !isSidebarOpen);
  };

  return (
    <Router>
      <div className="flex h-screen">
        <ToastContainer />
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          setSelectedMenuItem={setSelectedMenuItem}
          selectedMenuItem={selectedMenuItem}
        />
        <div
          className={`flex flex-col flex-grow ${
            isSidebarOpen ? "ml-64" : "ml-0"
          } transition-all duration-300`}
        >
          <Navbar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            selectedMenuItem={selectedMenuItem}
          />
          <Routes>
            <Route path="/account" element={<AccountContent />} />
            <Route
              path="/blog-write"
              element={<Content selectedMenuItem="Blog" />}
            />
            <Route
              path="/blog-preview"
              element={<Content selectedMenuItem="BlogList" />}  
            />
            <Route
              path="/overview"
              element={<Content selectedMenuItem="Overview" />}
            />
            <Route
              path="/settings"
              element={<Content selectedMenuItem="Settings" />}
            />
            <Route path="/" element={<Content selectedMenuItem="Overview" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
