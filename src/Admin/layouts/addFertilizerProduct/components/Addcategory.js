import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import FileInput from "../../components/FileInput.js";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";

function AddUserForm() {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState(""); // Fixed the naming here
  const [serviceAmount, setServiceAmount] = useState("");
  const [serviceImage, setServiceImage] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [errors, setErrors] = useState({}); // Initializing errors
  const navigate = useNavigate();
  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Add Product"
      content="Add Product Successfully"
      dateTime="0 Sec ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  useEffect(() => {
    getAllSupplier();
  }, []);

  const getAllSupplier = async () => {
    try {
      const response = await Api.getAllSupplier();
      if (response && Array.isArray(response.Supplier)) {
        setSupplier(response.Supplier);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (serviceName.trim() === "") {
      newErrors.serviceName = "Product Name is required";
    }
    if (serviceDescription.trim() === "") {
      newErrors.serviceDescription = "Product Weight is required";
    }
    if (serviceAmount.trim() === "") {
      newErrors.serviceAmount = "Product Price is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Prevent submission if there are errors
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("service_name", serviceName);
    formData.append("service_amount", serviceAmount);
    formData.append("service_description", serviceDescription);

    if (serviceImage.length > 0) {
      serviceImage.forEach((image) => {
        formData.append("service_image", image);
      });
    }

    try {
      const response = await Api.createService(formData, token);
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
            onChange={(e) => setServiceDescription(e.target.value)} // Fixed the casing here
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
          <Button variant="contained" color="primary" type="submit">
            Add Service
          </Button>
        </MDBox>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddUserForm;
