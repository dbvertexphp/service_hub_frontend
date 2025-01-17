import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";
import MDTypography from "Admin/components/MDTypography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import MDSnackbar from "Admin/components/MDSnackbar";
import { FaEye } from "react-icons/fa";

// Material Dashboard 2 React example components
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import DataTable from "Admin/examples/Tables/DataTable";
import MDAvatar from "Admin/components/MDAvatar";
import { Api } from "Api/Api";
import Bankdetails_Model from "../model/bankdetails_model";
import Pagination from "@mui/material/Pagination";
import DeleteIcon from "@mui/icons-material/Delete";

// Data

function Tables() {
  const [userData, setUserData] = useState([]);
  const [userUpdatetatus, setUpdateDataStatus] = useState([]);
  const [projectupdateId, setProjectUpdateId] = useState([]);
  const [error, setErrors] = useState("");
  const [updatestatusDialogOpen, setUpdatestatusDialogOpen] = useState(false);
  const [successSB, setSuccessSB] = useState(false);

  const [descriptionsModelShow, setDescriptionsModelShow] = useState(false);
  const [DescriptionsData, setDescriptionsData] = useState({});

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // State variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (page = 1, query = "") => {
    try {
      const response = await Api.getAllUsers(page, query);
      if (response && response.Users && Array.isArray(response.Users)) {
        const datas = response.Users;
        const modifiedData = datas.map((user) => {
          const defaultMobile = user.user.mobile || "";
          const defaultPincode = user.user.pin_code || "123456";
          return {
            _id: user.user._id,
            pic: user.user.pic,
            full_name: user.user.first_name + " " + user.user.last_name,
            email: user.user.email,
            mobile: defaultMobile,
            Pincode: defaultPincode,
            datetime: user.user.datetime,
            deleted_at: user.user.deleted_at,
          };
        });
        setUserData(modifiedData);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

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
    fetchData();
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

  const UserDelete = async (userId) => {
    try {
      const response = await Api.UserDelete(userId);
      console.log(response);
      if (response.status == true) {
        setSuccessSB(true);
        fetchData(currentPage, searchQuery);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMobileChange = (event, userId) => {
    const newValue = event.target.value;

    // Allow only up to 10 digits
    if (newValue.length <= 10) {
      const newUserData = userData.map((user) => {
        if (user._id === userId) {
          return { ...user, mobile: newValue };
        }
        return user;
      });
      setUserData(newUserData);
    }
  };

  const handleMobileUpdate = async (UserId, mobile) => {
    // Check if the mobile number is exactly 10 digits
    if (mobile.length !== 10) {
      alert("Mobile number must be exactly 10 digits.");
      return; // Prevent further execution if the number is not valid
    }

    try {
      const response = await Api.UpdateMobileAdmin(UserId, mobile);
      alert(response.message);

      // Update the userData state with the new mobile number
      const updatedUserData = userData.map((user) => {
        if (user._id === UserId) {
          return { ...user, mobile: mobile };
        }
        return user;
      });

      // Set the updated data back into the state
      setUserData(updatedUserData);
    } catch (error) {
      console.error("Error updating mobile number:", error);
    }
  };

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleClickOpen = (userId) => {
    setSelectedUserId(userId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDelete = (userId) => {
    UserDelete(userId);
    handleCloseDialog();
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
                  User List
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <TextField
                  label="Search Users"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  sx={{ mb: 3 }}
                />
                {userData.length === 0 ? (
                  <p style={{ textAlign: "center", fontWeight: "500", paddingBottom: "10px" }}>
                    No Data Found
                  </p>
                ) : (
                  <>
                    <DataTable
                      table={{
                        columns: [
                          { Header: "Name", accessor: "author", width: "10%", align: "left" },
                          { Header: "E-Mail", accessor: "E_Mail", align: "left" },
                          { Header: "Mobile", accessor: "Mobile", align: "left" },
                          { Header: "Pincode", accessor: "Pincode", align: "left" },
                          { Header: "Created", accessor: "created", align: "center" },
                          { Header: "Active", accessor: "action", align: "center" },
                        ],
                        rows: userData.map((user) => ({
                          author: (
                            <MDBox
                              display="flex"
                              alignItems="center"
                              lineHeight={1}
                              sx={{ cursor: "pointer" }}
                              className="admin_user_list_name"
                            >
                              <MDAvatar
                                src={user.pic}
                                name={user.full_name}
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
                                {user.full_name}
                              </MDTypography>
                            </MDBox>
                          ),
                          E_Mail: user.email,
                          Mobile: (
                            <div>
                              <TextField
                                id={`mobile-${user._id}`}
                                label="Mobile Update"
                                type="number"
                                variant="outlined"
                                value={user.mobile}
                                onChange={(event) => handleMobileChange(event, user._id)}
                                inputProps={{ maxLength: 10 }}
                              />
                              <Button
                                sx={{ marginLeft: "5px", marginTop: "5px", color: "#fff" }}
                                size="small"
                                variant="contained"
                                max
                                onClick={() => handleMobileUpdate(user._id, user.mobile)}
                              >
                                Update
                              </Button>
                            </div>
                          ),
                          Pincode: user.Pincode,
                          created: (
                            <MDTypography
                              component="a"
                              href="#"
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
                            >
                              <FormGroup>
                                <IconButton
                                  onClick={() => handleClickOpen(user._id)}
                                  aria-label="delete"
                                >
                                  <DeleteIcon />
                                </IconButton>

                                <Dialog
                                  open={open}
                                  onClose={handleCloseDialog}
                                  aria-labelledby="delete-dialog-title"
                                >
                                  <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
                                  <DialogContent>
                                    <DialogContentText>
                                      Are you sure you want to delete this user?
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleCloseDialog} color="primary">
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => handleDelete(selectedUserId)}
                                      color="secondary"
                                      autoFocus
                                    >
                                      Confirm Delete
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </FormGroup>
                            </MDTypography>
                          ),
                        })),
                      }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      showFirstButton
                      showLastButton
                      sx={{ mt: 3, mb: 3 }}
                    />
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
