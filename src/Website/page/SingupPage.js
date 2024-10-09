import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Card, TextField, Checkbox } from "@mui/material";
import { WebsiteApi } from "Api/WebsiteApi.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Backbutton from "../components/Backbutton.js";
import { setMobileNumber } from "Actions/AuthActions";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const SingUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [first_name_err, setFirstNameErr] = useState("");
  const [last_name_err, setLastNameErr] = useState("");

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [mobile_err, setMobileErr] = useState("");
  const [password_err, setPasswordErr] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [confirmpassword_err, setConfirmPasswordErr] = useState("");
  const [passwordmatch_err, setPasswordMatchErr] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [username_err, setUsernameErr] = useState("");
  const [email_err, setEmailErr] = useState("");

  const [dob, setDOB] = useState("");
  const [dob_err, setDOBErr] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [api_error, setapi_error] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [spicaldaydateChange, setSpicaldayDateChange] = useState(new Date());

  //   useEffect(() => {
  //     window.scrollTo(0, 0);
  //     dispatch(setheadermenuData({ currentpath: "/signup", headerfootershow: false }));
  //     GAEvenet();

  //     let rememberMe_mobile = localStorage.getItem("rememberme_mobile");
  //     let rememberMe_password = localStorage.getItem("rememberme_password");
  //     if (rememberMe_mobile) setMobile(rememberMe_mobile);
  //     if (rememberMe_password) setPassword(rememberMe_password);
  //     if (rememberMe_mobile) setRememberMe(true);
  //   }, []);

  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

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

  const validatePassword = (password, confirmPassword) => {
    let validate = true;
    let errors = {};

    if (!password) {
      validate = false;
      errors.password = "Please enter your password.";
    } else if (password.length < 6) {
      validate = false;
      errors.password = "Password must be at least 6 characters long.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      validate = false;
      errors.password = "Password must contain at least one special character.";
    } else if (!/[A-Z]/.test(password)) {
      validate = false;
      errors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      validate = false;
      errors.password = "Password must contain at least one lowercase letter.";
    } else if (!/\d/.test(password)) {
      validate = false;
      errors.password = "Password must contain at least one digit.";
    }

    if (!confirmPassword) {
      validate = false;
      errors.confirmPassword = "Please enter your confirm password.";
    } else if (password !== confirmPassword) {
      validate = false;
      errors.confirmPassword = "Passwords do not match.";
    }

    return { validate, errors };
  };

  const onSubmit = async (e) => {
    setMobileErr("");
    setPasswordErr("");
    setEmailErr("");

    setFirstNameErr("");
    setLastNameErr("");
    setConfirmPasswordErr("");

    setUsernameErr("");
    setPasswordMatchErr("");
    setDOBErr("");

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
    if (!username) {
      validate = false;
      setUsernameErr("Please enter your Username.");
    }
    if (!validateEmail(email)) {
      validate = false;
      setEmailErr("Please enter a valid email address.");
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      validate = false;
      setMobileErr("Please enter a valid mobile number.");
    }
    if (!dob) {
      validate = false;
      setDOBErr("Please select date of birth.");
    }
    const { validate: passwordValidate, errors } = validatePassword(password, confirmpassword);

    if (!passwordValidate) {
      if (errors.password) {
        validate = false;
        setPasswordErr(errors.password);
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
        const response = await WebsiteApi.Signup(
          first_name,
          last_name,
          username,
          email,
          mobile,
          password,
          dob
        );
        if (response.status === true) {
          dispatch(setMobileNumber(mobile));
          navigate("/website-otp-verfiy");
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

    const formattedDate = `${month}/${day}/${year}`;
    setDOB(formattedDate); // Output: 03/09/2024
  }, [spicaldaydateChange]);

  return (
    <div>
      <section className="authPage_section native_background">
        <div className="back_button_css back_button_css_Form">
          <Backbutton />
        </div>
        <div className="container-fluid">
          <div className="centered-container">
            <div className="row justify-content-center" style={{ paddingBottom: 0 }}>
              <div
                className="col-md-6 col-lg-6 col-xl-6 col-xxl-4 d-sm-none d-none d-md-block"
                style={{
                  alignSelf: "center", // Align the image to the bottom
                }}
              >
                <img src="/assets/images/singup_img.png" alt="Auth_Logo" className="img-fluid" />
              </div>
              <div className="col-md-6 col-lg-6 col-xl-6  col-xxl-4 px-5">
                <p className="auth_Login_hending mt-4">Sign Up</p>
                <form onSubmit={onSubmit} method="post" noValidate>
                  <p className="auth_text_filed_lebel_css mt-4 mb-0 mb-0">First Name</p>
                  <div className="form-group">
                    <TextField
                      id="first_name"
                      value={first_name}
                      label=""
                      type="text" // Change type to "tel" for mobile number input
                      autoComplete="off"
                      onFocus={() => setCalendarOpen(false)}
                      variant="standard"
                      className="w-100 auth_text_filed_css"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <span className="input_err">{first_name_err}</span>
                  </div>
                  <p className="auth_text_filed_lebel_css mt-4 mb-0 mb-0">Last Name</p>
                  <div className="form-group">
                    <TextField
                      id="last_name"
                      value={last_name}
                      label=""
                      type="text" // Change type to "tel" for mobile number input
                      autoComplete="off"
                      onFocus={() => setCalendarOpen(false)}
                      variant="standard"
                      className="w-100 auth_text_filed_css"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <span className="input_err">{last_name_err}</span>
                  </div>
                  <p className="auth_text_filed_lebel_css mt-4 mb-0 mb-0">Username</p>
                  <div className="form-group">
                    <TextField
                      id="username"
                      value={username}
                      label=""
                      type="text" // Change type to "tel" for mobile number input
                      autoComplete="off"
                      onFocus={() => setCalendarOpen(false)}
                      variant="standard"
                      className="w-100 auth_text_filed_css"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <span className="input_err">{username_err}</span>
                  </div>
                  <p className="auth_text_filed_lebel_css mt-4 mb-0 mb-0">Email</p>
                  <div className="form-group">
                    <TextField
                      id="email"
                      type="email"
                      label=""
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      autoComplete="off"
                      variant="standard"
                      className="w-100 password_input"
                      onFocus={() => setCalendarOpen(false)}
                    />
                    <span className="input_err">{email_err}</span>
                  </div>
                  <p className="auth_text_filed_lebel_css mt-4 mb-0 mb-0">Mobile Number</p>
                  <div className="form-group">
                    <TextField
                      id="mobile"
                      value={mobile}
                      label=""
                      type="number" // Change type to "tel" for mobile number input
                      autoComplete="off"
                      onFocus={() => setCalendarOpen(false)}
                      variant="standard"
                      className="w-100 auth_text_filed_css"
                      onInput={handleMobileChange}
                    />
                    <span className="input_err">{mobile_err}</span>
                  </div>
                  <p className="auth_text_filed_lebel_css mt-4 mb-0 mb-0">DOB</p>
                  <div className="form-group">
                    <div style={{ position: "relative", width: "100%" }}>
                      <TextField
                        id="dob"
                        value={dob}
                        label=""
                        InputProps={{
                          inputProps: {
                            max: today.toISOString().split("T")[0],
                            min: maxDate,
                          },
                        }}
                        type="da" // Change type to "tel" for mobile number input
                        autoComplete="off"
                        variant="standard"
                        className="w-100 auth_text_filed_css"
                        readOnly
                        onFocus={() => setCalendarOpen(true)}
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

                    <span className="input_err">{dob_err}</span>
                  </div>
                  <p className="auth_text_filed_lebel_css mt-4 mb-0 mb-0">Password</p>
                  <div className="form-group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      autoComplete="off"
                      onFocus={() => setCalendarOpen(false)}
                      className="w-100 password_input"
                      onChange={(e) => setPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <VisibilityOff style={{ color: "green" }} />
                            ) : (
                              <Visibility style={{ color: "green" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <span className="input_err">{password_err}</span>
                  </div>
                  <p className="auth_text_filed_lebel_css mt-4 mb-0 mb-0">Confirm Password</p>
                  <div className="form-group">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmpassword}
                      autoComplete="off"
                      onFocus={() => setCalendarOpen(false)}
                      className="w-100 password_input"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            aria-label="toggle password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff style={{ color: "green" }} />
                            ) : (
                              <Visibility style={{ color: "green" }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <span className="input_err">{confirmpassword_err}</span>
                    <span className="input_err">{passwordmatch_err}</span>
                  </div>

                  <span className="input_err">{api_error}</span>
                  <Stack direction="row" spacing={2} className="mt-4">
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      style={{
                        background: "linear-gradient(0deg, #326942 0%, #326942 100%)",
                        borderRadius: 50,
                        color: "white",
                        fontSize: 16,
                        fontFamily: "Rubik",
                        fontWeight: "400",
                        wordWrap: "break-word",
                        width: "50%",
                        margin: "auto",
                      }}
                    >
                      Register
                    </Button>
                  </Stack>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingUp;
