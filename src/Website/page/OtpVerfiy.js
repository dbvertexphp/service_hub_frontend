import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { Card, TextField, Checkbox, Snackbar } from "@mui/material";
import { WebsiteApi } from "Api/WebsiteApi.js";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Backbutton from "../components/Backbutton.js";
import { setUserData } from "Actions/AuthActions";
import MuiAlert from "@mui/material/Alert";

const OtpVerfiy = (props) => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const reduxmobileNumber = useSelector((state) => state.auth.mobileNumber);
  const [otp, setOTP] = useState("");
  const [mobile_err, setOTPErr] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);
  const [RememberMe, setRememberMe] = useState(false);
  const [suceesFull, setSuceesFull] = React.useState(false);
  const [suceesFullMessage, setSuceesFullMessage] = React.useState("");
  const [resendMessage, setResendMessage] = useState(
    "We sent verification code to your registered mobile number"
  );
  const location = useLocation();
  const pathname = location.pathname;

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const validateOTP = (otp) => /^\d{4}$/.test(otp);

  const handleMobileChange = (e) => {
    const maxLength = 4;
    const inputValue = e.target.value.slice(0, maxLength);
    setOTP(inputValue);
  };

  const isAuthenticated = !!Cookies.get("Websitetoken");

  const handleResendClick = async () => {
    try {
      const response = await WebsiteApi.resendOTP(reduxmobileNumber);
      if (response.success) {
        setResendMessage("We Resent verification code to your registered mobile number");
        setSuceesFull(true);
        setSuceesFullMessage("We resend the verification code to your registered mobile number");
      } else {
        setSuceesFull(true);
        setSuceesFullMessage("We resend the verification code to your registered mobile number");
        setResendMessage("We Resent verification code to your registered mobile number");
      }
    } catch (error) {
      console.error("Error while resending OTP:", error);
    }
  };

  const onSubmit = async (e) => {
    setOTPErr("");
    e.preventDefault();

    let validate = true;

    if (!validateOTP(otp)) {
      validate = false;
      setOTPErr("Please enter OTP.");
    }

    if (validate) {
      if (isAPICalling) {
        return; // Prevent the second API call
      }
      try {
        setIsAPICalling(true);
        const response = await WebsiteApi.verifyOtp(reduxmobileNumber, otp);
        if (response.status === true) {
          window.location.href = "/";
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

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuceesFull(false);
  };

  useEffect(() => {
    setSuceesFull(true);
    setSuceesFullMessage("OTP has been sent to your mobile number");
  }, []);

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
                  <div style={{ textAlign: "center" }}>
                    <p className="resend-button" onClick={handleResendClick}>
                      Resend
                    </p>
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
        <Snackbar open={suceesFull} autoHideDuration={4000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
            {suceesFullMessage}
          </Alert>
        </Snackbar>
      </section>
    </div>
  );
};

export default OtpVerfiy;
