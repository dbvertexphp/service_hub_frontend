import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { Card, TextField, Checkbox } from "@mui/material";
import { WebsiteApi } from "Api/WebsiteApi.js";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Backbutton from "../components/Backbutton.js";
import { setMobileNumber } from "Actions/AuthActions";

const ForgetPassword = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [mobile_err, setMobileErr] = useState("");
  const [api_error, setapi_error] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);
  const [RememberMe, setRememberMe] = useState(false);
  const [resendMessage, setResendMessage] = useState(
    "If you forgot your password ! Please, Enter Your Mobile Number."
  );

  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const validateMobile = (mobile) => mobile.match(/^[0-9]{10}$/);

  const handleMobileChange = (e) => {
    const maxLength = 10;
    const inputValue = e.target.value.slice(0, maxLength);
    setMobile(inputValue);
  };

  const remberChange = () => {
    setRememberMe(!RememberMe);
  };

  const isAuthenticated = !!Cookies.get("Websitetoken");

  if (isAuthenticated && path === "/website-forget-password") {
    // If authenticated and trying to access Mobile verification, redirect to dashboard
    return <navigate to="/" />;
  }

  const onSubmit = async (e) => {
    setMobileErr("");
    e.preventDefault();

    let validate = true;

    if (!validateMobile(mobile)) {
      validate = false;
      setMobileErr("Please enter a valid mobile number.");
    }

    if (validate) {
      if (isAPICalling) {
        return; // Prevent the second API call
      }
      try {
        setIsAPICalling(true);
        const response = await WebsiteApi.ForgetresendOTP(mobile);
        if (response.status === true) {
          dispatch(setMobileNumber(mobile));
          navigate("/website-forget-password-otp-verfiy");
        } else {
          setMobileErr(response.message);
        }
      } catch (api_error) {
        setMobileErr(api_error.message);
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
                <div className="Forgot_Password_heading">
                  <p>Forgot Password ?</p>
                </div>
                <div className="Forgot_Password_hending_content mt-4">
                  <p>{resendMessage}</p>
                </div>
                <form onSubmit={onSubmit} method="post" noValidate>
                  <p className="auth_text_filed_lebel_css mt-3">Enter Mobile</p>
                  <div className="form-group">
                    <TextField
                      id="mobile"
                      value={mobile}
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
                        mt={3}
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
                        Recover Password
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

export default ForgetPassword;
