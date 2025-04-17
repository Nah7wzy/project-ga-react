import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, isAuthenticated } from "../data/api";
import Swal from "sweetalert2";

import {
  FormContainer,
  Holder,
  InputForm,
  LoginButton,
  LoginContainer,
} from "../styles/Login.styled";

export default function Login() {
  const [inputs, setInputs] = useState({
    username: "admin",
    password: "",
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already logged in or if we need to force logout
  useEffect(() => {
    // Get the force logout parameter from URL
    const params = new URLSearchParams(location.search);
    const forceLogout = params.get("logout") === "true";

    if (forceLogout) {
      // If force logout is set, we've already cleared the token
      // Just show a message
      Swal.fire({
        title: "Logged Out",
        text: "Your session has expired. Please login again.",
        icon: "info",
        timer: 3000,
        showConfirmButton: false,
      });

      // Clear the URL parameter
      window.history.replaceState({}, document.title, "/");
    } else if (isAuthenticated()) {
      // If authenticated, redirect to landing
      navigate("/landing");
    }
  }, [navigate, location.search]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!inputs.username) {
      newErrors.username = "Username is required";
    }

    if (!inputs.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Pass username and password to loginUser
      const response = await loginUser(inputs.username, inputs.password);
      console.log("Login response:", response);

      if (response.success) {
        // Handle successful login
        Swal.fire({
          title: "Success!",
          text: "Login successful",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/landing");
        });
      } else if (response.error) {
        // Handle login error with specific message from the API
        Swal.fire({
          title: "Authentication Failed",
          text: response.message || "Invalid credentials",
          icon: "error",
        });
      } else {
        // Fallback for unexpected response format
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Network or other critical errors
      Swal.fire({
        title: "Connection Error",
        text: "Could not connect to the server. Please check your internet connection.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <Holder>
      <LoginContainer>
        <h2>LOGIN</h2>
        <FormContainer onSubmit={handleSubmit}>
          <label>Username</label>
          <InputForm
            type="text"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
          {errors.username && (
            <span className="error-message">{errors.username}</span>
          )}
          <br />

          <label>Password</label>
          <InputForm
            type={passwordShown ? "text" : "password"}
            name="password"
            value={inputs.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}

          <label htmlFor="toggle" className="show-password">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              onChange={togglePassword}
            />
            <span>Show Password</span>
          </label>
          <br />

          <LoginButton
            type="submit"
            disabled={isLoading}
            value={isLoading ? "Logging in..." : "Login"}
          />
        </FormContainer>
      </LoginContainer>
    </Holder>
  );
}
