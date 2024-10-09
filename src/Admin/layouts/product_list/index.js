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

function Tables() {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const base_url = process.env.REACT_APP_BASE_URL;

  const fetchData = async (page) => {
    try {
      const response = await Api.getAllProductsInAdmin(page, "");
      if (response && Array.isArray(response.products)) {
        const { products, totalPages } = response;
        setUserData(products);
        setTotalPages(totalPages);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const UserAdminStatusUpdate = async (productId, newStatus) => {
    try {
      const response = await Api.updateProductStatus(productId, newStatus);
      if (response.status) {
        setUpdateSuccess(true);
        fetchData(page);
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleChange = (productId, currentStatus) => {
    const updatedStatus = !currentStatus;
    UserAdminStatusUpdate(productId, updatedStatus);
  };

  const updateProductDefaultStatus = async (productId, newStatus) => {
    try {
      const response = await Api.updateProductDefaultStatus(productId, newStatus);
      if (response.status) {
        setUpdateSuccess(true);
        // Refetch data to ensure the UI is updated
        fetchData(page);
      } else {
        // Set error message if there's an issue
        setErrorMessage("Cannot set default_product to true for more than 4 products."); // Assuming 'message' is returned from backend
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleCheckboxChange = (productId, currentStatus) => {
    const newStatus = !currentStatus;
    updateProductDefaultStatus(productId, newStatus);
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
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
                  Product List
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
                      { Header: "English_Name", accessor: "English_Name", align: "left" },
                      { Header: "Local_Name", accessor: "Local_Name", align: "center" },
                      { Header: "Other_Name", accessor: "Other_Name", align: "center" },
                      { Header: "Product_Image", accessor: "Product_Image", align: "center" },
                      { Header: "Product_Price", accessor: "Product_Price", align: "center" },
                      { Header: "Quantity", accessor: "Quantity", align: "center" },
                      { Header: "Product_Type", accessor: "Product_Type", align: "center" },
                      { Header: "Product_Size", accessor: "Product_Size", align: "center" },
                      { Header: "action", accessor: "action", align: "center" },
                      { Header: "default_product", accessor: "default_product", align: "center" },
                    ],
                    rows: userData.map((user) => ({
                      English_Name: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                              {user.english_name}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      ),
                      Local_Name: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.local_name}
                        </MDTypography>
                      ),
                      Other_Name: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.other_name}
                        </MDTypography>
                      ),
                      Product_Image: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            {user.product_images ? (
                              <img
                                src={`${base_url}/${user.product_images[0]}`}
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
                      Product_Price: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.price}
                        </MDTypography>
                      ),
                      Quantity: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.quantity}
                        </MDTypography>
                      ),
                      Product_Type: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.product_type}
                        </MDTypography>
                      ),
                      Product_Size: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.product_size}
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
                      default_product: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={user.default_product} // Bind the checkbox to the `default_product` status
                                  onChange={() =>
                                    handleCheckboxChange(user._id, user.default_product)
                                  } // Call the API when the checkbox is toggled
                                  inputProps={{ "aria-label": "default product checkbox" }}
                                />
                              }
                            />
                          </FormGroup>
                        </MDTypography>
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
    </DashboardLayout>
  );
}

export default Tables;
