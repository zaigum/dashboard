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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={24} sx={{ borderRadius: 4, overflow: 'hidden', backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.95)' }}>
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #2196F3, #21CBF3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Analytics</Typography>
              <Box component="img" src={logo} alt="Logo" sx={{ width: 48, height: 48, borderRadius: 2 }} />
            </Box>
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary', fontWeight: 500 }}>Create Account</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField variant="outlined" fullWidth label="Username" value={formData.username} onChange={handleInputChange('username')} InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: 'action.active' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <TextField variant="outlined" fullWidth label="Email" type="email" value={formData.email} onChange={handleInputChange('email')} InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: 'action.active' }} /></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <TextField variant="outlined" fullWidth label="Password" type={showPasswords.password ? "text" : "password"} value={formData.password} onChange={handleInputChange('password')} InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: 'action.active' }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={togglePasswordVisibility('password')} edge="end">{showPasswords.password ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <TextField variant="outlined" fullWidth label="Confirm Password" type={showPasswords.confirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange('confirmPassword')} InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: 'action.active' }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={togglePasswordVisibility('confirmPassword')} edge="end">{showPasswords.confirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              <Button fullWidth variant="contained" onClick={handleSignUp} disabled={loading} sx={{ mt: 2, py: 1.5, borderRadius: 2, fontSize: '1.1rem', fontWeight: 600, background: 'linear-gradient(45deg, #2196F3, #21CBF3)', '&:hover': { background: 'linear-gradient(45deg, #1976D2, #0288D1)' } }}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Already have an account? <Link href="#" onClick={() => toggleForm("signin")} sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Sign In</Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
      <ToastContainer position="top-right" theme="colored" />
    </Box>
  );
};

export default SignUp;
