import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { FormControl, InputLabel, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import NativeSelect from "@mui/material/NativeSelect";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";
import MDInput from "Admin/components/MDInput";
import MDTypography from "Admin/components/MDTypography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import MDSnackbar from "Admin/components/MDSnackbar";
import { FaEye } from "react-icons/fa";

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
import Bankdetails_Model from "../model/bankdetails_model";
import { useParams } from "react-router-dom";

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
  const [updatestatusDialogOpen, setUpdatestatusDialogOpen] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const { VideoId, Type } = useParams();

  const [descriptionsModelShow, setDescriptionsModelShow] = useState(false);
  const [DescriptionsData, setDescriptionsData] = useState({});

  const fetchDataVideo = async (VideoId, newPage) => {
    try {
      let response;
      if (Type == "Video") {
        response = await Api.VideoViewUserList(VideoId, newPage);
      } else {
        response = await Api.ReelViewUserList(VideoId, newPage);
      }

      if (response && response.Users.data && Array.isArray(response.Users.data)) {
        const datas = response.Users.data;
        // Modify the data here to match the new structure
        const modifiedData = datas.map((user) => {
          setTotal_rows(response.Users.total);
          setFirstpageurl(response.Users.first_page_url);
          setFrom(response.Users.from);
          setLastpage(response.Users.last_page);
          setLastpageurl(response.Users.last_page_url);
          setLinks(response.Users.links);
          setNextpageurl(response.Users.next_page_url);
          setPath(response.Users.path);
          setPer_page(response.Users.per_page);
          setPrevpageurl(response.Users.prev_page_url);
          setTotal(response.Users.total);
          setCurrentpage(response.Users.current_page);
          return {
            _id: user.user._id,
            pic: user.user.pic,
            watch_time: user.user.watch_time,
            subscribe: user.user.subscribe,
            review: user.user.review,
            first_name: user.user.first_name,
            last_name: user.user.last_name,
            email: user.user.email,
            mobile: user.user.mobile,
            username: user.user.username,
            datetime: user.user.datetime,
            about_me: user.user.about_me,
            dob: user.user.dob,
            interest: user.user.interest,
            deleted_at: user.user.deleted_at,
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
    fetchDataVideo(VideoId, newPage);
  };

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

  useEffect(() => {
    fetchDataVideo(VideoId, newPage);
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
                            { Header: "Username", accessor: "Username", align: "left" },
                            { Header: "E-Mail", accessor: "E_Mail", align: "left" },
                            { Header: "Mobile", accessor: "Mobile", align: "left" },
                          ],
                          rows: userData.map((user) => ({
                            author: (
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
                                  name={user.first_name}
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
                                  {user.first_name}
                                </MDTypography>
                              </MDBox>
                            ),
                            Username: user.username,
                            E_Mail: user.email,
                            Mobile: user.mobile,
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
