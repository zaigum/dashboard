import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateUserAccount } from "../components/IndexedDB";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri"; // React Icons
import { ToastContainer } from "react-toastify";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";

const AccountContent = ({ username: initialUsername, email: initialEmail }) => {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [updateField, setUpdateField] = useState("all");

  const handleUpdateAccount = () => {
    setError("");

    if (!updateField) {
      setError("Please select a field to update.");
      toast.error("Please select a field to update.");
      return;
    }

    if (
      updateField === "all" &&
      (!username || !email || !newPassword || !confirmNewPassword)
    ) {
      setError("All fields are required.");
      toast.error("All fields are required.");
      return;
    }

    if (updateField === "username" && !username) {
      setError("Username is required.");
      toast.error("Username is required.");
      return;
    }

    if (updateField === "email" && !email) {
      setError("Email is required.");
      toast.error("Email is required.");
      return;
    }

    if (updateField === "password" && (!newPassword || !confirmNewPassword)) {
      setError("Please enter and confirm the new password.");
      toast.error("Please enter and confirm the new password.");
      return;
    }

    if (updateField === "password" && newPassword !== confirmNewPassword) {
      setError("Passwords don't match.");
      toast.error("Passwords don't match.");
      return;
    }

    updateUserAccount(
      username,
      email,
      newPassword,
      null, // Pass null for avatar since we're not using it
      updateField === "email",
      updateField === "password"
    )
      .then(() => {
        toast.success("Account updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating account:", error);
        toast.error(
          "An error occurred while updating the account. Please try again later."
        );
      });
  };

  return (
    <div className="w-full h-full p-2   flex flex-col">
      <h1 className="text-2xl font-semibold mb-3">Account Information</h1>

      <div className="p-6 ">
        <div className="space-y-4">
          <FormControl fullWidth>
            <InputLabel id="select-field-label">Select Field </InputLabel>
            <Select
              labelId="select-field-label"
              value={updateField}
              onChange={(e) => setUpdateField(e.target.value)}
              label="Select Field"
            >
              <MenuItem value="all">All Fields</MenuItem>
              <MenuItem value="username">Username</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="password">Password</MenuItem>
            </Select>
          </FormControl>
          {(updateField === "all" || updateField === "username") && (
            <TextField
              label="New Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
          )}
          {(updateField === "all" || updateField === "email") && (
            <TextField
              label="New Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          )}
          {(updateField === "all" || updateField === "password") && (
            <>
              <TextField
                label="New Password"
                variant="outlined"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm New Password"
                variant="outlined"
                type={showConfirmNewPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmNewPassword(!showConfirmNewPassword)
                        }
                        edge="end"
                      >
                        {showConfirmNewPassword ? (
                          <RiEyeOffLine />
                        ) : (
                          <RiEyeLine />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateAccount}
              variant="contained"
              size="medium" // Set size to medium
              sx={{
                backgroundColor: "#374151",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#4b5563",
                },
                borderRadius: "20px",
              }}
            >
              Update Account
            </Button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AccountContent;
