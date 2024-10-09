import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import MDBox from "Admin/components/MDBox";
import MDTypography from "Admin/components/MDTypography";

import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import ProfileInfoCard from "Admin/examples/Cards/InfoCards/ProfileInfoCard";
import DefaultProjectCard from "Admin/examples/Cards/ProjectCards/DefaultProjectCard";

import Header from "Admin/layouts/profile/components/Header";
import { Api } from "Api/Api";

import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function Overview() {
  const [userData, setUserData] = useState({ name: "", email: "", category: "" });

  const navigate = useNavigate();
  useEffect(() => {
    // Check if the user is already authenticated. If so, redirect to the dashboard.
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated !== null) {
      // User is authenticated, redirect to the dashboard
      navigate("/profile");
    } else {
      navigate("/admin");
    }
  }, []); // This code runs only once on component mount

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const response = await Api.getUser(token);

        if (response.user) {
          const { first_name, email } = response.user;
          setUserData({ first_name, email });
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData(); // Call the async function immediately
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header name={userData.first_name} category="Admin" />
      <MDBox mt={5} mb={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              title="Profile Information"
              info={{
                Name: userData.first_name,
                Category: "Admin",
                Email: userData.email,
              }}
              action={{ route: "", tooltip: "Edit Profile" }}
              shadow={false}
            />
            <Divider orientation="vertical" sx={{ mx: 0 }} />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
