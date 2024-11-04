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
import TextField from "@mui/material/TextField";

function Tables() {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModel, setShowModel] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const base_url = process.env.REACT_APP_BASE_URL;

  const fetchData = async (page = 1, searchQuery) => {
    try {
      const response = await Api.getAllTransactionsInAdmin(page, searchQuery);
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
    fetchData(page, searchQuery);
  }, [page, searchQuery]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Function to update user status
  const updateTransactionStatus = async (transaction_id, newStatus) => {
    try {
      const response = await Api.updateTransactionStatus(transaction_id, newStatus);
      fetchData(page, searchQuery);
      setUpdateSuccess(true);
      if (response.status) {
        setUpdateSuccess(true);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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

              {/* Show error message if there's an error */}
              {errorMessage && (
                <Alert variant="filled" severity="error">
                  {errorMessage}
                </Alert>
              )}

              <MDBox pt={3}>
                {/* Search input for filtering users */}
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  sx={{ m: 3 }}
                />
                {/* Show message when no data is found */}
                {userData.length === 0 ? (
                  <p style={{ textAlign: "center", fontWeight: "500", paddingBottom: "10px" }}>
                    No Data Found
                  </p>
                ) : (
                  <>
                    <DataTable
                      table={{
                        columns: [
                          { Header: "Order_Id", accessor: "Order_Id", align: "left" },
                          { Header: "Name", accessor: "Name", align: "center" },
                          { Header: "Service_Name", accessor: "Service_Name", align: "center" },
                          //   { Header: "Service_Image", accessor: "Service_Image", align: "center" },
                          { Header: "Total_Amount", accessor: "Total_Amount", align: "center" },
                          { Header: "Mobile", accessor: "Mobile", align: "center" },
                          { Header: "Address", accessor: "Address", align: "center" },
                          { Header: "Datetime", accessor: "Datetime", align: "center" },
                          { Header: "Status", accessor: "Status", align: "center" },
                        ],
                        rows: userData.map((user) => ({
                          Order_Id: (
                            <MDTypography
                              component="a"
                              variant="caption"
                              color="text"
                              fontWeight="medium"
                            >
                              {user.order_id ? user.order_id : "N/A"}
                            </MDTypography>
                          ),
                          Name: (
                            <MDTypography display="block" variant="button" fontWeight="medium">
                              {`${user.user_id?.first_name || ""} ${user.user_id?.last_name || ""}`}
                            </MDTypography>
                          ),
                          Service_Name: (
                            <MDTypography
                              component="a"
                              variant="caption"
                              color="text"
                              fontWeight="medium"
                            >
                              {user.service_id?.service_name ? user.service_id.service_name : "N/A"}
                            </MDTypography>
                          ),
                          //   Service_Image: (
                          //     <MDBox display="flex" alignItems="center" lineHeight={1}>
                          //       <MDBox ml={2} lineHeight={1}>
                          //         {user.service_images && user.service_images.length > 0 ? (
                          //           <img
                          //             src={`${base_url}/${user.service_images[0]}`}
                          //             alt="Service Image"
                          //             style={{ maxWidth: "100px", maxHeight: "100px" }}
                          //           />
                          //         ) : (
                          //           <img
                          //             src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
                          //             alt="Default Service Image"
                          //             style={{ maxWidth: "100px", maxHeight: "100px" }}
                          //           />
                          //         )}
                          //       </MDBox>
                          //     </MDBox>
                          //   ),
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
                          Mobile: (
                            <MDTypography
                              component="a"
                              variant="caption"
                              color="text"
                              fontWeight="medium"
                            >
                              {user.user_id ? user.user_id.mobile : ""}
                            </MDTypography>
                          ),
                          Address: (
                            <MDTypography
                              component="a"
                              variant="caption"
                              color="text"
                              fontWeight="medium"
                            >
                              {user.user_id ? user.user_id.Address : ""}
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
                              sx={{
                                minWidth: 120, // Adjust the width if necessary
                                backgroundColor:
                                  user.status === "Accepted"
                                    ? "#50C878"
                                    : user.status === "Rejected"
                                    ? "red"
                                    : "inherit", // Default background color
                                color:
                                  user.status === "Accepted" || user.status === "Rejected"
                                    ? "#fff" // White text color for Accepted and Rejected
                                    : "inherit", // Default text color for other statuses like Waiting
                                "& .MuiSelect-select": {
                                  color:
                                    user.status === "Accepted" || user.status === "Rejected"
                                      ? "#fff" // White text for Accepted and Rejected
                                      : "inherit", // Default color for Waiting and others
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#fff", // Ensure border is #fff for outlined variant
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#fff", // Keep white border on hover
                                },
                              }}
                            >
                              <MenuItem value="">Select Status</MenuItem>
                              <MenuItem value="Waiting">Waiting</MenuItem>
                              <MenuItem value="Accepted">Accepted</MenuItem>
                              <MenuItem value="Rejected">Rejected</MenuItem>
                            </Select>
                          ),
                        })),
                      }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={true}
                      noEndBorder
                    />

                    {/* Pagination */}
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
                  </>
                )}
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
