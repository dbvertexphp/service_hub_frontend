import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";

function AddUserForm() {
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerImage, setBannerImage] = useState(null); // Holds a single image
  const [errors, setErrors] = useState({});
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate bannerTitle (required and max 20 characters)
    if (bannerTitle.trim() === "") {
      newErrors.bannerTitle = "Title is required";
    } else if (bannerTitle.length > 20) {
      newErrors.bannerTitle = "Title cannot exceed 20 characters";
    }

    // Validate bannerImage (required, only image formats, and size under 5MB)
    if (!bannerImage) {
      newErrors.bannerImage = "Image is required";
    } else if (!["image/jpeg", "image/png", "image/gif"].includes(bannerImage.type)) {
      newErrors.bannerImage = "Only JPEG, PNG, or GIF formats are allowed";
    } else if (bannerImage.size > 5 * 1024 * 1024) {
      // Check for 5MB size limit
      newErrors.bannerImage = "Image size cannot exceed 5 MB";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Prevent submission if there are errors
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", bannerTitle);
    formData.append("image", bannerImage); // Append single image

    try {
      const response = await Api.addBanner(formData, token);
      if (response.errors) {
        setErrors(response.errors);
      } else if (response.success) {
        openSuccessSB();
        navigate(`/banner-list`);
      } else {
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "An error occurred during submission." });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Check if it's an image and if the size is under 5 MB
    if (file && ["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      if (file.size <= 5 * 1024 * 1024) {
        // Check file size
        setBannerImage(file);
      } else {
        setBannerImage(null);
        setErrors({ bannerImage: "Image size cannot exceed 5 MB" });
      }
    } else {
      setBannerImage(null);
      setErrors({ bannerImage: "Only JPEG, PNG, or GIF formats are allowed" });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            label="Banner Title"
            value={bannerTitle}
            onChange={(e) => setBannerTitle(e.target.value)}
            fullWidth
            type="text"
            error={Boolean(errors.bannerTitle)} // Indicate error in title
            helperText={errors.bannerTitle}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }} // Restrict to image files
            onChange={handleFileChange}
            fullWidth
            error={Boolean(errors.bannerImage)} // Indicate error in image input
            helperText={errors.bannerImage}
          />
        </div>

        <MDBox p={2} style={{ textAlign: "center", color: "white" }} lineHeight={0}>
          <Button variant="contained" color="primary" type="submit">
            Add Banner
          </Button>
        </MDBox>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddUserForm;
