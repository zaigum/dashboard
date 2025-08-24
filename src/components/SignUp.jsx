import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUser } from "./IndexedDB";
import logo from "../assets/logo.png";
import backgroundImage from "../assets/bg.jpg";

const SignIn = ({ onSignIn, toggleForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignIn = () => {
    if (!username || !email || !password || password !== confirmPassword) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    addUser(username, email, password)
      .then(() => {
        toast.success("Sign-UP successful!");
        onSignIn(username, email, password);
      })
      .catch((error) => {
        toast.error("Error signing in: " + error);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      className="bg-gray-950 w-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="sm">
        <div className="bg-white shadow-lg w-5/6 ml-12 rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center font-semibold italic justify-between mb-8">
              <Typography component="h1" variant="h6">
                Analytics{" "}
              </Typography>
              <img src={logo} alt="Logo" className="w-12 h-12" />
            </div>
            <Typography
              component="h2"
              variant="h5"
              className="italic text-center mb-6"
            >
              Sign Up
            </Typography>
            <form>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSignIn}
                style={{ marginTop: 20 }}
              >
                Sign Up
              </Button>
              <div className="mt-4 text-sm text-center">
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link href="#" onClick={() => toggleForm("login")}>
                    Sign In
                  </Link>
                </Typography>
              </div>
            </form>
          </div>
        </div>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
