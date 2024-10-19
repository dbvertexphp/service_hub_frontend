import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "Api/Api"; // Import your API function
// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";
import MDTypography from "Admin/components/MDTypography";
import MDInput from "Admin/components/MDInput";
import MDButton from "Admin/components/MDButton";
// Authentication layout components
import BasicLayout from "Admin/layouts/authentication/components/BasicLayout";
// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import Aruyog_logo from "assets/images/ajugnu.png";
import { Translate } from "@mui/icons-material";
function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [password_error, setpassword_error] = useState("");
  const [api_error, setapi_error] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false); // Flag to track API call
  const navigate = useNavigate();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  useEffect(() => {
    // Check if the user is already authenticated. If so, redirect to the dashboard.
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated !== null) {
      // User is authenticated, redirect to the dashboard
      navigate("/dashboard");
    } else {
      navigate("/admin");
    }
  }, []); // This code runs only once on component mount

  const handleSignIn = async () => {
    if (!mobile) {
      setError("Please enter your mobile");
      setpassword_error(""); // Hide password error message
      return;
    } else if (mobile.length !== 10) {
      setError("Please enter a valid Number");
      setpassword_error(""); // Hide password error message
      return;
    }
    if (!password) {
      setpassword_error("Please enter your password.");
      setError(""); // Hide mobile error message
      return;
    }
    if (password !== "") {
      setpassword_error("");
      setError(""); // Hide mobile error message
    }
    // Check if an API call is already in progress
    if (isAPICalling) {
      return; // Prevent the second API call
    }

    try {
      setIsAPICalling(true);
      const response = await Api.login(mobile, password);
      console.log(response.user.role);
      if (response.status === true) {
        const isAdmin = response.user.role === "admin"; // Convert to boolean

        if (isAdmin) {
          localStorage.setItem("token", response.token);
          // navigate("/dashboard");
          window.location.href = "/dashboard";
        } else {
          setapi_error("You Are Not An Admin");
        }
      } else {
        setapi_error(response.message);
      }
    } catch (api_error) {
      setapi_error(api_error.message);
    } finally {
      setIsAPICalling(false);
    }
  };
  return (
    <BasicLayout image={bgImage}>
      <div
        style={{
          width: "300px",
          height: "50px",
          padding: "10px",
          position: "relative", // Establish positioning context
          margin: "0 auto 50px auto", // Center horizontally and add bottom margin
          top: "0px", // Adjust position from the top
        }}
      >
        <img
          src={Aruyog_logo}
          alt="Aruyog Logo"
          style={{
            width: "150px", // Set specific width
            height: "auto", // Maintain aspect ratio
            position: "absolute",
            top: "0%", // Adjust position
            left: "50%",
            transform: "translate(-50%, -50%)",
            objectFit: "contain",
          }}
        />
      </div>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Mobile"
                fullWidth
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              {error && (
                <MDTypography variant="caption" color="error">
                  {error}
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            {password_error && (
              <MDTypography variant="caption" color="error">
                {password_error}
              </MDTypography>
            )}
            {api_error && (
              <MDTypography variant="caption" color="error">
                {api_error}
              </MDTypography>
            )}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSignIn}>
                Sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center"></MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}
export default Basic;
