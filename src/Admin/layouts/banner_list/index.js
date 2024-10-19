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

  const fetchData = async () => {
    try {
      const response = await Api.getAllBanners();
      console.log(response);
      if (response && Array.isArray(response.banner)) {
        const { banner } = response;
        setUserData(banner);
        setTotalPages(totalPages);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteBanner = async (bannerId) => {
    try {
      const response = await Api.deleteBanner(bannerId);
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
    navigate(`/add-banner-image`);
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
                  Banner List
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
                  Add Banner
                </Button>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Banner_Title", accessor: "Banner_Title", align: "left" },
                      { Header: "Banner_Image", accessor: "Banner_Image", align: "center" },
                      { Header: "action", accessor: "action", align: "center" },
                    ],

                    rows: userData.map((user) => ({
                      Banner_Title: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                              {user.title}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      ),

                      Banner_Image: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            {user.image ? (
                              <img
                                src={`${base_url}/${user.image}`}
                                alt="Banner Image"
                                style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust size as needed
                              />
                            ) : (
                              <img
                                src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" // Replace with your default image path
                                alt="Default banner Image"
                                style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust size as needed
                              />
                            )}
                          </MDBox>
                        </MDBox>
                      ),

                      action: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          sx={{ cursor: "pointer" }}
                          onClick={() => deleteBanner(user._id)}
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
