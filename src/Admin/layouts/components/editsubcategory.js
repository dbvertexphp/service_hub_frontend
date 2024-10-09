import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Api } from "Api/Api";

const base_url = process.env.REACT_APP_BASE_URL;

FormDialog.propTypes = {
  category_id: PropTypes.string.isRequired,
  subcategory_name: PropTypes.string.isRequired,
  subcategory_id: PropTypes.string.isRequired,
  subcategory_image: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function FormDialog({
  category_id,
  subcategory_name,
  subcategory_id,
  subcategory_image,
  onClose,
}) {
  const [open, setOpen] = React.useState(true);
  const [newCategoryId, setNewCategoryId] = React.useState(category_id);
  const [newSubCategoryName, setNewSubCategoryName] = React.useState(subcategory_name);
  const [newSubCategoryImage, setNewSubCategoryImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(`${base_url}/${subcategory_image}`);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  async function UpdateSubCategory() {
    try {
      const formData = new FormData();
      formData.append("category_id", newCategoryId); // Assuming you need to update category_id
      formData.append("subcategory_id", subcategory_id);
      formData.append("new_subcategory_name", newSubCategoryName);
      if (newSubCategoryImage) {
        formData.append("subcategory_image", newSubCategoryImage);
      }

      const response = await Api.UpdateSubCategory(formData);
      if (response && response.status) {
        handleClose();
      } else {
        console.error("Failed to update subcategory");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
    }
  }

  const handleSubCategoryNameChange = (event) => {
    setNewSubCategoryName(event.target.value);
  };
  const handleCategoryIdChange = (event) => {
    setNewCategoryId(event.target.value);
  };

  const handleSubCategoryImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewSubCategoryImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result);
      };
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Sub Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="Sub Category"
            label="Sub Category"
            type="text"
            value={newSubCategoryName}
            onChange={handleSubCategoryNameChange}
            fullWidth
            variant="standard"
            sx={{ width: "500px", marginBottom: "20px" }}
          />
          <input
            id="name"
            name="Sub Category"
            label="Sub Category"
            type="hidden"
            onChange={handleCategoryIdChange}
            value={newCategoryId}
          />
          <TextField
            margin="dense"
            id="image"
            name="CategoryImage"
            type="file"
            fullWidth
            onChange={handleSubCategoryImageChange}
            variant="standard"
            sx={{ width: "500px", marginBottom: "20px" }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Category Image Preview"
              style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "10px" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={UpdateSubCategory}>Edit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
