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
  const [serviceImage, setServiceImage] = useState([]); // Change to hold a single image
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

    if (serviceName.trim() === "") {
      newErrors.serviceName = "serviceName is required";
    }
    if (serviceDescription.trim() === "") {
      newErrors.serviceDescription = "serviceDescription is required";
    }
    if (serviceAmount.trim() === "") {
      newErrors.serviceAmount = "serviceAmount is required";
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
      } else if (response.message == "Service created successfully") {
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
            fullWidth
            type="text"
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Service Description"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            fullWidth
            type="text"
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Service Amount"
            value={serviceAmount}
            onChange={(e) => setServiceAmount(e.target.value)}
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
