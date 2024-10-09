import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { FormControl, InputLabel, Select } from "@mui/material";

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
import { Api } from "Api/Api";
import { useParams } from "react-router-dom";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

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
  const [total, setTotal] = useState("");
  const [next_page_url, setNextpageurl] = useState("");
  const [path, setPath] = useState("");
  const [per_page, setPer_page] = useState("");
  const [current_page, setCurrentpage] = useState("");
  const [prev_page_url, setPrevpageurl] = useState("");
  const [searchText, setSearchText] = useState("");
  const [newPage, setNewPage] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setErrors] = useState("");
  const [pagenumberStatusupdate, setPagenumberStatusupdate] = useState("");
  const [successSB, setSuccessSB] = useState(false);

  const fetchDataVideo = async (newPage) => {
    try {
      const response = await Api.NotificationListAdmin(newPage);
      if (response && response.notifications && Array.isArray(response.notifications)) {
        const datas = response.notifications;
        // Modify the data here to match the new structure
        const modifiedData = datas.map((user) => {
          setTotal_rows(response.total);
          setFirstpageurl(response.first_page_url);
          setFrom(response.from);
          setLastpage(response.last_page);
          setLastpageurl(response.last_page_url);
          setLinks(response.links);
          setNextpageurl(response.next_page_url);
          setPath(response.path);
          setPer_page(response.per_page);
          setPrevpageurl(response.prev_page_url);
          setTotal(response.total);
          setCurrentpage(response.currentPage);
          return {
            _id: user._id,
            senderid: user.sender._id,
            sender_first_name: user.sender.first_name,
            sender_last_name: user.sender.last_name,
            pic: user.sender.pic,
            message: user.message,
            metadata_report_type: user.metadata !== null ? user.metadata.report_type : "N/A",
            metadata_type_id: user.metadata !== null ? user.metadata.type_id : "N/A",

            type: user.type,
            date: user.date,
            time: user.time,
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
  const handlePageChange = (newPage) => {
    setUserData([]);
    setPagenumberStatusupdate(newPage);
    fetchDataVideo(newPage);
  };

  // Calculate the total number of pages based on the data you receive
  const totalPages = Math.ceil(total_rows / per_page);
  const maxPageNumbers = 10;
  const currentPage = current_page; // Example: Replace with your current page
  const startPage = Math.max(1, current_page - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  console.log(totalPages);
  console.log(maxPageNumbers);

  console.log(currentPage);
  console.log(startPage);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  useEffect(() => {
    fetchDataVideo(newPage);
    //fetchStatus();
  }, []);

  const handleProfileRedirect = (user_id) => {
    window.open(`/Website-user-profile-view/${user_id}`, "_blank");
  };

  const UserAdminStatusUpdate = async (userId) => {
    try {
      const response = await Api.UserAdminStatus(userId);
      if (response) {
        setSuccessSB(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
                  User Table
                </MDTypography>
              </MDBox>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginRight: "auto",
                  }}
                >
                  <div>
                    <MDBox pt={1} pl={2} sx={{ minWidth: 180 }}></MDBox>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "auto",
                  }}
                >
                  <div>
                    <MDBox pt={1} pr={2}>
                      <MDInput
                        label="Search here"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={() => handlePageChange(newPage, search)}
                        sx={{ display: "none" }}
                      />
                    </MDBox>
                  </div>
                </div>
              </div>
              <MDBox pt={3}>
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
                            {
                              Header: "Name",
                              accessor: "author",
                              width: "10%",
                              align: "left",
                            },
                            { Header: "Message", accessor: "message", align: "left" },
                            { Header: "Type", accessor: "type", align: "left" },
                            { Header: "Time", accessor: "time", align: "left" },
                            { Header: "Date", accessor: "date", align: "left" },
                          ],
                          rows: userData.map((user) => ({
                            author:
                              user.type === "ContactUs" ? (
                                <MDTypography
                                  display="block"
                                  variant="button"
                                  fontWeight="medium"
                                  ml={1}
                                  lineHeight={1}
                                >
                                  Contact Us
                                </MDTypography>
                              ) : (
                                <MDBox
                                  display="flex"
                                  alignItems="center"
                                  lineHeight={1}
                                  onClick={() => handleProfileRedirect(user._id)}
                                  sx={{ cursor: "pointer" }}
                                  className="admin_user_list_name"
                                >
                                  <MDAvatar
                                    src={user.pic}
                                    name={user.sender_first_name}
                                    size="sm"
                                    variant="rounded"
                                    sx={{ background: "gray" }}
                                  />
                                  <MDTypography
                                    display="block"
                                    variant="button"
                                    fontWeight="medium"
                                    ml={1}
                                    lineHeight={1}
                                  >
                                    {user.sender_first_name}
                                  </MDTypography>
                                </MDBox>
                              ),

                            message: (
                              <Link
                                to={
                                  user.type === "Report"
                                    ? "/report-list"
                                    : user.type === "ContactUs"
                                    ? "/contact-list"
                                    : user.type === "Transaction"
                                    ? "/transaction-list"
                                    : "/"
                                }
                              >
                                {user.message}
                              </Link>
                            ),
                            type: user.type,
                            time: user.time + " ago",
                            date: user.date,
                          })),
                        }}
                        isSorted={true}
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
                              onClick={() => handlePageChange(pageNumber, search)}
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
                    </>
                  )}
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
