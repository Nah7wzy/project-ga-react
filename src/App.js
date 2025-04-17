import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import LandingPage from "./screens/landingScreen";
import { isAuthenticated } from "./data/api";
import "./App.css";

// Protected route component
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated using the updated function
  const authenticated = isAuthenticated();

  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  // Check token validity on app startup
  useEffect(() => {
    // Force token validation when app loads
    isAuthenticated();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/landing"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
