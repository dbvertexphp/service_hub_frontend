import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Api } from "Api/Api";
import { DatePicker } from "@mui/x-date-pickers";

const base_url = process.env.REACT_APP_BASE_URL;

FormDialog.propTypes = {
  courseId: PropTypes.string.isRequired,
  courseStartDate: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function FormDialog({ courseId, courseStartDate, onClose }) {
  const [open, setOpen] = React.useState(true);
  const [newCourseStartDate, setNewCourseStartDate] = React.useState(courseId);
  // const [newCategoryImage, setNewCategoryImage] = React.useState(null);
  // const [imagePreview, setImagePreview] = React.useState(`${base_url}/${category_image}`);
  const [selectedDate, setSelectedDate] = React.useState(new Date()); // State for selected date
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based, add 1
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  async function UpdateCategory() {
    const newErrors = {};
    try {
      if (!selectedDate) {
        console.log("select start date");
      }
      if (!newCourseStartDate) {
        console.log("select course name");
      }

      const formattedDate = formatDate(selectedDate);
      const data = {
        course_id: newCourseStartDate,
        newStartDate: formattedDate,
      };

      const response = await Api.updateCourseDates(data);
      console.log(response);
      if (response && response.status) {
        handleClose();
      } else {
        console.error("Failed to update course date");
      }
    } catch (error) {
      console.error("Error updating course date:", error);
    }
  }

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Course Date</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="Category"
            label="Category"
            type="text"
            disabled
            value={newCourseStartDate}
            fullWidth
            variant="standard"
            sx={{ width: "500px", marginBottom: "20px" }}
            hidden
          />
          <div>
            <DatePicker
              label="Start Date"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={UpdateCategory}>Edit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
