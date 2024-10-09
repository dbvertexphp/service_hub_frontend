/**
=========================================================
* 
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";
import MDInput from "Admin/components/MDInput";
import MDTypography from "Admin/components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import DataTable from "Admin/examples/Tables/DataTable";
import MDPagination from "Admin/components/MDPagination";
import Icon from "@mui/material/Icon";
import MDAvatar from "Admin/components/MDAvatar";
import MDBadge from "Admin/components/MDBadge";
import { Api } from "Api/Api";

// Data

function Tables() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [total_rows, setTotal_rows] = useState("");
  const [first_page_url, setFirstpageurl] = useState("");
  const [from, setFrom] = useState("");
  const [last_page, setLastpage] = useState("");
  const [last_page_url, setLastpageurl] = useState("");
  const [links, setLinks] = useState("");
  const [page, setPage] = useState("");
  const [total, setTotal] = useState("");
  const [next_page_url, setNextpageurl] = useState("");
  const [path, setPath] = useState("");
  const [per_page, setPer_page] = useState("");
  const [current_page, setCurrentpage] = useState("");
  const [prev_page_url, setPrevpageurl] = useState("");
  const [searchText, setSearchText] = useState("");
  const [newPage, setNewPage] = useState("");
  const [search, setSearch] = useState("");

  const handlePageChange = (newPage, search) => {
    fetchData(newPage, searchText);
  };

  const fetchData = async (page, search) => {
    try {
      const response = await Api.getAllClient(page, search);
      if (response && response.Client.data && Array.isArray(response.Client.data)) {
        const datas = response.Client.data;
        // Modify the data here to match the new structure
        const modifiedData = datas.map((user) => {
          setTotal_rows(response.Client.total);
          setFirstpageurl(response.Client.first_page_url);
          setFrom(response.Client.from);
          setLastpage(response.Client.last_page);
          setLastpageurl(response.Client.last_page_url);
          setLinks(response.Client.links);
          setNextpageurl(response.Client.next_page_url);
          setPath(response.Client.path);
          setPer_page(response.Client.per_page);
          setPrevpageurl(response.Client.prev_page_url);
          setTotal(response.Client.total);
          setCurrentpage(response.Client.current_page);

          const {
            id,
            username,
            name,
            email,
            phone,
            city,
            state,
            country,
            image,
            created,
            total_rows,
            first_page_url,
            from,
            last_page,
            last_page_url,
            links,
            next_page_url,
            page,
            total,
          } = user;
          return {
            id,
            username,
            name,
            email,
            phone,
            city,
            state,
            country,
            image,
            created,
            total_rows,
            first_page_url,
            from,
            last_page,
            last_page_url,
            links,
            next_page_url,
            page,
            total,
          };
        });
        setUserData(modifiedData);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(newPage, searchText);
  }, [searchText, newPage]);

  // Calculate the total number of pages based on the data you receive
  const totalPages = Math.ceil(total_rows / per_page);

  const maxPageNumbers = 5;
  const currentPage = current_page; // Example: Replace with your current page
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
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
                  Client Table
                </MDTypography>
              </MDBox>
              <div style={{ marginLeft: "auto" }}>
                <MDBox pt={1} pr={1}>
                  <MDInput
                    label="Search here"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={() => handlePageChange(newPage, search)}
                  />
                </MDBox>
              </div>
              <MDBox pt={3}>
                {userData.length === 0 ? (
                  <p style={{ textAlign: "center", fontWeight: "500", paddingBottom: "10px" }}>
                    No Data Found
                  </p>
                ) : (
                  <>
                    <DataTable
                      table={{
                        columns: [
                          { Header: "User", accessor: "author", width: "45%", align: "left" },
                          { Header: "Phone", accessor: "Phone", align: "left" },
                          { Header: "City", accessor: "City", align: "left" },
                          { Header: "state", accessor: "State", align: "left" },
                          { Header: "country", accessor: "Country", align: "center" },
                          { Header: "created", accessor: "created", align: "center" },
                          { Header: "action", accessor: "action", align: "center" },
                        ],
                        rows: userData.map((user) => ({
                          author: (
                            <MDBox display="flex" alignItems="center" lineHeight={1}>
                              <MDAvatar
                                src={user.image}
                                name={user.name}
                                size="sm"
                                className="profile_list"
                              />
                              <MDBox ml={2} lineHeight={1}>
                                <MDTypography display="block" variant="button" fontWeight="medium">
                                  {user.name}
                                </MDTypography>
                                <MDTypography variant="caption">{user.email}</MDTypography>
                              </MDBox>
                            </MDBox>
                          ),
                          Phone: user.phone,
                          City: user.city,
                          State: user.state,
                          Country: user.country,
                          status: (
                            <MDBox ml={-1}>
                              <MDBadge
                                badgeContent="online"
                                color="success"
                                variant="gradient"
                                size="sm"
                              />
                            </MDBox>
                          ),
                          created: (
                            <MDTypography
                              component="a"
                              href="#"
                              variant="caption"
                              color="text"
                              fontWeight="medium"
                            >
                              {user.created}
                            </MDTypography>
                          ),
                          action: (
                            <MDTypography
                              component="a"
                              href="/"
                              variant="caption"
                              color="text"
                              fontWeight="medium"
                            >
                              Delete
                            </MDTypography>
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
                        <MDPagination item key={1} onClick={() => handlePageChange(1)}>
                          <Icon>keyboard_arrow_left</Icon>
                        </MDPagination>

                        {pageNumbers.map((pageNumber) => (
                          <MDPagination
                            item
                            key={pageNumber}
                            active={pageNumber === current_page} // Set active based on the current_page
                            onClick={() => handlePageChange(pageNumber, search)}
                          >
                            {pageNumber}
                          </MDPagination>
                        ))}

                        <MDPagination
                          item
                          key={last_page}
                          onClick={() => handlePageChange(last_page)}
                        >
                          <Icon>keyboard_arrow_right</Icon>
                        </MDPagination>
                      </MDPagination>
                    </div>
                  </>
                )}
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
