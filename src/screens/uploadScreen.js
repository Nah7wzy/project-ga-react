import React, { useState } from "react";
import { multipleFilesUpload } from "../data/api";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Swal from "sweetalert2";

const FileUploadScreen = () => {
  const [multipleFiles, setMultipleFiles] = useState("");
  const [carId, setCarId] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [transmission, setTransmission] = useState("Manual");
  const [type, setType] = useState("All");
  const [loan, setLoan] = useState("");
  const [contact, setContact] = useState("0911518970");
  const [condition, setCondition] = useState("");
  const [comment, setComment] = useState("");
  const [mileage, setMileage] = useState("");
  const [multipleProgress, setMultipleProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const MultipleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Files selected:", files.length);
      setMultipleFiles(files);
    } else {
      console.log("No files selected");
      setMultipleFiles("");
    }
    setMultipleProgress(0);
  };

  const mulitpleFileOptions = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      const percentage = Math.floor(((loaded / 1000) * 100) / (total / 1000));
      setMultipleProgress(percentage);
    },
  };

  const resetForm = () => {
    setCarId("");
    setMake("");
    setModel("");
    setYear("");
    setPrice("");
    setTransmission("Manual");
    setType("All");
    setLoan("");
    setContact("0911518970");
    setCondition("");
    setComment("");
    setMileage("");
    setMultipleFiles("");
    setMultipleProgress(0);

    // Reset form input fields
    document.querySelectorAll('input[type="text"]').forEach((input) => {
      input.value = "";
    });
    document.querySelector('input[type="file"]').value = "";
  };

  const UploadMultipleFiles = async () => {
    if (!multipleFiles || multipleFiles.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please select at least one image file",
        icon: "error",
      });
      return;
    }

    if (!make || !model || !year || !price) {
      Swal.fire({
        title: "Missing Information",
        text: "Please fill in required fields: Make, Model, Year, and Price",
        icon: "warning",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("carId", carId || Date.now()); // Use timestamp as default ID if not provided
    formData.append("make", make);
    formData.append("year", year);
    formData.append("price", price);
    formData.append("transmission", transmission);
    formData.append("type", type);
    formData.append("mileage", mileage || "0");
    formData.append("condition", condition || "Good");
    formData.append("comment", comment || "");
    formData.append("model", model);
    formData.append("loan", loan || "0");
    formData.append("contact", contact);

    console.log("Files to upload:", multipleFiles.length);
    for (let i = 0; i < multipleFiles.length; i++) {
      formData.append("files", multipleFiles[i]);
    }

    try {
      // Debug output showing FormData
      console.log("FormData created with files:", multipleFiles.length);

      const response = await multipleFilesUpload(formData, mulitpleFileOptions);

      if (response && response.success) {
        Swal.fire({
          title: "Success",
          text: "Car uploaded successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        resetForm();
      } else {
        throw new Error(response?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        title: "Upload Failed",
        text:
          error.message ||
          "There was an error uploading the car. Please try again.",
        icon: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="row mt-3">
      <div className="col-12">
        <div className="row">
          <div className="col-6">
            <label>CarID</label>
            <input
              type="text"
              onChange={(e) => setCarId(e.target.value)}
              placeholder="-"
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label>Make</label>
            <input
              type="text"
              onChange={(e) => setMake(e.target.value)}
              placeholder="-"
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label>Model</label>
            <input
              type="text"
              onChange={(e) => setModel(e.target.value)}
              placeholder="-"
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label>Year</label>
            <input
              type="text"
              onChange={(e) => setYear(e.target.value)}
              placeholder="-"
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label>Price</label>
            <input
              type="text"
              onChange={(e) => setPrice(e.target.value)}
              placeholder="-"
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label>Loan</label>
            <input
              type="text"
              onChange={(e) => setLoan(e.target.value)}
              placeholder="-"
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label>Transmission</label>
            <select
              onChange={(e) => setTransmission(e.target.value)}
              className="form-control"
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
          <div className="col-6">
            <label>Type</label>
            <select
              onChange={(e) => setType(e.target.value)}
              className="form-control"
            >
              <option value="All">All</option>
              <option value="Sedan">Sedan</option>
              <option value="Compact">Compact</option>
              <option value="Minivan">MiniVan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
          <div className="col-6">
            <label>Mileage</label>
            <input
              type="text"
              onChange={(e) => setMileage(e.target.value)}
              placeholder="-"
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label>Condition</label>
            <input
              type="text"
              onChange={(e) => setCondition(e.target.value)}
              placeholder="-"
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label>Comment</label>
            <input
              type="text"
              onChange={(e) => setComment(e.target.value)}
              placeholder="-"
              className="form-control"
            />
          </div>
          <div className="col-6">
            <label>Contact</label>
            <select
              onChange={(e) => setContact(e.target.value)}
              className="form-control"
            >
              <option value="0911518970">0911518970</option>
              <option value="0911451031">0911451031</option>
              <option value="0911207702">0911207702</option>
            </select>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label>Select Multiple Files</label>
              <input
                type="file"
                onChange={(e) => MultipleFileChange(e)}
                className="form-control"
                multiple
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-10">
            <button
              type="button"
              onClick={() => UploadMultipleFiles()}
              className="btn btn-primary"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <div className="col-2">
            <CircularProgressbar
              value={multipleProgress}
              text={`${multipleProgress}%`}
              styles={buildStyles({
                rotation: 0.25,
                strokeLinecap: "butt",
                textSize: "16px",
                pathTransitionDuration: 0.5,
                pathColor: `rgba(255, 136, 136, ${multipleProgress / 100})`,
                textColor: "#f88",
                trailColor: "#d6d6d6",
                backgroundColor: "#3e98c7",
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadScreen;
