import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from "react-router-dom";
// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import ReportsBarChart from "Admin/examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "Admin/examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "Admin/examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Notification from "Website/notification/Notification";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
// Data
import reportsBarChartData from "Admin/layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "Admin/layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import { Api } from "Api/Api";
import { ImUsers } from "react-icons/im";
import { GoVideo } from "react-icons/go";
import { BsCameraReels } from "react-icons/bs";
import { BsChatLeftTextFill } from "react-icons/bs";
import { RiSuitcaseFill } from "react-icons/ri";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const navigate = useNavigate();
  const [dashboardcount, setDashboardcount] = useState("");
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

  useEffect(() => {
    async function Dashboraddata() {
      try {
        const response = await Api.getAllDashboardCount();
        if (response) {
          // Access the properties from the API response
          const { services, studentCount, booking, notifications } = response;

          // Set the data in the state
          setDashboardcount({
            services,
            studentCount,
            booking,
            notifications,
          });
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    Dashboraddata(); // Call the async function immediately
  }, []);

  return (
    <DashboardLayout>
      <Notification />
      <DashboardNavbar />
      <MDBox py={3} style={{ height: "85vh" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/tables">
                <ComplexStatisticsCard
                  color="dark"
                  icon={<ImUsers />}
                  title="User Count"
                  count={dashboardcount.studentCount}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/service-list">
                <ComplexStatisticsCard
                  icon={<ImUsers />}
                  title="Services Count"
                  count={dashboardcount.services}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/booking-list">
                <ComplexStatisticsCard
                  color="success"
                  icon={<LibraryBooksIcon />}
                  title="Booking Count"
                  count={dashboardcount.booking}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link>
                <ComplexStatisticsCard
                  color="primary"
                  icon={<BsChatLeftTextFill />}
                  title="Notifications Count"
                  count={dashboardcount.notifications}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          {/*<Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/job-list">
                <ComplexStatisticsCard
                  color="warning"
                  icon={<RiSuitcaseFill />}
                  title="Job Count"
                  count={dashboardcount.PostJob}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid> */}
          {/*<Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/dashboard">
                <ComplexStatisticsCard
                  color="success"
                  icon={<FaMoneyBill1Wave />}
                  title="Payment Collection"
                  count={dashboardcount.transactionTotalAmount}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <Link to="/dashboard">
                <ComplexStatisticsCard
                  color="dark"
                  icon={<IoNotifications />}
                  title="Notification"
                  count={dashboardcount.adminnotifications}
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </Link>
            </MDBox>
          </Grid>*/}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
