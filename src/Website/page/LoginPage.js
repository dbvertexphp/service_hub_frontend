import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";

import { Card, TextField, Checkbox } from "@mui/material";
import { WebsiteApi } from "Api/WebsiteApi.js";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Backbutton from "../components/Backbutton.js";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Loginpage = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const forgetPasswordMessage = useSelector((state) => state.auth.forgetPasswordMessage);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [mobile_err, setMobileErr] = useState("");
  const [password_err, setPasswordErr] = useState("");
  const [api_error, setapi_error] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);
  const [RememberMe, setRememberMe] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const { handleSubmit, formState } = useForm();
  const { isSubmitting } = formState;

  const validateMobile = (mobile) => mobile.match(/^[0-9]{10}$/);

  const handleMobileChange = (e) => {
    const maxLength = 10;
    const inputValue = e.target.value.slice(0, maxLength);
    setMobile(inputValue);
  };

  const remberChange = () => {
    // Your logic for handling RememberMe checkbox
    setRememberMe(!RememberMe);
  };

  const onSubmit = async (e) => {
    setMobileErr("");
    setPasswordErr("");
    e.preventDefault();

    let validate = true;

    if (!validateMobile(mobile)) {
      validate = false;
      setMobileErr("Please enter a valid 10-digit mobile number.");
    }

    if (!password) {
      validate = false;
      setPasswordErr("Please enter your password.");
    }

    if (validate) {
      var bodyFormData = new FormData();
      bodyFormData.append("mobile", mobile);
      bodyFormData.append("password", password);

      if (isAPICalling) {
        return; // Prevent the second API call
      }

      try {
        setIsAPICalling(true);
        const response = await WebsiteApi.login(mobile, password);
        if (response.status === true) {
          if (response.message == "OTP Not verified") {
            navigate("/website-otp-verfiy");
          } else {
            window.location.href = "/";
          }
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
                  alignSelf: "flex-end", // Align the image to the bottom
                }}
              >
                <img src="/assets/images/login_img.png" alt="Auth_Logo" className="img-fluid" />
              </div>
              <div className="col-md-6 col-lg-6 col-xl-6  col-xxl-4 px-5">
                <div className="auth_logo">
                  <img src="/assets/images/auth_logo.png" alt="Auth_Logo" className="img-fluid" />
                </div>
                <p className="auth_Login_hending mt-4">Sign In</p>
                {forgetPasswordMessage && (
                  <p className="auth_otp_verfiy_forget">{forgetPasswordMessage}</p>
                )}
                <form onSubmit={onSubmit} method="post" noValidate>
                  <p className="auth_text_filed_lebel_css mt-3">Mobile Number</p>
                  <div className="form-group">
                    <TextField
                      id="mobile"
                      value={mobile}
                      label=""
                      type="number" // Change type to "tel" for mobile number input
                      autoComplete="off"
                      autoFocus={true}
                      variant="standard"
                      className="w-100 auth_text_filed_css"
                      onInput={handleMobileChange}
                    />
                    <span className="input_err">{mobile_err}</span>
                  </div>
                  <p className="auth_text_filed_lebel_css mt-3">Password</p>
                  <div className="form-group">
                    <Input
                      id="password"
                      type={showConfirmPassword ? "text" : "password"}
                      label=""
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      autoComplete="off"
                      variant="standard"
                      className="w-100 password_input"
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
                    <span className="input_err">{password_err}</span>
                  </div>
                  <span className="input_err">{api_error}</span>
                  <div className="form-group mt-2">
                    <label className="auth_text_filed_lebel_css"></label>
                    <Link
                      to="/website-forget-password"
                      className="form_label_rember_forget_txt label-link float-right pt-2"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Stack direction="row" spacing={2} className="mt-2">
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      style={{
                        width: 120,
                        height: 48,
                        background: "linear-gradient(0deg, #326942 0%, #326942 100%)",
                        borderRadius: 50,
                        color: "white",
                        fontSize: 16,
                        fontFamily: "Rubik",
                        fontWeight: "400",
                        wordWrap: "break-word",
                        width: "50%",
                        margin: "auto",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      Sign in
                    </Button>
                  </Stack>
                </form>
                <div className="row dont_have_account_row">
                  <div className="col-md-12 dont_have_account_txt_div">
                    <div className="form-group dont_have_account_txt">
                      Don&apos;t have account?{" "}
                      <Link className="do_not_account_singup" to="/website-singup">
                        Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Loginpage;
