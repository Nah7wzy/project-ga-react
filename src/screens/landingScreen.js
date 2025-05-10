import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../App.css";
// import { Car, CarContainer, CarImage, RemoveCarButton } from '../styles/CarCard.styled';
import Car from "../components/Car";
import EmptyState from "../components/EmptyState";
import Swal from "sweetalert2";

import {
  deleteCar,
  getCarsAPI,
  logout,
  isAuthenticated,
  editCar,
} from "../data/api";
import FileUploadScreen from "./uploadScreen";

import {
  ActionWrapper,
  Pagination,
  BackToTop,
} from "../styles/Herosection.style";

function LandingPage() {
  const [cars, setCars] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [filterRules, setFilterRules] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication status periodically
  useEffect(() => {
    // Check token validity every minute
    const tokenCheckInterval = setInterval(() => {
      // This will automatically redirect if token is expired
      const stillValid = isAuthenticated();
      if (!stillValid) {
        console.log("Token no longer valid, session will be redirected");
      }
    }, 60000); // Check every minute

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const removeCar = useCallback(
    async (carId, public_id) => {
      try {
        // No need for a second confirmation dialog here - already handled in Car component
        setIsLoading(true);

        const response = await deleteCar(carId, public_id);

        if (response && response.error) {
          throw new Error(response.message || "Failed to delete car");
        }

        // Refresh cars list
        const updatedCars = await getCarsAPI(pageNumber, filterRules);
        setCars(updatedCars);

        Swal.fire("Deleted!", "Car has been deleted successfully.", "success");
      } catch (err) {
        console.error("Error removing car:", err);
        Swal.fire("Error!", err.message || "Failed to delete car", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [pageNumber, filterRules]
  );

  const updateCar = useCallback(
    async (carId, carData) => {
      try {
        setIsLoading(true);

        const response = await editCar(carId, carData);

        if (response && response.error) {
          throw new Error(response.message || "Failed to update car");
        }

        // Refresh cars list
        const updatedCars = await getCarsAPI(pageNumber, filterRules);
        setCars(updatedCars);

        Swal.fire("Updated!", "Car has been updated successfully.", "success");
      } catch (err) {
        console.error("Error updating car:", err);
        Swal.fire("Error!", err.message || "Failed to update car", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [pageNumber, filterRules]
  );

  const handleFilter = useCallback(async (e) => {
    if (e) e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const newFilterRules = {};

      // Get values from form elements
      const options = ["start", "end", "min", "max", "transmission"];

      options.forEach((option) => {
        const element = document.querySelector(`[name=${option}]`);
        if (element) {
          newFilterRules[option] = element.value;
        }
      });

      const keywordElement = document.querySelector("[name='search']");
      if (keywordElement) {
        newFilterRules.keyword = keywordElement.value;
      }

      const loanElement = document.querySelector("[name='loan']");
      if (loanElement) {
        newFilterRules.loan = loanElement.checked;
      }

      setFilterRules(newFilterRules);
      setPageNumber(1);
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to apply filters");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearFilter = useCallback(() => {
    // Clear form values
    const options = ["start", "end", "min", "max", "transmission", "search"];

    options.forEach((option) => {
      const element = document.querySelector(`[name=${option}]`);
      if (element) {
        element.value = "";
      }
    });

    const loanElement = document.querySelector("[name='loan']");
    if (loanElement) {
      loanElement.checked = false;
    }

    // Reset filter state
    setFilterRules({});
    setError(null);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch cars data
  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    const getCars = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching cars data for page:", pageNumber);
        const carsList = await getCarsAPI(pageNumber, filterRules);

        if (!isMounted) return;

        if (carsList && carsList.error) {
          throw new Error(carsList.message || "Failed to fetch cars");
        }

        // Validate that we received proper data structure
        if (!carsList || !carsList.data) {
          console.error("Unexpected response format:", carsList);
          throw new Error("Received invalid data format from server");
        }

        setCars(carsList);
      } catch (err) {
        if (!isMounted) return;

        console.error("Error fetching cars:", err);
        setError(err.message || "Failed to fetch cars");

        // Set empty data state to prevent UI errors, but only if no data exists yet
        setCars((prevCars) => {
          if (!prevCars) {
            return { data: [], amountOfCars: 0, itemsPerPage: 12 };
          }
          return prevCars;
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getCars();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [pageNumber, filterRules]);

  // Memoize pagination buttons to prevent unnecessary re-renders
  const paginationButtons = useMemo(() => {
    if (!cars || !cars.amountOfCars) return null;

    const totalPages = Math.ceil(cars.amountOfCars / cars.itemsPerPage);
    return [...Array(totalPages)].map((_, index) => (
      <button
        key={index}
        className={pageNumber === index + 1 ? "active-page" : ""}
        onClick={() => setPageNumber(index + 1)}
        disabled={isLoading}
      >
        {index + 1}
      </button>
    ));
  }, [cars, pageNumber, isLoading]);

  // Scroll to top handler
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <div className="landing-container">
      <div
        className="header-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "var(--clr-primary-500)", margin: 0 }}>
          Car Management Dashboard
        </h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--clr-primary-400)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "14px",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--clr-primary-500)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--clr-primary-400)")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: "inline" }}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>

      <div className="container">
        <h3 className="text-primary font-weight-bolder border-bottom text-center">
          Upload Car
        </h3>
        <FileUploadScreen />
      </div>

      <ActionWrapper>
        <form onSubmit={handleFilter}>
          <input
            type="search"
            name="search"
            placeholder="Enter keywords..."
            disabled={isLoading}
          />
          <div className="actions">
            <input
              type="submit"
              value={isLoading ? "Loading..." : "Search"}
              className="actions__submit"
              disabled={isLoading}
            />
            <button
              onClick={clearFilter}
              className="actions__clear"
              type="button"
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
        </form>
      </ActionWrapper>

      {error && (
        <div
          className="error-message"
          style={{
            padding: "15px",
            margin: "15px 0",
            backgroundColor: "#ffebee",
            border: "1px solid #ffcdd2",
            borderRadius: "4px",
            color: "#c62828",
          }}
        >
          {error}
          <button
            onClick={() => {
              setError(null);
              setPageNumber(1);
              setCars(null);
            }}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {isLoading && <div className="loading">Loading cars...</div>}

      {!isLoading && cars && cars.data && (
        <>
          {cars.data.length > 0 ? (
            <>
              <Car
                cars={cars.data}
                sortUtil={filterRules}
                updateSortUtil={setFilterRules}
                removeCar={removeCar}
                editCar={updateCar}
              />

              {windowWidth < 768 && <BackToTop onClick={scrollToTop} />}

              <Pagination>{paginationButtons}</Pagination>
            </>
          ) : (
            <EmptyState />
          )}
        </>
      )}
    </div>
  );
}

export default LandingPage;
