import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import { FormControl, InputLabel, Select } from "@mui/material";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";

function AddUserForm() {
  const [profile_name, setProfileName] = useState(""); // Use setProfileName for the state
  const [review, setReview] = useState(""); // Use setReview for the state
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Add Profile"
      content="Add Profile Successfully"
      dateTime="0 Sec ago"
      open={successSB}
      onClose={() => {
        navigate("/profile-list"); // Replace "/tables" with your actual route
      }}
      close={() => {
        navigate("/profile-list"); // Replace "/tables" with your actual route
      }}
      bgWhite
    />
  );

  if (successSB) {
    setTimeout(() => {
      setSuccessSB(false);
      navigate("/profile-list"); // Replace "/tables" with your actual route
    }, 2000); // 2000 milliseconds = 2 seconds
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate fields
    const newErrors = {};

    if (profile_name.trim() === "") {
      newErrors.profile_name = "Profile Name is required";
    }
    if (review.trim() === "") {
      newErrors.review = "Review is required"; // Use "review" instead of "Review"
    }

    setErrors(newErrors); // Reset errors

    if (Object.keys(newErrors).length === 0) {
      // Call the addProfile API here
      const token = localStorage.getItem("token");
      Api.addProfile(profile_name, review, token) // Use "review" instead of "Review"
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
            label="Profile Name"
            value={profile_name}
            onChange={(e) => setProfileName(e.target.value)}
            fullWidth
          />
          {errors.profile_name && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.profile_name}</div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Review"
            type="number"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            fullWidth
          />
          {errors.review && <div style={{ color: "red", fontSize: "15px" }}>{errors.review}</div>}
        </div>

        <MDBox p={2} style={{ textAlign: "center", color: "white" }} lineHeight={0}>
          <Button variant="contained" color="primary" type="submit">
            Add Profile
          </Button>
        </MDBox>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddUserForm;
