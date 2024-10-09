import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Select, Pagination } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
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
import MDSnackbar from "Admin/components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import DataTable from "Admin/examples/Tables/DataTable";
import MDAvatar from "Admin/components/MDAvatar";
import { Api } from "Api/Api";
import Bankdetails_Model from "../model/bankdetails_model";

// Data

function teacher_tables() {
  const [userData, setUserData] = useState([]);
  const [userUpdatetatus, setUpdateDataStatus] = useState([]);
  const [projectupdateId, setProjectUpdateId] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [error, setErrors] = useState("");
  const [updatestatusDialogOpen, setUpdatestatusDialogOpen] = useState(false);
  const [successSB, setSuccessSB] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [descriptionsModelShow, setDescriptionsModelShow] = useState(false);
  const [DescriptionsData, setDescriptionsData] = useState({});
  const [selectedValue, setSelectedValue] = useState("");

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const fetchData = async (page = 1, searchText = "") => {
    try {
      const response = await Api.getAllSuppliersInAdmin(page, searchText);
      if (response && response.Suppliers && Array.isArray(response.Suppliers)) {
        const modifiedData = response.Suppliers.map((user) => {
          const defaultMobile = user.mobile || "";
          const defaultPincode = user.pin_code || "123456";
          return {
            _id: user._id,
            pic: user.pic,
            full_name: user.full_name,
            email: user.email,
            mobile: defaultMobile,
            pin_code: defaultPincode,
            datetime: user.datetime,
          };
        });
        setUserData(modifiedData);
        setCurrentPage(response.current_page);
        setTotalRows(response.total_rows);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await Api.getMasterAndAdvancePayments();
      console.log(response);
      if (response && response.payments && Array.isArray(response.payments)) {
        const datas = response.payments;
        const modifiedData = datas.map((pay) => {
          return {
            _id: pay._id,
            Payment: pay.Payment,
            Type: pay.Type,
          };
        });
        setPaymentOptions(modifiedData);
      } else {
        console.error("Invalid API response format:", response);
      }
      // setPaymentOptions(response.payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
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

  const handleChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);

    // Extract userId and payment_id from selectedValue
    const [userId, payment_id] = selectedValue.split(" ");

    const updatedData = {
      userId,
      payment_id,
    };

    try {
      const response = await Api.updateUserPayment(updatedData);
      console.log(response); // Log the response for debugging
    } catch (error) {
      console.error("Error updating user payment:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchText);
    fetchPayments();
  }, [currentPage, searchText]);

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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchData(value, searchText);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    fetchData(1, value); // Trigger search with the current input value
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
                  Supplier List
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
                ></div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "auto",
                  }}
                ></div>
              </div>
              <MDBox pt={3}>
                <TextField
                  variant="outlined"
                  placeholder="Search Suppliers"
                  value={searchText}
                  onChange={handleSearchChange}
                  style={{ padding: "10px" }}
                />
                {/* Rest of the component */}
              </MDBox>
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

                            { Header: "E-Mail", accessor: "E_Mail", align: "left" },
                            { Header: "Mobile", accessor: "Mobile", align: "left" },
                            { Header: "Pincode", accessor: "Pincode", align: "left" },
                            { Header: "Created", accessor: "created", align: "center" },
                          ],
                          rows: userData.map((user) => ({
                            author: (
                              <Link
                                to={`/teacher-course-details/${user._id}`}
                                style={{ textDecoration: "underline !important" }}
                              >
                                <MDBox
                                  display="flex"
                                  alignItems="center"
                                  lineHeight={1}
                                  // onClick={() => handleProfileRedirect(user._id)}
                                  sx={{ cursor: "pointer" }}
                                  className="admin_user_list_name"
                                  color="#1A73E8"
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
                                    color="#1A73E8"
                                  >
                                    {user.full_name}
                                  </MDTypography>
                                </MDBox>
                              </Link>
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
                                />

                                <Button
                                  sx={{ marginLeft: "5px", marginTop: "5px", color: "#fff" }}
                                  size="small"
                                  variant="contained"
                                  onClick={() => handleMobileUpdate(user._id, user.mobile)}
                                >
                                  Update
                                </Button>
                              </div>
                            ),
                            Pincode: user.pin_code,

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

                            Payment: (
                              <MDTypography>
                                <Select value={selectedValue} onChange={handleChange} displayEmpty>
                                  <MenuItem value="">Select Payment Option</MenuItem>
                                  {paymentOptions.map((pay, index) => (
                                    <MenuItem
                                      key={`${index}`}
                                      selected={selectedValue === `${user._id} ${pay._id}`}
                                      value={`${user._id} ${pay._id}`}
                                    >
                                      {`${pay.Type} ${pay.Payment}`}
                                    </MenuItem>
                                  ))}
                                </Select>
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
                        count={Math.ceil(totalRows / rowsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "10px",
                          marginBottom: "10px",
                        }}
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

export default teacher_tables;
