import React, { memo, useState, useCallback, useRef } from "react";
import {
  CarDetails,
  CarTitle,
  CarDate,
  CarDescription,
  CarDescriptionGroup,
  CarFooter,
  CarImageContainer,
  CarImage,
} from "../styles/Car.style";

import {
  CarContainer as StyledCarContainer,
  RemoveCarButton,
  EditCarButton,
} from "../styles/CarCard.styled";
import Swal from "sweetalert2";
import EditCarModal from "./EditCarModal";

// Individual car item component - memoized for performance
const CarItem = memo(({ car, onRemove, onEdit }) => {
  const {
    files: images,
    make,
    model,
    price,
    transmission,
    year,
    pids,
    _id,
  } = car;
  const [imageError, setImageError] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const itemRef = useRef(null);

  // Format currency
  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Confirmation dialog before removing
  const confirmRemove = useCallback(() => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this car!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        onRemove(_id, pids);
      }
    });
  }, [_id, pids, onRemove]);

  // Open edit modal
  const handleEdit = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditModal(true);
  }, []);

  // Close edit modal
  const handleCloseModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  // Handle edit submission
  const handleSubmitEdit = useCallback(
    (updatedCar) => {
      if (typeof onEdit === "function") {
        onEdit(_id, updatedCar);
        setShowEditModal(false);
      } else {
        console.error("onEdit is not a function", onEdit);
        Swal.fire(
          "Error",
          "Could not update car due to a technical issue.",
          "error"
        );
        setShowEditModal(false);
      }
    },
    [_id, onEdit]
  );

  return (
    <div className="car-item" ref={itemRef}>
      <div className="car-content">
        <CarImageContainer>
          {imageError ? (
            <div className="fallback-image">No Image Available</div>
          ) : (
            <CarImage
              src={images[0]}
              alt={`${make} ${model}`}
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </CarImageContainer>
        <CarDetails>
          <CarTitle>
            {make} {model.toLowerCase()}
          </CarTitle>
          <CarDate>{year}</CarDate>
          <CarDescription>
            <CarDescriptionGroup>
              <div>
                <p>{formattedPrice}</p>
              </div>
              <div>
                <p>{transmission || "N/A"}</p>
              </div>
            </CarDescriptionGroup>
          </CarDescription>
          <CarFooter>
            <EditCarButton onClick={handleEdit}>Edit Car</EditCarButton>
            <RemoveCarButton onClick={confirmRemove}>
              Remove Car
            </RemoveCarButton>
          </CarFooter>
        </CarDetails>
      </div>

      {showEditModal && (
        <EditCarModal
          car={car}
          onClose={handleCloseModal}
          onSubmit={handleSubmitEdit}
        />
      )}
    </div>
  );
});

CarItem.displayName = "CarItem";

// Main Car component
function Car({ cars, sortUtil, updateSortUtil, removeCar, editCar }) {
  // Make sure editCar is available
  const editCarHandler = useCallback(
    (carId, updatedData) => {
      if (typeof editCar === "function") {
        editCar(carId, updatedData);
      } else {
        console.error("editCar function is not available!", editCar);
        Swal.fire("Error", "Edit functionality is not available", "error");
      }
    },
    [editCar]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (e) => {
      const value = e.target.value;
      const direction = value.startsWith("a") ? 1 : -1;

      updateSortUtil({
        ...sortUtil,
        sort: value,
        sortDirection: direction,
      });
    },
    [sortUtil, updateSortUtil]
  );

  // If no cars, return null
  if (!cars || cars.length === 0) {
    return null;
  }

  return (
    <div className="cars-wrapper">
      <div className="sort-container">
        <label htmlFor="sort">Sort by: </label>
        <select
          name="sort"
          id="sort"
          defaultValue={sortUtil.sort || "dcreatedAt"}
          value={sortUtil.sort}
          onChange={handleSortChange}
          className="sort-select"
          aria-label="Sort cars by different criteria"
        >
          <option value="dyear">Newest Year</option>
          <option value="ayear">Oldest Year</option>
          <option value="dcreatedAt">Recently Added</option>
          <option value="dprice">Highest Price</option>
          <option value="aprice">Lowest Price</option>
        </select>
        <span className="sort-count">{cars.length} cars found</span>
      </div>

      <StyledCarContainer>
        {cars.map((car) => (
          <CarItem
            key={car._id}
            car={car}
            onRemove={removeCar}
            onEdit={editCarHandler}
          />
        ))}
      </StyledCarContainer>
    </div>
  );
}

export default memo(Car);
