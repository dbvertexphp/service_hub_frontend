import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";

const base_url = process.env.REACT_APP_BASE_URL;

FormDialog.propTypes = {
  serviceName: PropTypes.string.isRequired,
  serviceId: PropTypes.string.isRequired,
  serviceImage: PropTypes.array.isRequired,
  serviceDesc: PropTypes.string.isRequired,
  serviceAmount: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function FormDialog({
  serviceName,
  serviceId,
  serviceImage,
  serviceDesc,
  serviceAmount,
  onClose,
}) {
  const [open, setOpen] = React.useState(true);
  const [newServiceName, setNewServiceName] = React.useState(serviceName);
  const [newServiceDesc, setNewServiceDesc] = React.useState(serviceDesc);
  const [newServiceAmount, setNewServiceAmount] = React.useState(serviceAmount);
  const [newServiceImages, setNewServiceImages] = React.useState([]); // Handle new images
  const [imagePreviews, setImagePreviews] = React.useState(
    serviceImage.map((img) => `${base_url}/${img}`)
  ); // Array of image previews
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  async function UpdateService() {
    try {
      const formData = new FormData();
      formData.append("service_id", serviceId);
      formData.append("service_name", newServiceName);
      formData.append("service_description", newServiceDesc);
      formData.append("service_amount", newServiceAmount);

      // Append new service images if they exist
      newServiceImages.forEach((image, index) => {
        formData.append(`service_images`, image);
      });

      const response = await Api.UpdateService(formData);
      if (response && response.message == "Service updated successfully") {
        handleClose();
        navigate("/service-list");
      } else {
        console.error("Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
    }
  }

  const handleServiceNameChange = (event) => {
    setNewServiceName(event.target.value);
  };
  const handleServiceDescChange = (event) => {
    setNewServiceDesc(event.target.value);
  };
  const handleServiceAmountChange = (event) => {
    setNewServiceAmount(event.target.value);
  };

  const handleServiceImageChange = (event) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setNewServiceImages(fileArray); // Store the selected images

      // Generate image previews
      const previews = fileArray.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
      });

      // Wait for all previews to load
      Promise.all(previews).then(setImagePreviews);
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Service</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="Service"
            label="Service Name"
            type="text"
            value={newServiceName}
            onChange={handleServiceNameChange}
            fullWidth
            variant="standard"
            sx={{ width: "500px", marginBottom: "20px" }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="Service"
            label="Service Desc"
            type="text"
            value={newServiceDesc}
            onChange={handleServiceDescChange}
            fullWidth
            variant="standard"
            sx={{ width: "500px", marginBottom: "20px" }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="Service"
            label="Service Amount"
            type="text"
            value={newServiceAmount}
            onChange={handleServiceAmountChange}
            fullWidth
            variant="standard"
            sx={{ width: "500px", marginBottom: "20px" }}
          />
          <TextField
            margin="dense"
            id="image"
            name="ServiceImage"
            type="file"
            fullWidth
            inputProps={{ multiple: true }} // Allow multiple file uploads
            onChange={handleServiceImageChange}
            variant="standard"
            sx={{ width: "500px", marginBottom: "20px" }}
          />

          {/* Display all existing and new images */}
          <div>
            {imagePreviews &&
              imagePreviews.length > 0 &&
              imagePreviews.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Service Image Preview ${index}`}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                />
              ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={UpdateService}>Edit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
