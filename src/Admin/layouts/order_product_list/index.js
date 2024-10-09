import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import MDBox from "Admin/components/MDBox";
import MDTypography from "Admin/components/MDTypography";
import { Api } from "Api/Api";
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import DataTable from "Admin/examples/Tables/DataTable";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";

function Tables() {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { order_id } = useParams();

  const base_url = process.env.REACT_APP_BASE_URL;

  const fetchData = async (order_id) => {
    try {
      const response = await Api.getProductsByOrderAndSupplier(order_id);
      if (response && Array.isArray(response.order)) {
        const { order } = response;
        setUserData(order);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(order_id);
  }, [order_id]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const viewProduct = (teacherId) => {
    // navigate(`/update-teacher-pay/${teacherId}`);
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
                  Order Details
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Order_Id", accessor: "Order_Id", align: "left" },
                      { Header: "Payment_Method", accessor: "Payment_Method", align: "center" },
                      { Header: "Product_Image", accessor: "Product_Image", align: "center" },
                      { Header: "Total_Amount", accessor: "Total_Amount", align: "center" },
                      { Header: "Costomer_Name", accessor: "Costomer_Name", align: "center" },
                      { Header: "action", accessor: "action", align: "center" },
                    ],

                    rows: userData.map((user) => ({
                      Order_Id: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                              {user.order_id}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      ),
                      Payment_Method: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.payment_method}
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
                      Costomer_Name: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.user_id.full_name}
                        </MDTypography>
                      ),
                      action: (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => viewProduct(user.user_id.full_name)}
                        >
                          View
                        </Button>
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
