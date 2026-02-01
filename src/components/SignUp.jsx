import React, { useState } from "react";
import { TextField, Button, Typography, Container, Link, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
    <div className="bg-gray-950 w-screen flex justify-center items-center" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", minHeight: "100vh" }}>
      <Container maxWidth="sm">
        <div className="bg-white shadow-lg w-5/6 ml-12 rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center font-semibold italic justify-between mb-8">
              <Typography component="h1" variant="h6">Analytics</Typography>
              <img src={logo} alt="Logo" className="w-12 h-12" />
            </div>
            <Typography component="h2" variant="h5" className="italic text-center mb-6">Sign Up</Typography>
            <form>
              <TextField variant="outlined" margin="normal" fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus value={formData.username} onChange={handleInputChange('username')} />
              <TextField variant="outlined" margin="normal" fullWidth id="email" label="Email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange('email')} />
              <TextField variant="outlined" margin="normal" fullWidth name="password" label="Password" type={showPasswords.password ? "text" : "password"} id="password" autoComplete="new-password" value={formData.password} onChange={handleInputChange('password')} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility('password')} edge="end">{showPasswords.password ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
              <TextField variant="outlined" margin="normal" fullWidth name="confirmPassword" label="Confirm Password" type={showPasswords.confirmPassword ? "text" : "password"} id="confirmPassword" autoComplete="new-password" value={formData.confirmPassword} onChange={handleInputChange('confirmPassword')} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={togglePasswordVisibility('confirmPassword')} edge="end">{showPasswords.confirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
              <Button fullWidth variant="contained" color="primary" onClick={handleSignUp} disabled={loading} style={{ marginTop: 20 }}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
              <div className="mt-4 text-sm text-center">
                <Typography variant="body2">
                  Already have an account? <Link href="#" onClick={() => toggleForm("signin")}>Sign In</Link>
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

export default SignUp;
