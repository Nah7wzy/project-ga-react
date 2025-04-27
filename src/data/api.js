import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Base API URL configuration
// Using environment variable is preferred for different environments
const API_URL =
  process.env.REACT_APP_API_URL || "https://ga-server-1763.onrender.com/cars/";

// Track API initialization status
let apiInitialized = false;
let initializationPromise = null;

// Initialize API connection
export const initializeAPI = async () => {
  // If already initialized, return immediately
  if (apiInitialized) {
    return API_URL;
  }

  // If initialization is in progress, return the existing promise
  if (initializationPromise) {
    return initializationPromise;
  }

  // Create new initialization promise
  initializationPromise = (async () => {
    try {
      console.log("Initializing API connection to:", API_URL);
      await api.get(API_URL);
      api.defaults.baseURL = API_URL;
      console.log("Successfully connected to API");
      apiInitialized = true;
      return API_URL;
    } catch (err) {
      console.error("API connection failed:", err.message);
      api.defaults.baseURL = API_URL; // Still set the base URL even if the test request failed
      return API_URL;
    }
  })();

  return initializationPromise;
};

// Initialize the API when this module is imported
// Use a timeout to separate initial API call from React rendering
setTimeout(() => {
  initializeAPI().then((url) => {
    console.log("API initialization completed with URL:", url);
  });
}, 100);

// Error handler utility
const handleApiError = (error, customMessage = "API request failed") => {
  if (error.response) {
    // Server responded with an error status
    console.error(
      `API Error ${error.response.status}: ${
        error.response.data?.message || customMessage
      }`
    );
    return {
      error: true,
      status: error.response.status,
      message: error.response.data?.message || customMessage,
    };
  } else if (error.request) {
    // Request was made but no response received
    console.error("No response received from the server");
    return {
      error: true,
      status: 0,
      message: "No response from server",
    };
  } else {
    // Error in setting up the request
    console.error(`Request setup error: ${error.message}`);
    return {
      error: true,
      status: 0,
      message: error.message,
    };
  }
};

// Add a request counter to detect excessive requests
let requestCount = 0;
const REQUEST_THRESHOLD = 20;
const REQUEST_RESET_INTERVAL = 10000; // 10 seconds

// Reset request count periodically
setInterval(() => {
  if (requestCount > 0) {
    console.log(
      `Resetting request count. Made ${requestCount} requests in the last interval.`
    );
    requestCount = 0;
  }
}, REQUEST_RESET_INTERVAL);

export const multipleFilesUpload = async (data, options) => {
  try {
    // First ensure API is initialized
    if (!apiInitialized) {
      await initializeAPI();
    }

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token missing. Please log in again.");
      return {
        success: false,
        message: "Authentication token missing. Please log in again.",
      };
    }

    // Log the files being sent for debugging
    if (data.getAll && typeof data.getAll === "function") {
      const files = data.getAll("files");
      console.log(`Uploading ${files.length} files`, files);
    }

    // Create a direct axios request without going through the API instance
    // This avoids potential issues with interceptors or base URL configuration
    const response = await axios({
      method: "post",
      url: "https://ga-server-1763.onrender.com/cars/multipleFiles",
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
        // Let the browser set the correct Content-Type for FormData
      },
      onUploadProgress: options?.onUploadProgress,
    });

    console.log("File upload successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in multipleFilesUpload:", error);

    // Additional debugging
    if (error.response) {
      console.error("Server response:", error.response.data);
    }

    return handleApiError(error, "Failed to upload files");
  }
};

export const getMultipleFiles = async () => {
  try {
    const response = await api.get("getMultipleFiles");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to get files");
  }
};

export const removeImageapi = async (filepath) => {
  try {
    const response = await api.post("deleteImage", { filepath });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to remove image");
  }
};

export const deleteCar = async (carId, public_id) => {
  try {
    // Fix the public_id format issue while maintaining the proper error handling
    const response = await api.post("deleteCar", {
      carId,
      public_id: Array.isArray(public_id) ? public_id[0] : public_id,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Failed to delete car");
  }
};

export const loginUser = async (username, password) => {
  try {
    // Validate input parameters
    if (!password) {
      return {
        error: true,
        message: "Password is required",
      };
    }

    if (!username) {
      return {
        error: true,
        message: "Username is required",
      };
    }

    // Use the modern API authentication endpoint
    try {
      console.log("Attempting login with /api/auth/login");
      // Note: We're using the full URL here to bypass baseURL which points to /cars/
      const response = await axios.post(
        "https://ga-server-1763.onrender.com/api/auth/login",
        {
          username,
          password,
        }
      );

      if (response.data.token) {
        console.log("Login successful with JWT token");

        // Store the token
        localStorage.setItem("token", response.data.token);

        // Calculate and store token expiration (24 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        localStorage.setItem("tokenExpiration", expiresAt.toISOString());

        return {
          success: true,
          data: response.data,
        };
      }

      return {
        error: true,
        message: "Invalid response from authentication server",
      };
    } catch (err) {
      console.error("Authentication failed:", err);
      return {
        error: true,
        message:
          err.response?.data?.message ||
          "Authentication failed. Please check your credentials.",
        status: err.response?.status || 500,
      };
    }
  } catch (error) {
    console.error("Login failed:", error);

    // Handle different error cases
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage =
        error.response.data?.message || "Authentication failed";

      if (statusCode === 401) {
        return {
          error: true,
          message:
            "Invalid credentials. Please check your username and password.",
          status: statusCode,
        };
      } else if (statusCode === 429) {
        return {
          error: true,
          message: "Too many login attempts. Please try again later.",
          status: statusCode,
        };
      } else {
        return {
          error: true,
          message: errorMessage,
          status: statusCode,
        };
      }
    }

    // Network or other errors
    return {
      error: true,
      message:
        error.message || "Login failed. Please check your internet connection.",
    };
  }
};

export const logout = (reason = "") => {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiration");

  // If there's a reason for logout (like expired token), add it as a parameter
  if (reason) {
    window.location.href = `/?logout=true&reason=${encodeURIComponent(reason)}`;
  } else {
    window.location.href = "/";
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const tokenExpiration = localStorage.getItem("tokenExpiration");

  if (!token) {
    return false;
  }

  // Check if token has expired
  if (tokenExpiration) {
    const expiresAt = new Date(tokenExpiration);
    const now = new Date();

    if (now >= expiresAt) {
      // Token has expired, clear it
      console.log("Token expired, logging out");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      logout("expired");
      return false;
    }
  }

  return true;
};

export const getCarsAPI = async (pageNumber = 1, filterOptions = {}) => {
  // Increment request counter
  requestCount++;

  // Check for potential request flood
  if (requestCount > REQUEST_THRESHOLD) {
    console.warn(
      `Excessive requests detected (${requestCount} in short period). Possible infinite loop.`
    );
  }

  try {
    // Ensure API is initialized before making requests
    if (!apiInitialized) {
      console.log("API not yet initialized, waiting for initialization...");
      await initializeAPI();
    }

    // Build query params
    const params = new URLSearchParams();
    params.append("page", pageNumber);

    // Add filter options to params
    for (const [key, value] of Object.entries(filterOptions)) {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    }

    console.log(
      `Making request to: ${api.defaults.baseURL}?${params.toString()}`
    );
    const response = await api.get(`?${params.toString()}`);
    console.log(
      "Cars data received:",
      response.data ? "success" : "empty response"
    );
    return response.data;
  } catch (error) {
    console.error("Error in getCarsAPI:", error.message);
    return handleApiError(error, "Failed to get cars");
  }
};
