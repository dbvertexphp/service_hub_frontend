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
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Dialog from "@mui/material/Dialog"; // Import Dialog
import DialogContent from "@mui/material/DialogContent"; // Import DialogContent
import DialogTitle from "@mui/material/DialogTitle"; // Import DialogTitle

function Tables() {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { order_id } = useParams();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const base_url = process.env.REACT_APP_BASE_URL;

  const fetchData = async (order_id) => {
    try {
      const response = await Api.getProductsByOrderAndSupplier(order_id);
      console.log(response);
      if (response && response.service) {
        const service = Array.isArray(response.service) ? response.service : [response.service];
        console.log(service);
        setUserData(service);
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

  const handleImageClick = (image) => {
    setSelectedImage(image); // Set the clicked image URL
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
    setSelectedImage(""); // Clear the selected image
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} style={{ height: "auto" }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card style={{ marginBottom: "30px" }}>
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
                  Service Details
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{
                    columns: [
                      { Header: "Service_Name", accessor: "Service_Name", align: "left" },
                      { Header: "Service_Amount", accessor: "Service_Amount", align: "center" },
                      { Header: "Service_Desc", accessor: "Service_Desc", align: "center" },
                      { Header: "Updated", accessor: "Updated", align: "center" },
                    ],

                    rows: userData.map((user) => ({
                      Service_Name: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                              {user.service_name}
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
                      Service_Desc: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.service_description}
                        </MDTypography>
                      ),
                      Updated: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {new Date(user.updatedAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </MDTypography>
                      ),
                    })),
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
            <Card container spacing={6} style={{ marginTop: "20px" }}>
              <h3 style={{ textAlign: "center", margin: "50px" }}>Service Images</h3>
              {userData.length > 0 &&
              userData[0].service_images &&
              userData[0].service_images.length > 0 ? ( // Check if userData has any items and if the first one has service_images with images
                <ImageList
                  sx={{ width: 700, height: 400, margin: "auto" }}
                  cols={4}
                  rowHeight={164}
                >
                  {userData[0].service_images.map((image, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={`${base_url}/${image}`}
                        srcSet={`${base_url}/${image}`}
                        alt={`Service Image ${index + 1}`}
                        loading="lazy"
                        onClick={() => handleImageClick(image)} // Handle click to show full image
                        style={{ cursor: "pointer" }} // Change cursor to pointer
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <p>No images available</p> // Fallback content if there are no images
              )}
            </Card>
            {/* Modal for full image view */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Full Image</DialogTitle>
              <DialogContent>
                <img
                  src={`${base_url}/${selectedImage}`}
                  alt="Full View"
                  style={{ width: "100%", height: "auto" }} // Make image responsive
                />
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
