import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import MDBadge from "Admin/components/MDBadge";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";
import MDTypography from "Admin/components/MDTypography";
import { Api } from "Api/Api";
import EditCategory from "../components/editcategory";

// Material Dashboard 2 React example components
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import DataTable from "Admin/examples/Tables/DataTable";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import MDPagination from "Admin/components/MDPagination";

function Tables() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [category_id, setCategoryId] = useState("");
  const [category_name, setcategoryName] = useState("");
  const [category_image, setCategoryImage] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [pagenumberStatusupdate, setPagenumberStatusupdate] = useState("");
  const [total_rows, setTotal_rows] = useState("");
  const [current_page, setCurrentpage] = useState("");
  const [newPage, setNewPage] = useState(1);
  const [total, setTotal] = useState("");
  const base_url = process.env.REACT_APP_BASE_URL;

  const handlePageChange = (newPage) => {
    setUserData([]);
    setPagenumberStatusupdate(newPage);
    fetchData(newPage);
  };

  const fetchData = async (page) => {
    try {
      const response = await Api.getAllCategoryAdmin(page);

      if (response && response.data && Array.isArray(response.data)) {
        const { data, total_pages, current_page, total_count } = response;
        setUserData(data);
        setTotal(total_pages);
        setCurrentpage(current_page);
        setTotal_rows(total_count);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const editcategoryfun = (category_name, category_id, category_image) => {
    setcategoryName(category_name);
    setCategoryId(category_id);
    setCategoryImage(category_image);
    setShowModel(true);
  };

  useEffect(() => {
    async function fetchData(page) {
      try {
        const response = await Api.getAllCategoryAdmin(page);
        if (response && response.data && Array.isArray(response.data)) {
          const { data, total_pages, current_page, total_count } = response;
          setUserData(data);
          setTotal(total_pages);
          setCurrentpage(current_page);
          setTotal_rows(total_count);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData(newPage);
  }, [showModel]);

  const totalPages = Math.ceil(total_rows / 10);
  const maxPageNumbers = 10;
  const currentPage = current_page; // Example: Replace with your current page
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  useEffect(() => {
    fetchData(newPage);
  }, [newPage]);

  const handlePageClick = () => {
    navigate(`/add-category`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3} style={{ height: "85vh" }}>
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
                  Category List
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
                  Add Category
                </Button>
                <DataTable
                  table={{
                    columns: [
                      {
                        Header: "Category Name",
                        accessor: "author",

                        align: "center",
                      },
                      { Header: "Category Image", accessor: "image", align: "center" },
                      { Header: "created", accessor: "created", align: "center" },
                      { Header: "action", accessor: "action", align: "center" },
                    ],

                    rows: userData.map((user) => ({
                      author: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            <MDTypography display="block" variant="button" fontWeight="medium">
                              {user.category_name}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      ),
                      image: (
                        <MDBox display="flex" alignItems="center" lineHeight={1}>
                          <MDBox ml={2} lineHeight={1}>
                            {user.category_image ? (
                              <img
                                src={`${base_url}/${user.category_image}`}
                                alt="Category Image"
                                style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust size as needed
                              />
                            ) : (
                              <img
                                src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" // Replace with your default image path
                                alt="Default Category Image"
                                style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust size as needed
                              />
                            )}
                          </MDBox>
                        </MDBox>
                      ),

                      created: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                        >
                          {user.datetime}
                        </MDTypography>
                      ),
                      action: (
                        <MDTypography
                          component="a"
                          variant="caption"
                          color="text"
                          fontWeight="medium"
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            editcategoryfun(user.category_name, user._id, user.category_image)
                          }
                        >
                          Edit
                        </MDTypography>
                      ),
                      editCategoryComponent: showModel && (
                        <EditCategory
                          onClose={() => setShowModel(false)}
                          category_name={category_name}
                          category_id={category_id}
                        />
                      ),
                    })),
                  }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                <div className="page_number">
                  <MDPagination>
                    <MDPagination
                      item
                      key="prev"
                      onClick={() => handlePageChange(current_page - 1)}
                    >
                      <span className="admin_paginetions_iocn">
                        <MdKeyboardArrowLeft />
                      </span>
                    </MDPagination>

                    {pageNumbers.map((pageNumber) => (
                      <MDPagination
                        item
                        key={pageNumber}
                        active={pageNumber === current_page}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </MDPagination>
                    ))}

                    <MDPagination
                      item
                      key="next"
                      onClick={() => handlePageChange(current_page + 1)}
                    >
                      <span className="admin_paginetions_iocn">
                        <MdKeyboardArrowRight />
                      </span>
                    </MDPagination>
                  </MDPagination>
                </div>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {showModel && (
        <EditCategory
          onClose={() => setShowModel(false)}
          category_name={category_name}
          category_id={category_id}
          category_image={category_image}
        />
      )}
    </DashboardLayout>
  );
}

export default Tables;
