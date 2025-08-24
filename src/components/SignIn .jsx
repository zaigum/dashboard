import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../assets/logo.png";  
import backgroundImage from "../assets/bg.jpg";  

const Login = ({ onLogin, toggleForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("loginUsername");
    const storedEmail = localStorage.getItem("loginEmail");
    setUsername(storedUsername || "");
    setEmail(storedEmail || "");
  }, []);

  const handleLogin = () => {
    localStorage.setItem("loginUsername", username);
    localStorage.setItem("loginEmail", email);

    if (!username && !email) {
      toast.error("Please enter your username or email.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    onLogin(username || email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="w-screen h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <Container component="main" maxWidth="xs">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-4">
            <div className="flex items-center font-semibold italic justify-between mb-8">
              <Typography component="h1" variant="h6" className="text-center">
                Analytics{" "}
              </Typography>
              <img src={logo} alt="Logo" className="w-12 h-12" />
            </div>
            <Typography
              component="h2"
              variant="h5"
              className="text-center font-bold italic  mb-6"
            >
              Sign In{" "}
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: "100%", padding: 20 }}>
                <form style={{ width: "100%", marginTop: 1 }}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    style={{ marginTop: 20 }}
                  >
                    Sign In
                  </Button>
                  <Link
                    href="#"
                    variant="body2"
                    style={{ marginTop: 10 }}
                    onClick={() => console.log("Forgot Password clicked")}
                  >
                    Forgot Password?
                  </Link>
                  <p className="mt-4 text-sm text-center">
                    Don't have an account?{" "}
                    <button
                      onClick={() => toggleForm("signin")}
                      className="text-blue-500"
                    >
                      Sign Up
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Login;
