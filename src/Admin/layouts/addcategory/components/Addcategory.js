import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import { FormControl, InputLabel, Select } from "@mui/material";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";

function AddUserForm() {
  const [category_name, setProfileName] = useState("");
  const [category_image, setCategoryImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Add Category"
      content="Add Category Successfully"
      dateTime="0 Sec ago"
      open={successSB}
      onClose={() => {
        navigate("/category-list"); // Replace "/tables" with your actual route
      }}
      close={() => {
        navigate("/category-list"); // Replace "/tables" with your actual route
      }}
      bgWhite
    />
  );

  if (successSB) {
    setTimeout(() => {
      setSuccessSB(false);
      navigate("/category-list"); // Replace "/tables" with your actual route
    }, 2000); // 2000 milliseconds = 2 seconds
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate fields
    const newErrors = {};

    if (category_name.trim() === "") {
      newErrors.category_name = "Category Name is required";
    }
    setErrors(newErrors); // Reset errors

    if (Object.keys(newErrors).length === 0) {
      // Prepare form data
      const formData = new FormData();
      formData.append("category_name", category_name);
      if (category_image) {
        formData.append("category_image", category_image);
      }

      // Call the addCategory API here
      const token = localStorage.getItem("token");
      Api.addCategory(formData, token)
        .then((response) => {
          if (response.errors) {
            setErrors(response.errors);
          }
          if (response.status === true) {
            // Use strict equality (===)
            openSuccessSB();
          } else {
            setErrors(response.errors);
          }
        })
        .catch((error) => {
          // Handle the error appropriately
          setErrors(error);
        });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Category Name"
            value={category_name}
            onChange={(e) => setProfileName(e.target.value)}
            fullWidth
            type="text"
          />
          {errors.category_name && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.category_name}</div>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <TextField fullWidth type="file" onChange={(e) => setCategoryImage(e.target.files[0])} />
        </div>

        <MDBox p={2} style={{ textAlign: "center", color: "white" }} lineHeight={0}>
          <Button variant="contained" color="primary" type="submit">
            Add Category
          </Button>
        </MDBox>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddUserForm;
