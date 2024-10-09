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
  category_name: PropTypes.string.isRequired,
  category_id: PropTypes.string.isRequired,
  category_image: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function FormDialog({ category_name, category_id, category_image, onClose }) {
  const [open, setOpen] = React.useState(true);
  const [newCategoryName, setNewCategoryName] = React.useState(category_name);
  const [newCategoryImage, setNewCategoryImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(`${base_url}/${category_image}`);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  async function UpdateCategory() {
    try {
      const formData = new FormData();
      formData.append("category_id", category_id);
      formData.append("new_category_name", newCategoryName);
      if (newCategoryImage) {
        formData.append("category_image", newCategoryImage);
      }
      const response = await Api.UpdateCategory(formData);
      if (response && response.status) {
        handleClose();
      } else {
        console.error("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  }

  const handleCategoryNameChange = (event) => {
    setNewCategoryName(event.target.value);
  };

  const handleCategoryImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewCategoryImage(file);
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
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="Category"
            label="Category"
            type="text"
            value={newCategoryName}
            onChange={handleCategoryNameChange}
            fullWidth
            variant="standard"
            sx={{ width: "500px", marginBottom: "20px" }}
          />
          <TextField
            margin="dense"
            id="image"
            name="CategoryImage"
            type="file"
            fullWidth
            onChange={handleCategoryImageChange}
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
          <Button onClick={UpdateCategory}>Edit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
