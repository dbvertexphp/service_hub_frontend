import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Card, TextField, Checkbox } from "@mui/material";
import { WebsiteApi } from "Api/WebsiteApi.js";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Backbutton from "../components/Backbutton.js";
import { setForgetseccfullymessage } from "Actions/AuthActions";

const OtpVerfiy = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxmobileNumber = useSelector((state) => state.auth.mobileNumber);
  const [otp, setOTP] = useState("");
  const [mobile_err, setOTPErr] = useState("");

  const [password, setPassword] = useState("");
  const [password_err, setPasswordErr] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [confirmpassword_err, setConfirmPasswordErr] = useState("");
  const [passwordmatch_err, setPasswordMatchErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isAPICalling, setIsAPICalling] = useState(false);
  const [RememberMe, setRememberMe] = useState(false);
  const [resendMessage, setResendMessage] = useState(
    "We sent verification code to your registered mobile number"
  );

  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const validateOTP = (otp) => /^\d{4}$/.test(otp);

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

  const handleMobileChange = (e) => {
    const maxLength = 4;
    const inputValue = e.target.value.slice(0, maxLength);
    setOTP(inputValue);
  };

  const remberChange = () => {
    setRememberMe(!RememberMe);
  };

  const isAuthenticated = !!Cookies.get("Websitetoken");

  if (isAuthenticated && path === "/website-otp-verfiy") {
    // If authenticated and trying to access OTP verification, redirect to dashboard
    return <navigate to="/" />;
  }

  const onSubmit = async (e) => {
    setOTPErr("");
    setPasswordErr("");
    setConfirmPasswordErr("");
    setPasswordMatchErr("");
    e.preventDefault();

    let validate = true;

    if (!validateOTP(otp)) {
      validate = false;
      setOTPErr("Please enter OTP.");
    }
    if (!password) {
      validate = false;
      setPasswordErr("Please enter your password.");
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
        const response = await WebsiteApi.forgetPassword(password, reduxmobileNumber, otp);
        if (response.status === true) {
          dispatch(setForgetseccfullymessage());
          // navigate("/website-login");
          const res = await WebsiteApi.login(reduxmobileNumber, password);
          if (res.status === true) {
            navigate("/");
          }
        } else {
          setOTPErr(response.message);
        }
      } catch (api_error) {
        setOTPErr(api_error.message);
      } finally {
        setIsAPICalling(false);
      }
    }
  };

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
                  marginBottom: 0,
                  paddingBottom: 0,
                  alignSelf: "flex-end",
                }}
              >
                <img src="/assets/images/otp_verfiy.png" alt="Auth_Logo" className="img-fluid" />
              </div>
              <div className="col-md-6 col-lg-6 col-xl-6  col-xxl-4 px-5">
                <div className="auth_logo">
                  <img src="/assets/images/auth_logo.png" alt="Auth_Logo" className="img-fluid" />
                </div>
                <div className="auth_otp_verfiy_hending mt-4">
                  <p>{resendMessage}</p>
                  <p className="auth_otp_verfiy_hending_number">+91 {reduxmobileNumber}</p>
                </div>
                <form onSubmit={onSubmit} method="post" noValidate>
                  <p className="auth_text_filed_lebel_css mt-3">Enter OTP</p>
                  <div className="form-group">
                    <TextField
                      id="Otp"
                      value={otp}
                      label=""
                      type="number"
                      autoComplete="off"
                      autoFocus={true}
                      variant="standard"
                      className="w-100 auth_text_filed_css"
                      onInput={handleMobileChange}
                    />
                    <span className="input_err">{mobile_err}</span>
                  </div>
                  <p className="auth_text_filed_lebel_css mt-4 mb-0 mb-0">New Password</p>
                  <div className="form-group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      autoComplete="off"
                      autoFocus={true}
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
                  <p className="auth_text_filed_lebel_css mt-4 mb-0 mb-0">Confirm New Password</p>
                  <div className="form-group">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmpassword}
                      autoComplete="off"
                      autoFocus={true}
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
                  <div style={{ textAlign: "center" }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      className="mt-2"
                      style={{ justifyContent: "center" }}
                    >
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
                          marginTop: "15px",
                        }}
                      >
                        Submit
                      </Button>
                    </Stack>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OtpVerfiy;
