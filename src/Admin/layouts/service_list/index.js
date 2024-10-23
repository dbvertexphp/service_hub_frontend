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
import EditService from "../components/editservice";
import { useNavigate } from "react-router-dom";

function Tables() {
  const [userData, setUserData] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceAmount, setServiceAmount] = useState("");
  const [serviceImage, setServiceImage] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModel, setShowModel] = useState(false);
  const navigate = useNavigate();
  const base_url = process.env.REACT_APP_BASE_URL;

  const fetchData = async (page) => {
    try {
      const response = await Api.getAllServicesInAdmin(page, "");

      if (response && Array.isArray(response.services)) {
        const { services, totalPages } = response;
        setUserData(services);
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

  const handlePageClick = () => {
    navigate(`/add-service`);
  };

  const truncateDescription = (description, maxLength = 100) => {
    // Check if description is null or undefined, and return an empty string if so
    if (!description) {
      return "";
    }

    // If the description length is less than or equal to maxLength, return it as is
    if (description.length <= maxLength) {
      return description;
    }

    // Otherwise, truncate the description and add "..."
    return description.slice(0, maxLength) + "...";
  };

  const deleteService = async (id) => {
    try {
      const response = await Api.deleteService(id);
      if (response) {
        fetchData();
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editcategoryfun = (
    serviceName,
    serviceId,
    serviceImage,
    service_description,
    service_amount
  ) => {
    setServiceName(serviceName);
    setServiceId(serviceId);
    setServiceImage(serviceImage);
    setServiceDesc(service_description), setServiceAmount(service_amount), setShowModel(true);
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
                  Service List
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
                <Button
                  sx={{
                    float: "right",
                    backgroundColor: "#007bff",
                    color: "#ffffff",
                    margin: "15px",
                  }}
                  onClick={handlePageClick}
                  variant="contained"
                >
                  Add Services
                </Button>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Service_Name", accessor: "Service_Name", align: "left" },
                      { Header: "Service_Amount", accessor: "Service_Amount", align: "center" },
                      { Header: "Service_Image", accessor: "Service_Image", align: "center" },
                      {
                        Header: "Service_Description",
                        accessor: "Service_Description",
                        align: "center",
                      },
                      { Header: "action", accessor: "action", align: "center" },
                      { Header: "delete", accessor: "delete", align: "center" },
                      { Header: "edit", accessor: "edit", align: "center" },
                    ],
                    rows: userData.map((user) => ({
                      Service_Name: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                              {user.service_name && user.service_name}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      ),
                      Service_Amount: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.service_amount}
                        </MDTypography>
                      ),
                      Service_Image: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            {user.service_images ? (
                              <img
                                src={`${base_url}/${user.service_images[0]}`}
                                alt="Service Image"
                                style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust size as needed
                              />
                            ) : (
                              <img
                                src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" // Replace with your default image path
                                alt="Default Service Image"
                                style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust size as needed
                              />
                            )}
                          </MDBox>
                        </MDBox>
                      ),
                      Service_Description: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {truncateDescription(user.service_description, 50)}{" "}
                        </MDTypography>
                      ),
                      action: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={user.active}
                                  onChange={(e) => handleChange(user._id, user.active)}
                                  inputProps={{ "aria-label": "controlled" }}
                                />
                              }
                            />
                          </FormGroup>
                        </MDTypography>
                      ),
                      delete: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          sx={{ cursor: "pointer" }}
                          onClick={() => deleteService(user._id)}
                        >
                          Delete
                        </MDTypography>
                      ),
                      edit: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            editcategoryfun(
                              user.service_name,
                              user._id,
                              user.service_images,
                              user.service_description,
                              user.service_amount
                            )
                          }
                        >
                          Edit
                        </MDTypography>
                      ),
                      editCategoryComponent: showModel && (
                        <EditService
                          onClose={() => setShowModel(false)}
                          serviceId={serviceId}
                          serviceName={serviceName}
                          serviceImage={serviceImage}
                          serviceDesc={serviceDesc}
                          serviceAmount={serviceAmount}
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
        <EditService
          onClose={() => setShowModel(false)}
          serviceId={serviceId}
          serviceName={serviceName}
          serviceImage={serviceImage}
          serviceDesc={serviceDesc}
          serviceAmount={serviceAmount}
        />
      )}
    </DashboardLayout>
  );
}

export default Tables;
