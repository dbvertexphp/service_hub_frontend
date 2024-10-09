import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";

function AddUserForm() {
  const [subCategory_name, setSubCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [successSB, setSuccessSB] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Add Category"
      content="Add Sub Category Successfully"
      dateTime="0 Sec ago"
      open={successSB}
      onClose={() => {
        navigate("/category-list");
      }}
      close={() => {
        navigate("/category-list");
      }}
      bgWhite
    />
  );

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    try {
      const response = await Api.getAllCategory();
      if (response && Array.isArray(response)) {
        setCategories(response);
        console.log(response);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate fields
    const newErrors = {};

    if (subCategory_name.trim() === "") {
      newErrors.subCategory_name = "Sub Category Name is required";
    }
    if (selectedCategory === "") {
      newErrors.selectedCategory = "Category is required";
    }
    setErrors(newErrors); // Reset errors

    if (Object.keys(newErrors).length === 0) {
      // Call the addCategory API here
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("subcategory_name", subCategory_name);
      formData.append("categoryId", selectedCategory);
      if (imageFile) {
        formData.append("subcategory_image", imageFile);
      }
      Api.addSubCategory(formData, token)
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
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
              sx={{ height: "50px" }}
            >
              <MenuItem disabled>Select Category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
            {errors.selectedCategory && (
              <div style={{ color: "red", fontSize: "15px" }}>{errors.selectedCategory}</div>
            )}
          </FormControl>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Sub Category Name"
            value={subCategory_name}
            onChange={(e) => setSubCategoryName(e.target.value)}
            fullWidth
            type="text"
          />
          {errors.subCategory_name && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.subCategory_name}</div>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Sub Category Image"
            type="file"
            fullWidth
            inputProps={{ accept: "image/*" }}
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {errors.imageFile && (
            <div style={{ color: "red", fontSize: "15px" }}>{errors.imageFile}</div>
          )}
        </div>

        <div style={{ textAlign: "center", color: "white" }}>
          <Button variant="contained" color="primary" type="submit">
            Add Sub Category
          </Button>
        </div>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddUserForm;
