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
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const edit_profile = () => {
  const [open, setOpen] = React.useState(false);
  const [getUserdata, setGetUserdata] = useState({});
  const [interest, setInterest] = React.useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    getUsers();
    getAllCategorys();
  }, []);

  const getUsers = async () => {
    try {
      const response = await WebsiteApi.getUsers();

      if (response && response.status && response.user) {
        setFirstName(response.user.first_name);
        setLastName(response.user.last_name);
        setMobile(response.user.mobile);
        setEmail(response.user.email);
        let [year, month, day] = response.user.dob.split("-");
        // Format the date as DD-MM-YYYY
        let formattedDOB = `${day}-${month}-${year}`;
        setDOB(formattedDOB);
        setAbout_me(response.user.about_me);
        setInterest(response.user.interest);
        setAddrees(response.user.address);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [first_name, setFirstName] = useState();
  const [last_name, setLastName] = useState("");

  const [first_name_err, setFirstNameErr] = useState("");
  const [last_name_err, setLastNameErr] = useState("");

  const [mobile, setMobile] = useState("");
  const [mobile_err, setMobileErr] = useState("");

  const [email, setEmail] = useState("");
  const [email_err, setEmailErr] = useState("");

  const [dob, setDOB] = useState("");

  const [address, setAddrees] = useState("");
  const [address_err, setAddreesErr] = useState("");

  const [about_me, setAbout_me] = useState("");

  const [api_error, setapi_error] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);

  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [spicaldaydateChange, setSpicaldayDateChange] = useState("");

  const validateMobile = (mobile) => mobile.match(/^[0-9]{10}$/);

  const handleMobileChange = (e) => {
    const maxLength = 10;
    const inputValue = e.target.value.slice(0, maxLength);
    setMobile(inputValue);
  };

  const validateEmail = (email) => {
    // Simple email validation
    return /\S+@\S+\.\S+/.test(email);
  };
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    setMobileErr("");
    setEmailErr("");
    setFirstNameErr("");
    setLastNameErr("");
    setAddreesErr("");
    e.preventDefault();
    let validate = true;

    if (!first_name) {
      validate = false;
      setFirstNameErr("Please enter your First Name.");
    }
    if (!last_name) {
      validate = false;
      setLastNameErr("Please enter your Last Name.");
    }

    if (!validateEmail(email)) {
      validate = false;
      setEmailErr("Please enter a valid email address.");
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      validate = false;
      setMobileErr("Please enter a valid mobile number.");
    }
    if (!address) {
      validate = false;
      setAddreesErr("Please Enter Your Address.");
    }
    if (validate) {
      if (isAPICalling) {
        return; // Prevent the second API call
      }
      try {
        setIsAPICalling(true);
        const response = await WebsiteApi.updateProfileData(
          interest,
          about_me,
          last_name,
          first_name,
          address,
          dob
        );
        if (response.status === true) {
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
  function getStyles(name, interest, theme) {
    return {
      fontWeight:
        interest.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const getAllCategorys = async () => {
    try {
      const response = await Api.getAllCategory();
      if (response) {
        const data = response;
        // Filter users by category and set the state for Developers and Bidder
        setCategoryData(data);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setInterest(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const today = new Date(); // Current date
  const maxDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    const dateObject = new Date(spicaldaydateChange);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const monthIndex = dateObject.getMonth();
    const monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const month = monthNames[monthIndex];
    const year = dateObject.getFullYear();

    const formattedDate = `${month}-${day}-${year}`;
    console.log(formattedDate);
    setDOB(formattedDate); // Output: 03/09/2024
  }, [spicaldaydateChange]);

  return (
    <div>
      <Card sx={{ marginBottom: "0vh", overflow: "hidden" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={8} className="" sx={{ alignSelf: "center" }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
              <Typography className="Edit_profile_heading">My Profile</Typography>
            </Stack>
            <form onSubmit={onSubmit} method="post" noValidate>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="First Name"
                  id="first_name"
                  value={first_name || ""}
                  type="text"
                  className="w-100"
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={() => setCalendarOpen(false)}
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
              <p className="input_err">{first_name_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  id="Last_Name"
                  value={last_name}
                  type="text" // Change type to "tel" for mobile number input
                  className="w-100"
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={() => setCalendarOpen(false)}
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
              <p className="input_err">{last_name_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  id="Mobile_Number"
                  value={mobile}
                  type="text" // Change type to "tel" for mobile number input
                  className="w-100"
                  onChange={(e) => setMobile(e.target.value)}
                  onFocus={() => setCalendarOpen(false)}
                  disabled
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
              <p className="input_err">{mobile_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Email"
                  id="Email"
                  value={email}
                  type="text" // Change type to "tel" for mobile number input
                  className="w-100"
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setCalendarOpen(false)}
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
              <p className="input_err">{email_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <TextField
                    fullWidth
                    type="text"
                    label="DOB"
                    id="DOB"
                    value={dob ? dob : ""}
                    readOnly
                    onFocus={() => setCalendarOpen(true)}
                    InputProps={{
                      inputProps: {
                        max: today.toISOString().split("T")[0], // To set the max date to today
                        min: maxDate, // To set the min date 100 years ago from today
                      },
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
                  {calendarOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 5px)",
                        left: 0,
                        zIndex: 999,
                      }}
                    >
                      <Calendar
                        defaultActiveStartDate={new Date()}
                        value={dob}
                        onChange={(date) => {
                          setSpicaldayDateChange(date);
                          setCalendarOpen(false);
                        }}
                        minDate={new Date(new Date().getFullYear() - 100, 0, 1)} // Minimum allowed date (100 years ago from today)
                        maxDate={new Date()} // Maximum allowed date (today)
                        formatLongDate={(locale, date) =>
                          `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
                            .getDate()
                            .toString()
                            .padStart(2, "0")}/${date.getFullYear()}`
                        }
                      />
                    </div>
                  )}
                </div>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Addrees"
                  id="Addrees"
                  value={address}
                  type="text" // Change type to "tel" for mobile number input
                  className="w-100"
                  onChange={(e) => setAddrees(e.target.value)}
                  onFocus={() => setCalendarOpen(false)}
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
              <p className="input_err">{address_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <FormControl
                  sx={{
                    m: 1,
                    width: "-webkit-fill-available",
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
                        paddingTop: "20px",
                      },
                      "& fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                        paddingTop: "20px",
                      },
                    },
                  }}
                >
                  <InputLabel id="demo-multiple-checkbox-label">Interstes</InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={interest}
                    onChange={handleChange}
                    input={<OutlinedInput label="Interests" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                    sx={{ paddingTop: "15px" }}
                  >
                    {categoryData.map((name) => (
                      <MenuItem
                        key={name._id}
                        value={name.category_name}
                        style={getStyles(name._id, name.category_name, theme)}
                      >
                        {name.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "5vh" }}>
                <BaseTextareaAutosize
                  Textarea={<OutlinedInput label="About Us" />}
                  placeholder="About Us"
                  fullWidth
                  label="fullWidth"
                  id="fullWidth"
                  minRows={3}
                  value={about_me}
                  onChange={(e) => setAbout_me(e.target.value)}
                  onFocus={() => setCalendarOpen(false)}
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
            Profile Successfully Update!
          </Alert>
        </Snackbar>
      </Card>
    </div>
  );
};

export default edit_profile;
