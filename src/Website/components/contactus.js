import React, { useState, useEffect } from "react";
import { WebsiteApi } from "Api/WebsiteApi";
import { useForm } from "react-hook-form";
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

  const navigate = useNavigate();

  const [name, setFirstName] = useState();
  const [name_err, setFirstNameErr] = useState("");

  const [mobile_number, setMobile] = useState("");
  const [mobile_number_err, setMobileErr] = useState("");

  const [email_id, setEmail] = useState("");
  const [email_id_err, setEmailErr] = useState("");

  const [message, setMessage] = useState("");
  const [message_err, setMessageErr] = useState("");

  const [api_error, setapi_error] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);

  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const validateEmail = (email_id) => {
    // Simple email_id validation
    return /\S+@\S+\.\S+/.test(email_id);
  };

  const onSubmit = async (e) => {
    setMobileErr("");
    setEmailErr("");
    setFirstNameErr("");
    setMessageErr("");
    e.preventDefault();
    let validate = true;

    if (!name) {
      validate = false;
      setFirstNameErr("Please enter your First Name.");
    }

    if (!validateEmail(email_id)) {
      validate = false;
      setEmailErr("Please enter a valid email Id address.");
    }

    if (!/^[0-9]{10}$/.test(mobile_number)) {
      validate = false;
      setMobileErr("Please enter a valid mobile number.");
    }
    if (!message) {
      validate = false;
      setMessageErr("Please enter your Message.");
    }
    if (validate) {
      if (isAPICalling) {
        return; // Prevent the second API call
      }
      try {
        setIsAPICalling(true);
        const response = await WebsiteApi.contactUs(name, email_id, mobile_number, message);
        if (response.status === true) {
          setFirstName("");
          setMobile("");
          setEmail("");
          setMessage("");
          setOpen(true);
          navigate("/");
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

  return (
    <div>
      <Card sx={{ marginBottom: "5vh" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={8} className="" sx={{ alignSelf: "center" }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
              <Typography className="Edit_profile_heading">Contact Us</Typography>
            </Stack>
            <form onSubmit={onSubmit} method="post" noValidate>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="First Name"
                  id="name"
                  value={name || ""}
                  type="text"
                  className="w-100"
                  onChange={(e) => setFirstName(e.target.value)}
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
              <p className="input_err">{name_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  id="Mobile_Number"
                  value={mobile_number}
                  type="number" // Change type to "tel" for mobile_number number input
                  className="w-100"
                  onChange={(e) => setMobile(e.target.value)}
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
              <p className="input_err">{mobile_number_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Email"
                  id="Email"
                  value={email_id}
                  type="text" // Change type to "tel" for mobile_number number input
                  className="w-100"
                  onChange={(e) => setEmail(e.target.value)}
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
              <p className="input_err">{email_id_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <BaseTextareaAutosize
                  Textarea={<OutlinedInput label="Message" />}
                  placeholder="Message"
                  fullWidth
                  label="fullWidth"
                  id="fullWidth"
                  minRows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  className="w-100 rounded border-success Abount_us_filed"
                  sx={{
                    border: "1px solid gray",
                    borderRadius: "10px",
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
                  }}
                />
              </Stack>
              <p className="input_err">{message_err}</p>
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
        <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
            Contact Us Successfully Update!
          </Alert>
        </Snackbar>
      </Card>
    </div>
  );
};

export default edit_profile;
