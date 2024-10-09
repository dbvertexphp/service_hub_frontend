import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link,
  useParams,
} from "react-router-dom";
import { FormControl, InputLabel, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import NativeSelect from "@mui/material/NativeSelect";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";

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
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

// Data

function Tables() {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [userData, setUserData] = useState([]);
  const [userUpdatetatus, setUpdateDataStatus] = useState([]);
  const [projectupdateId, setProjectUpdateId] = useState([]);
  const [projectupdatename, setProjectUpdateName] = useState([]);
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

  const [descriptionsModelShow, setDescriptionsModelShow] = useState(false);
  const [DescriptionsData, setDescriptionsData] = useState({});
  const [Short, setShort] = React.useState("All");

  const handleChangeShort = (event) => {
    setUserData([]);
    setShort(event.target.value);
  };

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const handlePageChange = (newPage) => {
    setUserData([]);
    setPagenumberStatusupdate(newPage);
    fetchData(newPage, searchText, Short);
  };

  const fetchData = async (page, search, Short) => {
    try {
      const response = await Api.getAllTransactionsByTeacher(page, search, Short, user_id);
      if (response && response.Transactions.data && Array.isArray(response.Transactions.data)) {
        const datas = response.Transactions.data;
        // Modify the data here to match the new structure

        const modifiedData = datas.map((user) => {
          setTotal_rows(response.Transactions.total);
          setFirstpageurl(response.Transactions.first_page_url);
          setFrom(response.Transactions.from);
          setLastpage(response.Transactions.last_page);
          setLastpageurl(response.Transactions.last_page_url);
          setLinks(response.Transactions.links);
          setNextpageurl(response.Transactions.next_page_url);
          setPath(response.Transactions.path);
          setPer_page(response.Transactions.per_page);
          setPrevpageurl(response.Transactions.prev_page_url);
          setTotal(response.Transactions.total);
          setCurrentpage(response.Transactions.current_page);
          console.log(user);
          return {
            _id: user.user_id._id,
            student_name: user.user_id.first_name + user.user_id.last_name,
            teacher_name: user.teacher_id.first_name + user.teacher_id.last_name,
            amount: user.amount,
            course: user.course_id.title,
            payment_id: user.payment_id,
            transaction_id: user.transaction_id,
            datetime: user.datetime,
            payment_status: user.payment_status,
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

  const handleCloseLogoutDialog = () => {
    setUpdatestatusDialogOpen(false);
  };

  const handleUpdatestatus = () => {
    setUpdatestatusDialogOpen(false);
    Api.StatusUpdateProject(projectupdateId, userUpdatetatus)
      .then((response) => {
        if (response.errors) {
          setErrors(response.errors);
        }
        if (response.status == true) {
          openSuccessSB();
        } else {
          setErrors(response.errors);
        }
      })
      .catch((error) => {
        // Handle the error appropriately
        setErrors(error);
      });
    fetchData(pagenumberStatusupdate, searchText);
  };

  const handleClose = () => {
    setDescriptionsModelShow(false);
  };
  const descriptionShow = async (description) => {
    try {
      const _id = description;
      const response = await Api.getBankDetailsAdmin(_id);
      if (response) {
        setDescriptionsData(response.bankDetails);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setDescriptionsModelShow(true);
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
    fetchData(newPage, searchText, Short);
  }, [searchText, newPage, Short]);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="User Status Update"
      content={"User Status Update Successfully"}
      dateTime="0 Sec ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  if (successSB) {
    setTimeout(() => {
      setSuccessSB(false);
      closeSuccessSB();
    }, 4000); // 2000 milliseconds = 2 seconds
  }

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

  const handleMobileChange = (event, userId) => {
    const newUserData = userData.map((user) => {
      if (user._id === userId) {
        return { ...user, mobile: event.target.value };
      }
      return user;
    });
    setUserData(newUserData);
  };

  const handleMobileUpdate = async (UserId, mobile) => {
    try {
      const response = await Api.UpdateMobileAdmin(UserId, mobile);
      alert(response.message);
      const updatedUserData = userData.map((user) => {
        if (user._id === UserId) {
          return { ...user, mobile: mobile };
        }
        return user;
      });
    } catch (error) {
      console.error("Error updating mobile number:", error);
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
                  Teacher Transactions List
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
                    <MDBox pt={1} pl={2} sx={{ minWidth: 180 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Short</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={Short}
                          sx={{ height: "44px" }}
                          label="Age"
                          onChange={handleChangeShort}
                        >
                          <MenuItem value="All" selected>
                            All
                          </MenuItem>

                          {/* <MenuItem value="Review">Review</MenuItem>
                          <MenuItem value="watch_time">Watch Time</MenuItem>
                          <MenuItem value="Subscribe">Subscribe</MenuItem> */}
                        </Select>
                      </FormControl>
                    </MDBox>
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
                              Header: "Student Name",
                              accessor: "student_name",
                              width: "10%",
                              align: "left",
                            },
                            {
                              Header: "Teacher Name",
                              accessor: "teacher_name",
                              width: "10%",
                              align: "left",
                            },
                            { Header: "Course", accessor: "course", align: "left" },
                            { Header: "Amount", accessor: "amount", align: "left" },

                            { Header: "Payment_id", accessor: "payment_id", align: "left" },
                            { Header: "Transaction", accessor: "transaction_id", align: "left" },

                            { Header: "Date time", accessor: "datetime", align: "center" },
                            {
                              Header: "Payment Status",
                              accessor: "payment_status",
                              align: "center",
                            },
                          ],
                          rows: userData.map((user) => ({
                            student_name: (
                              <MDBox
                                display="flex"
                                alignItems="center"
                                lineHeight={1}
                                // onClick={() => handleProfileRedirect(user._id)}
                                sx={{ cursor: "pointer" }}
                                className=""
                              >
                                <MDTypography
                                  display="block"
                                  variant="button"
                                  fontWeight="medium"
                                  ml={1}
                                  lineHeight={1}
                                >
                                  {`${user.student_name}`}
                                </MDTypography>
                              </MDBox>
                            ),
                            teacher_name: (
                              <MDBox
                                display="flex"
                                alignItems="center"
                                lineHeight={1}
                                // onClick={() => handleProfileRedirect(user._id)}
                                sx={{ cursor: "pointer" }}
                                className=""
                              >
                                <MDTypography
                                  display="block"
                                  variant="button"
                                  fontWeight="medium"
                                  ml={1}
                                  lineHeight={1}
                                >
                                  {`${user.teacher_name}`}
                                </MDTypography>
                              </MDBox>
                            ),
                            course: user.course,
                            amount: user.amount,
                            payment_id: user.payment_id,
                            transaction_id: user.transaction_id,
                            datetime: user.datetime,
                            payment_status: user.payment_status,
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
      {renderSuccessSB}
      <Footer />
      {descriptionsModelShow && (
        <Bankdetails_Model
          descriptionsModelShow={descriptionsModelShow}
          handleClose={handleClose}
          DescriptionsData={DescriptionsData}
        />
      )}
      <Dialog
        open={updatestatusDialogOpen}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Update Status</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to Update Status?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdatestatus} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
