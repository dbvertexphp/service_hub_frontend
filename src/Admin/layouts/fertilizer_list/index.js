import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import MDBox from "Admin/components/MDBox";
import MDTypography from "Admin/components/MDTypography";
import { Api } from "Api/Api";
import EditCourseDate from "../components/editcoursedate";
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import DataTable from "Admin/examples/Tables/DataTable";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function Tables() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [courseId, setCourseId] = useState(1);
  const [courseStartDate, setCourseStartDate] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const base_url = process.env.REACT_APP_BASE_URL;

  const fetchData = async (page) => {
    try {
      const response = await Api.getAllFertilizer(page, "");
      if (response && Array.isArray(response.fertilizer)) {
        const { fertilizer, totalPages } = response;
        setUserData(fertilizer);
        setTotalPages(totalPages);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteProduct = async (product_id) => {
    const data = {
      product_id: product_id,
    };
    try {
      const response = await Api.deleteFertilizer(data);
      if (response) {
        console.log(response);
        fetchData();
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handlePageClick = () => {
    navigate(`/add-fertilizer-product`);
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
                  Add Fertilizer
                </Button>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Product_Name", accessor: "Product_Name", align: "left" },

                      { Header: "Product_Image", accessor: "Product_Image", align: "center" },
                      { Header: "Product_Price", accessor: "Product_Price", align: "center" },
                      { Header: "Quantity", accessor: "Quantity", align: "center" },
                      { Header: "Product_weight", accessor: "Product_weight", align: "center" },

                      { Header: "action", accessor: "action", align: "center" },
                    ],

                    rows: userData.map((user) => ({
                      Product_Name: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                              {user.english_name}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      ),

                      Product_Image: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            {user.product_image ? (
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
                      Product_weight: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.product_weight}
                        </MDTypography>
                      ),

                      // action: (
                      //   <MDTypography
                      //     component="a"
                      //     variant="caption"
                      //     color="text"
                      //     fontWeight="medium"
                      //     sx={{ cursor: "pointer" }}
                      //     onClick={() => editcategoryfun(user._id, user.startDate)}
                      //   >
                      //     Edit
                      //   </MDTypography>
                      // ),
                      action: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          sx={{ cursor: "pointer" }}
                          onClick={() => deleteProduct(user._id)}
                        >
                          Delete
                        </MDTypography>
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
