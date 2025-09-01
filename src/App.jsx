import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import AccountContent from "./components/AccountContent";
import Sidebar from "./components/Sidebar";
import AuthWrapper from "./components/AuthWrapper";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Overview");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    localStorage.setItem("isSidebarOpen", !isSidebarOpen);
  };

  const handleAuthenticated = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthWrapper onAuthenticated={handleAuthenticated} />;
  }

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
            currentUser={currentUser}
            onLogout={handleLogout}
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
