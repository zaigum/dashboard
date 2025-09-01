import React, { useState, useEffect } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const AuthWrapper = ({ onAuthenticated }) => {
  const [currentForm, setCurrentForm] = useState("signin");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      onAuthenticated(JSON.parse(currentUser));
    }
  }, [onAuthenticated]);

  const handleLogin = (user) => {
    onAuthenticated(user);
  };

  const handleSignUp = (username, email) => {
    setCurrentForm("signin");
  };

  const toggleForm = (form) => {
    setCurrentForm(form === "signup" ? "signup" : "signin");
  };

  return (
    <>
      {currentForm === "signin" ? (
        <SignIn onLogin={handleLogin} toggleForm={toggleForm} />
      ) : (
        <SignUp onSignUp={handleSignUp} toggleForm={toggleForm} />
      )}
    </>
  );
};

export default AuthWrapper;