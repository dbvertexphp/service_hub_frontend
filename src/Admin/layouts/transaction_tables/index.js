import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Pagination from "@mui/material/Pagination";
import MDBox from "Admin/components/MDBox";
import MDTypography from "Admin/components/MDTypography";
import { Api } from "Api/Api";
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import DataTable from "Admin/examples/Tables/DataTable";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import EditCourseDate from "../components/editcoursedate";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function Tables() {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModel, setShowModel] = useState(false);
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_BASE_URL;

  const fetchData = async (page) => {
    try {
      const response = await Api.getAllTransactionsInAdmin(page, "");
      console.log(response);

      if (response && Array.isArray(response.transaction)) {
        const { transaction, totalPages } = response;
        setUserData(transaction);
        setTotalPages(totalPages);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const UserAdminStatusUpdate = async (serviceId, newStatus) => {
    try {
      const response = await Api.updateServiceStatus(serviceId, newStatus);
      if (response.status) {
        setUpdateSuccess(true);
        fetchData(page);
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleChange = (serviceId, currentStatus) => {
    const updatedStatus = !currentStatus;
    UserAdminStatusUpdate(serviceId, updatedStatus);
  };
  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Function to update user status
  const updateTransactionStatus = async (transaction_id, newStatus) => {
    try {
      const response = await Api.updateTransactionStatus(transaction_id, newStatus);
      fetchData();
      setUpdateSuccess(true);
      if (response.status) {
        setUpdateSuccess(true);
        // Refresh the data after updating status
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Handle dropdown change event for status update
  const handleStatusChange = (event, transaction_id) => {
    const newStatus = event.target.value;
    updateTransactionStatus(transaction_id, newStatus);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} style={{ height: "auto" }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Booking List
                </MDTypography>
              </MDBox>
              {errorMessage && (
                <Alert variant="filled" severity="error">
                  {errorMessage}
                </Alert>
              )}

              {/* Show error message if there's an error */}
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Name", accessor: "Name", align: "left" },
                      { Header: "Service_Name", accessor: "Service_Name", align: "center" },
                      { Header: "Service_Image", accessor: "Service_Image", align: "center" },
                      {
                        Header: "Total_Amount",
                        accessor: "Total_Amount",
                        align: "center",
                      },
                      {
                        Header: "Payment_Id",
                        accessor: "Payment_Id",
                        align: "center",
                      },
                      {
                        Header: "Payment_Status",
                        accessor: "Payment_Status",
                        align: "center",
                      },
                      { Header: "Datetime", accessor: "Datetime", align: "center" },
                      { Header: "Status", accessor: "Status", align: "center" },
                    ],
                    rows: userData.map((user) => ({
                      Name: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                              {`${user.user_id.first_name} ${user.user_id.last_name}`}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      ),
                      Service_Name: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.service_id && user.service_id.service_name
                            ? user.service_id.service_name
                            : "N/A"}
                        </MDTypography>
                      ),
                      Service_Image: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            {user.service_images ? (
                              <img
                                src={`${base_url}/${user.service_images[0]}`}
                                alt="Product Image"
                                style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust size as needed
                              />
                            ) : (
                              <img
                                src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" // Replace with your default image path
                                alt="Default Product Image"
                                style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust size as needed
                              />
                            )}
                          </MDBox>
                        </MDBox>
                      ),
                      Payment_Id: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.payment_id}
                        </MDTypography>
                      ),
                      Payment_Status: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.payment_status}
                        </MDTypography>
                      ),
                      Total_Amount: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.total_amount}
                        </MDTypography>
                      ),
                      Datetime: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.datetime}
                        </MDTypography>
                      ),
                      Status: (
                        <Select
                          value={user.status} // Current status value
                          onChange={(event) => handleStatusChange(event, user._id)} // Call your handler
                          displayEmpty
                          fullWidth
                          variant="outlined"
                          sx={{ minWidth: 120 }} // Adjust the width if necessary
                        >
                          <MenuItem value="">Select Status</MenuItem>
                          <MenuItem value="Waiting">Waiting</MenuItem>
                          <MenuItem value="InProgress">InProgress</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      ),
                      editCategoryComponent: showModel && (
                        <EditCourseDate
                          onClose={() => setShowModel(false)}
                          courseId={courseId}
                          courseStartDate={courseStartDate}
                        />
                      ),
                    })),
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                />
                <MDBox display="flex" justifyContent="center" mt={3} mb={1}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    size="large"
                  />
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {showModel && (
        <EditCourseDate
          onClose={() => setShowModel(false)}
          courseId={courseId}
          courseStartDate={courseStartDate}
        />
      )}
    </DashboardLayout>
  );
}

export default Tables;
