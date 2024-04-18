import React, { useState, useEffect } from "react";
import OverviewContent from "./OverviewContent";
import AccountContent from "./AccountContent";
import SettingsContent from "./SettingsContent";
import Blog from "./Blog/Blog";
import BlogListPage from "./BlogListPage";
import { openDB } from "idb";

const Content = ({ selectedMenuItem }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (selectedMenuItem === "BlogList") {
      retrieveBlogs();
    }
  }, [selectedMenuItem]);

  const retrieveBlogs = async () => {
    try {
      const dbVersion = 3;
      const db = await openDB("blogDB", dbVersion);
      const savedBlogs = await db.getAll("blogs");
      setBlogs(savedBlogs);
    } catch (error) {
      console.error("Error retrieving blogs:", error);
    }
  };

  const updateBlogs = (newBlog) => {
    setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
  };

  switch (selectedMenuItem) {
    case "Overview":
      return <OverviewContent />;
    case "Account":
      return <AccountContent />;
    case "Settings":
      return <SettingsContent />;
    case "Blog":
      return <Blog updateBlogs={updateBlogs} />;
    case "BlogList":
      return <BlogListPage blogs={blogs} />;
    default:
      return <div>Default Content</div>;
  }
};

export default Content;
