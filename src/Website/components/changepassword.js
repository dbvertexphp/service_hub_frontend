import React, { useState, useEffect } from "react";
import { WebsiteApi } from "Api/WebsiteApi";
import { Api } from "Api/Api";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import theme from "assets/theme";
import Backbutton from "./Backbutton.js";
import {
  Typography,
  Card,
  TextField,
  Stack,
  Grid,
  Button,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

const edit_profile = () => {
  const [open, setOpen] = React.useState(false);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const [newPassword, setNewPassword] = useState();
  const [newPassword_err, setNewPasswordErr] = useState("");

  const [oldPassword, setOldPassword] = useState();
  const [oldPassword_err, setOldPasswordErr] = useState("");

  const [confirmPassword, setConfirmPassword] = useState();
  const [confirmPassword_err, setConfirmPasswordErr] = useState("");

  const [passwordmatch_err, setPasswordMatchErr] = useState("");

  const [api_error, setapi_error] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);

  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const validatePassword = (newPassword, confirmPassword) => {
    let validate = true;
    let errors = {};

    if (!newPassword) {
      validate = false;
      errors.newPassword = "Please enter your newPassword.";
    } else if (newPassword.length < 6) {
      validate = false;
      errors.newPassword = "Password must be at least 6 characters long.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      validate = false;
      errors.newPassword = "Password must contain at least one special character.";
    } else if (!/[A-Z]/.test(newPassword)) {
      validate = false;
      errors.newPassword = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(newPassword)) {
      validate = false;
      errors.newPassword = "Password must contain at least one lowercase letter.";
    } else if (!/\d/.test(newPassword)) {
      validate = false;
      errors.newPassword = "Password must contain at least one digit.";
    }

    if (!confirmPassword) {
      validate = false;
      errors.confirmPassword = "Please enter your confirm password.";
    } else if (newPassword !== confirmPassword) {
      validate = false;
      errors.confirmPassword = "Passwords do not match.";
    }

    return { validate, errors };
  };
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const onSubmit = async (e) => {
    setNewPasswordErr("");
    setOldPasswordErr("");
    setConfirmPasswordErr("");

    e.preventDefault();
    let validate = true;

    if (!oldPassword) {
      validate = false;
      setOldPasswordErr("Please enter your Old Password.");
    }

    if (!newPassword) {
      validate = false;
      setNewPasswordErr("Please enter your New Password.");
    }

    if (!confirmPassword) {
      validate = false;
      setConfirmPasswordErr("Please enter your Confirm Password.");
    }
    const { validate: passwordValidate, errors } = validatePassword(newPassword, confirmPassword);

    if (!passwordValidate) {
      if (errors.newPassword) {
        validate = false;
        setNewPasswordErr(errors.newPassword);
      }
      if (errors.confirmPassword) {
        validate = false;
        setConfirmPasswordErr(errors.confirmPassword);
      }
    }

    if (validate) {
      if (isAPICalling) {
        return; // Prevent the second API call
      }
      try {
        setIsAPICalling(true);
        const response = await WebsiteApi.ChangePassword(newPassword, oldPassword);
        if (response.status === true) {
          setNewPassword("");
          setOldPassword("");
          setConfirmPassword("");
          setPasswordMatchErr("");
          setapi_error("");
          // Navigate first
          setOpenSnackbar(true);

          // Open Snackbar after successful API call with a delay
          setTimeout(() => {
            navigate("/");
          }, 1000); // Adjust the delay as needed
        } else {
          setapi_error(response.message);
        }
      } catch (api_error) {
        setapi_error(api_error.message);
      } finally {
        setIsAPICalling(false);
      }
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 20;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        paddingTop: "20px",
        width: 250,
      },
    },
  };

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleToggleOldPasswordVisibility = () => {
    setShowOldPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <Card sx={{ marginBottom: "5vh" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={8} className="" sx={{ alignSelf: "center" }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
              <Typography className="Edit_profile_heading">Reset Password</Typography>
            </Stack>
            <form onSubmit={onSubmit} method="post" noValidate>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Old Password"
                  id="New_Password"
                  value={oldPassword || ""}
                  type={showOldPassword ? "text" : "password"}
                  className="w-100"
                  onChange={(e) => setOldPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleToggleOldPasswordVisibility} edge="end">
                        {showOldPassword ? (
                          <VisibilityOffIcon style={{ color: "green" }} />
                        ) : (
                          <VisibilityIcon style={{ color: "green" }} />
                        )}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    "& label.Mui-focused": {
                      color: "#356c42",
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#356c42",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                      "& fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                    },
                  }}
                />
              </Stack>
              <p className="input_err">{oldPassword_err}</p>

              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="New Password"
                  id="New_Password"
                  value={newPassword || ""}
                  type={showNewPassword ? "text" : "password"}
                  className="w-100"
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleToggleNewPasswordVisibility} edge="end">
                        {showNewPassword ? (
                          <VisibilityOffIcon style={{ color: "green" }} />
                        ) : (
                          <VisibilityIcon style={{ color: "green" }} />
                        )}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    "& label.Mui-focused": {
                      color: "#356c42",
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#356c42",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                      "& fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                    },
                  }}
                />
              </Stack>
              <p className="input_err">{newPassword_err}</p>

              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  id="Confirm_Password"
                  value={confirmPassword || ""}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-100"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">
                        {showConfirmPassword ? (
                          <VisibilityOffIcon style={{ color: "green" }} />
                        ) : (
                          <VisibilityIcon style={{ color: "green" }} />
                        )}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    "& label.Mui-focused": {
                      color: "#356c42",
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "#356c42",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                      "& fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                    },
                  }}
                />
              </Stack>
              <p className="input_err">{confirmPassword_err}</p>
              <p className="input_err">{passwordmatch_err}</p>
              <p className="input_err">{api_error}</p>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignSelf: "center",
                  marginTop: "3vh",
                  marginBottom: "3vh",
                  justifyContent: "center",
                }}
              >
                <Button type="submit" className="Edit_Profile_Buttton">
                  Submit
                </Button>
              </Stack>
            </form>
          </Grid>
        </Grid>
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            Successfully Updating The Password!
          </MuiAlert>
        </Snackbar>
      </Card>
    </div>
  );
};

export default edit_profile;
