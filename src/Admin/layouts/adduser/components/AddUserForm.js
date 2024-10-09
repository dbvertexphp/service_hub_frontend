import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import { FormControl, InputLabel, Select } from "@mui/material";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";

function AddUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [password, setPassword] = useState(""); // Validation errors state
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [successSB, setSuccessSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Add User"
      content="Add User Successfully"
      dateTime="0 Sec ago"
      open={successSB}
      onClose={() => {
        navigate("/tables"); // Replace "/tables" with your actual route
      }}
      close={() => {
        navigate("/tables"); // Replace "/tables" with your actual route
      }}
      bgWhite
    />
  );
  if (successSB) {
    setTimeout(() => {
      setSuccessSB(false);
      navigate("/tables"); // Replace "/tables" with your actual route
    }, 2000); // 2000 milliseconds = 2 seconds
  }

  const validateEmail = (email) => {
    // Email validation using a simple regex pattern
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate fields
    const newErrors = {};

    if (name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }
    if (category.trim() === "") {
      newErrors.category = "Category is required";
    }
    if (password.trim() === "") {
      newErrors.password = "Password is required";
    }

    // Check other fields and add errors as needed
    setErrors(newErrors); // Reset errors

    if (Object.keys(newErrors).length === 0) {
      // Call the addUser API here
      const token = localStorage.getItem("token");
      Api.addUser(name, email, category, password, token)
        .then((response) => {
          if (response.errors) {
            if (response.errors.email) {
              newErrors.email = response.errors.email[0];
            }
            setErrors(newErrors);
          }
          if (response.status == true) {
            openSuccessSB();
            // Set the successSnackbar in your component state
          } else {
            setErrors(response.errors);
          }
        })
        .catch((response) => {
          // Handle the error appropriately
          setErrors(response.errors);
        });
    } else {
      // If there are errors, update the errors state to display them to the user
      // setErrors(newErrors);
    }
  };

  return (
    <div className="form-container">
      {" "}
      {/* Use the form-container class */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          {errors.name && <div style={{ color: "red", fontSize: "15px" }}>{errors.name}</div>}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          {errors.email && <div style={{ color: "red", fontSize: "15px" }}>{errors.email}</div>}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <FormControl fullWidth>
            <InputLabel label="">Category</InputLabel>
            <Select
              native
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              inputProps={{
                name: "category",
                id: "category",
              }}
            >
              <option value=""></option>
              <option value="Bidder">Bidder</option>
              <option value="Developers">Developers</option>
              <option value="Main Admin">Main Admin</option>
            </Select>
          </FormControl>
          {errors.category && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.category}</div>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          {errors.password && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.password}</div>
          )}
        </div>

        <MDBox p={2} style={{ textAlign: "center", color: "white" }} lineHeight={0}>
          <Button variant="contained" color="primary" type="submit">
            Add User
          </Button>
        </MDBox>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddUserForm;
