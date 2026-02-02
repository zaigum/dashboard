import React, { useState } from "react";
import { TextField, Button, Typography, Container, Link, IconButton, InputAdornment, Box, Paper } from "@mui/material";
import { Visibility, VisibilityOff, Person, Email, Lock } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUser } from "./IndexedDB";
import logo from "../assets/logo.png";
import backgroundImage from "../assets/bg.jpg";

const SignUp = ({ onSignUp, toggleForm }) => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username.trim()) return "Username is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Valid email is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleInputChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));
  const togglePasswordVisibility = (field) => () => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));

  const handleSignUp = async () => {
    const error = validateForm();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      const { username, email, password } = formData;
      await addUser(username.trim(), email.trim(), password);
      toast.success("Account created successfully!");
      setTimeout(() => onSignUp(username.trim(), email.trim()), 1000);
    } catch (error) {
      toast.error(error.message?.includes("unique") ? "Email already exists" : "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Box sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                Analytics
              </Typography>
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{ width: 48, height: 48, borderRadius: 1 }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                mb: 4,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create Account
            </Typography>

            {/* Form */}
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Username"
                value={formData.username}
                onChange={handleInputChange('username')}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                type={showPasswords.password ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility('password')} edge="end">
                        {showPasswords.password ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Confirm Password"
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility('confirmPassword')} edge="end">
                        {showPasswords.confirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSignUp}
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    component="button"
                    onClick={() => toggleForm('signin')}
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Container>
    </Box>
  );
};

export default SignUp;
