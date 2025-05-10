import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 80%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
`;

const CancelButton = styled(Button)`
  background-color: #f1f1f1;
  color: #333;
  &:hover {
    background-color: #e1e1e1;
  }
`;

const SaveButton = styled(Button)`
  background-color: #4caf50;
  color: white;
  &:hover {
    background-color: #45a049;
  }
`;

const EditCarModal = ({ car, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    transmission: "Manual",
    type: "All",
    mileage: "",
    condition: "",
    comment: "",
    loan: "",
    contact: "0911518970",
  });

  useEffect(() => {
    // Initialize form with car data
    if (car) {
      setFormData({
        make: car.make || "",
        model: car.model || "",
        year: car.year || "",
        price: car.price || "",
        transmission: car.transmission || "Manual",
        type: car.type || "All",
        mileage: car.mileage || "",
        condition: car.condition || "",
        comment: car.comment || "",
        loan: car.loan || "",
        contact: car.contact || "0911518970",
      });
    }

    // Add body class to prevent scrolling
    document.body.style.overflow = "hidden";

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.make ||
      !formData.model ||
      !formData.year ||
      !formData.price
    ) {
      Swal.fire({
        title: "Missing Information",
        text: "Please fill in required fields: Make, Model, Year, and Price",
        icon: "warning",
      });
      return;
    }

    onSubmit(formData);
  };

  const handleOverlayClick = useCallback(
    (e) => {
      // Close modal only if the overlay itself was clicked
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Add event listener for escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  const modalContent = (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Edit Car Details</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <Label>Make*</Label>
              <Input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Model*</Label>
              <Input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Year*</Label>
              <Input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Price*</Label>
              <Input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Transmission</Label>
              <Select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Type</Label>
              <Select name="type" value={formData.type} onChange={handleChange}>
                <option value="All">All</option>
                <option value="Sedan">Sedan</option>
                <option value="Compact">Compact</option>
                <option value="Minivan">MiniVan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Mileage</Label>
              <Input
                type="text"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Loan</Label>
              <Input
                type="text"
                name="loan"
                value={formData.loan}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Condition</Label>
              <Input
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Contact</Label>
              <Select
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              >
                <option value="0911518970">0911518970</option>
                <option value="0911451031">0911451031</option>
                <option value="0911207702">0911207702</option>
              </Select>
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label>Comment</Label>
            <Input
              type="text"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
            />
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SaveButton type="submit">Save Changes</SaveButton>
          </ButtonGroup>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );

  // Use React Portal to render the modal at the document body level
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root") || document.body
  );
};

export default EditCarModal;
