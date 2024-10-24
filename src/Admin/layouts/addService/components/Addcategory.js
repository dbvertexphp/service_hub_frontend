import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";
import FileInput from "../../components/FileInput.js";

function AddUserForm() {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceAmount, setServiceAmount] = useState("");
  const [serviceImage, setServiceImage] = useState([]); // Single image
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Add Service"
      content="Add Service Successfully"
      dateTime="0 Sec ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Service Name (max 20 characters)
    if (serviceName.trim() === "") {
      newErrors.serviceName = "Service Name is required";
    } else if (serviceName.length > 20) {
      newErrors.serviceName = "Service Name cannot exceed 20 characters";
    }

    // Validate Service Description (max 50 characters)
    if (serviceDescription.trim() === "") {
      newErrors.serviceDescription = "Service Description is required";
    } else if (serviceDescription.length > 50) {
      newErrors.serviceDescription = "Service Description cannot exceed 50 characters";
    }

    // Validate Service Amount (must be a number between 1 and 5000)
    if (serviceAmount.trim() === "") {
      newErrors.serviceAmount = "Service Amount is required";
    } else if (!/^\d+$/.test(serviceAmount)) {
      newErrors.serviceAmount = "Service Amount must be a valid number";
    } else if (parseInt(serviceAmount) <= 0) {
      newErrors.serviceAmount = "Service Amount must be greater than 0";
    } else if (parseInt(serviceAmount) > 5000) {
      newErrors.serviceAmount = "Service Amount cannot exceed 5000";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Prevent submission if there are errors
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("service_name", serviceName);
    formData.append("service_description", serviceDescription);
    formData.append("service_amount", serviceAmount);
    if (serviceImage.length > 0) {
      serviceImage.forEach((image, index) => {
        formData.append(`service_image`, image);
      });
    }

    try {
      const response = await Api.addService(formData, token);
      if (response.errors) {
        setErrors(response.errors);
      } else if (response.message === "Service created successfully") {
        openSuccessSB();
        navigate(`/service-list`);
      } else {
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "An error occurred during submission." });
    }
  };

  const handleFileChange = (e) => {
    setServiceImage(Array.from(e.target.files));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Service Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            error={!!errors.serviceName}
            helperText={errors.serviceName}
            fullWidth
            type="text"
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Service Description"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            error={!!errors.serviceDescription}
            helperText={errors.serviceDescription}
            fullWidth
            type="text"
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Service Amount"
            value={serviceAmount}
            onChange={(e) => setServiceAmount(e.target.value)}
            error={!!errors.serviceAmount}
            helperText={errors.serviceAmount}
            fullWidth
            type="text"
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <FileInput label="Service Images" onChange={handleFileChange} />
        </div>

        <MDBox p={2} style={{ textAlign: "center", color: "white" }} lineHeight={0}>
          <Button variant="contained" color="primary" type="submit" style={{ color: "#fff" }}>
            Add Service
          </Button>
        </MDBox>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddUserForm;
