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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { openDatabase } from "./IndexedDB";
import logo from "../assets/logo.png";
import backgroundImage from "../assets/bg.jpg";

const SignIn = ({ onLogin, toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateUser = async (email, password) => {
    const db = await openDatabase();
    const transaction = db.transaction(["users"], "readonly");
    const objectStore = transaction.objectStore("users");
    const emailIndex = objectStore.index("email");
    
    return new Promise((resolve, reject) => {
      const request = emailIndex.get(email);
      request.onsuccess = () => {
        const user = request.result;
        if (user && user.password === password) {
          resolve(user);
        } else {
          reject("Invalid credentials");
        }
      };
      request.onerror = () => reject("Database error");
    });
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);
    try {
      const user = await validateUser(email.trim(), password);
      localStorage.setItem("currentUser", JSON.stringify({
        username: user.username,
        email: user.email,
        id: user.id
      }));
      toast.success("Login successful!");
      setTimeout(() => {
        onLogin(user);
      }, 1000);
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
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
              <Typography component="h1" variant="h6">
                Analytics
              </Typography>
              <img src={logo} alt="Logo" className="w-12 h-12" />
            </div>
            <Typography
              component="h2"
              variant="h5"
              className="text-center font-bold italic mb-6"
            >
              Sign In
            </Typography>
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
                  disabled={loading}
                  style={{ marginTop: 20 }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
                
                <div className="mt-4 text-sm text-center">
                  <Typography variant="body2">
                    Don't have an account?{" "}
                    <Link href="#" onClick={() => toggleForm("signup")}>
                      Sign Up
                    </Link>
                  </Typography>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default SignIn;