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
import { FormControl, InputLabel, Select, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import NativeSelect from "@mui/material/NativeSelect";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
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

function Teacher_Course_Details() {
  const navigate = useNavigate();
  const { teacher_id } = useParams();
  const [userData, setUserData] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
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
    fetchBankDetails(teacher_id);
  };

  const fetchData = async () => {
    try {
      const response = await Api.getCoursesByTeacherId(teacher_id);

      if (response && response.Courses.data && Array.isArray(response.Courses.data)) {
        const datas = response.Courses.data;
        const modifiedData = datas.map((user) => {
          return {
            _id: user._id,
            profile_pic: user.teacher.profile_pic,
            full_name: user.teacher.full_name,
            email: user.teacher.email,
            mobile: user.teacher.mobile,
            education: user.teacher.education,
            experience: user.teacher.experience,
            expertise: user.teacher.expertise,
            about_me: user.teacher.about_me,
            datetime: user.teacher.datetime,
            category_name: user.category_name,
            subcategory_name: user.subcategory_name,
            startTime: user.startTime,
            endTime: user.endTime,
            title: user.title,
            type: user.type,
            createdAt: user.createdAt,
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

  const fetchBankDetails = async (teacher_id) => {
    try {
      const response = await Api.getBankDetailsAdmin(teacher_id);
      console.log(response);
      if (response && response.bankDetails) {
        const bankinfo = response.bankDetails;

        // Extract required fields or manipulate data as needed
        const modifiedData = {
          _id: bankinfo._id,
          accountNumber: bankinfo.accountNumber,
          bankAddress: bankinfo.bankAddress,
          bankName: bankinfo.bankName,
          ifscCode: bankinfo.ifscCode,
          datetime: bankinfo.datetime,
        };

        setBankDetails([modifiedData]); // Assuming setBankDetails expects an array
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching teacher payment status:", error);
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

  const totalPages = Math.ceil(total_rows / per_page);
  const maxPageNumbers = 5;
  const currentPage = current_page;
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  useEffect(() => {
    fetchData();
    fetchBankDetails(teacher_id); // Initial fetch of bank details
  }, []);

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
    }, 4000);
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
  console.log(bankDetails);

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
                  Teacher Courses List
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
                      <Typography
                        style={{ textAlign: "center", marginBottom: "50px", fontWeight: "bold" }}
                      >
                        {userData[0].full_name} Courses
                      </Typography>
                      <DataTable
                        table={{
                          columns: [
                            {
                              Header: "Title",
                              accessor: "Title",
                              width: "10%",
                              align: "left",
                            },

                            { Header: "Category_Name", accessor: "Category_Name", align: "left" },
                            {
                              Header: "Subcategory_Name",
                              accessor: "Subcategory_Name",
                              align: "left",
                            },

                            { Header: "Type", accessor: "Type", align: "center" },
                            { Header: "StartTime", accessor: "StartTime", align: "center" },
                            { Header: "EndTime", accessor: "EndTime", align: "center" },

                            { Header: "CreatedAt", accessor: "CreatedAt", align: "center" },
                          ],
                          rows: userData.map((user) => ({
                            Title: (
                              <MDTypography
                                component="a"
                                href="#"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.title}
                              </MDTypography>
                            ),
                            Category_Name: (
                              <MDTypography
                                component="a"
                                href="#"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.category_name}
                              </MDTypography>
                            ),
                            Subcategory_Name: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.subcategory_name}
                              </MDTypography>
                            ),
                            Type: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.type}
                              </MDTypography>
                            ),
                            StartTime: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.startTime}
                              </MDTypography>
                            ),
                            EndTime: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.endTime}
                              </MDTypography>
                            ),
                            CreatedAt: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.createdAt}
                              </MDTypography>
                            ),
                          })),
                        }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                      />
                    </>
                  )}
                </MDBox>
              </MDBox>

              <MDBox pt={3}>
                <MDBox pt={3}>
                  {bankDetails.length === 0 ? (
                    <p style={{ textAlign: "center", fontWeight: "500", paddingBottom: "10px" }}>
                      No Data Found
                    </p>
                  ) : (
                    <>
                      <Typography
                        style={{ textAlign: "center", marginBottom: "50px", fontWeight: "bold" }}
                      >
                        Bank Details
                      </Typography>
                      <DataTable
                        table={{
                          columns: [
                            {
                              Header: "Account_Number",
                              accessor: "Account_Number",

                              align: "left",
                            },

                            { Header: "Bank_Address", accessor: "Bank_Address", align: "center" },
                            {
                              Header: "Bank_Name",
                              accessor: "Bank_Name",
                              align: "center",
                            },
                            { Header: "Ifsc_Code", accessor: "Ifsc_Code", align: "center" },
                            { Header: "CreatedAt", accessor: "CreatedAt", align: "center" },
                          ],
                          rows: bankDetails.map((bankinfo) => ({
                            Account_Number: (
                              <MDTypography
                                component="a"
                                href="#"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {bankinfo.accountNumber}
                              </MDTypography>
                            ),
                            Bank_Address: (
                              <MDTypography
                                component="a"
                                href="#"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {bankinfo.bankAddress}
                              </MDTypography>
                            ),
                            Bank_Name: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {bankinfo.bankName}
                              </MDTypography>
                            ),
                            Ifsc_Code: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {bankinfo.ifscCode}
                              </MDTypography>
                            ),
                            CreatedAt: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {bankinfo.datetime}
                              </MDTypography>
                            ),
                          })),
                        }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                      />
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

export default Teacher_Course_Details;
