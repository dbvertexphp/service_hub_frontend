import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { WebsiteApi } from "Api/WebsiteApi";
import { Grid, Stack } from "@mui/material";

FormDialog.propTypes = {
  status_open: PropTypes.bool,
  onClose: PropTypes.func,
  onSucces: PropTypes.func,
  type_id: PropTypes.string,
  report_type: PropTypes.string,
};

export default function FormDialog({ status_open, onClose, onSucces, type_id, report_type }) {
  const [open, setOpen] = useState(status_open);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);

  useEffect(() => {
    setOpen(status_open);
  }, [status_open]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleCloseSucces = () => {
    onSucces();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = "Please enter a title.";
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = "Please enter a description.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isAPICalling) {
      return;
    }

    try {
      setIsAPICalling(true);
      const description = formData.description.trim();
      const title = formData.title.trim();
      const response = await WebsiteApi.report(report_type, type_id, title, description);
      if (response.status === true) {
        setFormData({
          title: "",
          description: "",
        });
        handleClose();
        handleCloseSucces();
        setOpen(false);
      } else {
        setApiError(response.message);
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsAPICalling(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid item xs={12} className="" sx={{ alignSelf: "center" }}>
          <DialogTitle>
            <Typography sx={{ textAlign: "right", cursor: "pointer" }} onClick={handleClose}>
              <RxCross2 />
            </Typography>
            <Typography className="Edit_profile_heading" sx={{ textAlign: "center" }}>
              Report
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ visibility: "hidden" }}>
              To subscribe to this website, please enter your email address here. We w
            </DialogContentText>
            <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
              <Typography variant="body2" color="error">
                {apiError}
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Button type="submit" sx={{ cursor: "pointer" }} className="Edit_Profile_Buttton">
                Submit
              </Button>
            </Stack>
          </DialogActions>
        </Grid>
      </Grid>
    </Dialog>
  );
}
