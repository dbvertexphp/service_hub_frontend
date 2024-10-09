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
import { Payment } from "@mui/icons-material";

// Data

function Tables() {
  const navigate = useNavigate();
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

  const fetchData = async () => {
    try {
      const response = await Api.getMasterAndAdvancePayments();

      if (response && response.payments && Array.isArray(response.payments)) {
        const datas = response.payments;
        // Modify the data here to match the new structure

        const modifiedData = datas.map((user) => {
          return {
            _id: user._id,
            Payment: user.Payment,
            Type: user.Type,
            CreatedAt: user.createdAt,
            UpdatedAt: user.updatedAt,
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
      title="Payment Update"
      content={"Payment Update Successfully"}
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

  const handleUpdate = async (field, value, id, type) => {
    console.log(field);
    try {
      const updatedData = {
        id: id,
        [type]: value,
      };

      let response;

      // Use type parameter to dynamically choose the API endpoint
      if (type === "master") {
        response = await Api.updateMasterPayment(updatedData);
      } else if (type === "advance") {
        response = await Api.updateAdvancePayment(updatedData);
      } else {
        console.error("Invalid payment type:", type);
        return;
      }

      if (response && response.status === true) {
        openSuccessSB();
        fetchData(newPage, searchText, Short); // Assuming these are defined elsewhere
      } else {
        console.error("Failed to update payment:", response.errors);
      }
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  console.log(userData);

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
                  Payments List
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
                            { Header: "Payment", accessor: "Payment", align: "left" },
                            { Header: "Type", accessor: "Type", align: "left" },
                            { Header: "CreatedAt", accessor: "CreatedAt", align: "center" },
                            { Header: "UpdatedAt", accessor: "UpdatedAt", align: "center" },
                          ],
                          rows: userData.map((user) => ({
                            Payment: (
                              <div>
                                <TextField
                                  id={`advance-${user._id}`}
                                  label={user.Type}
                                  type="number"
                                  variant="outlined"
                                  value={user.Payment}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    setUserData((prevData) =>
                                      prevData.map((prevUser) => {
                                        if (prevUser._id === user._id) {
                                          return {
                                            ...prevUser,
                                            Payment: newValue,
                                          };
                                        }
                                        return prevUser;
                                      })
                                    );
                                  }}
                                />
                                <Button
                                  sx={{ marginLeft: "5px", marginTop: "5px", color: "#fff" }}
                                  size="small"
                                  variant="contained"
                                  onClick={() =>
                                    handleUpdate("advance", user.Payment, user._id, user.Type)
                                  }
                                >
                                  Update
                                </Button>
                              </div>
                            ),
                            // Master: (
                            //   <div>
                            //     <TextField
                            //       id={`master-${user._id}`}
                            //       label="Master Update"
                            //       type="number"
                            //       variant="outlined"
                            //       value={user.Master}
                            //       onChange={(e) => {
                            //         const newValue = e.target.value;
                            //         setUserData((prevData) =>
                            //           prevData.map((prevUser) => {
                            //             if (prevUser._id === user._id) {
                            //               return {
                            //                 ...prevUser,
                            //                 Master: newValue,
                            //               };
                            //             }
                            //             return prevUser;
                            //           })
                            //         );
                            //       }}
                            //     />
                            //     <Button
                            //       sx={{ marginLeft: "5px", marginTop: "5px", color: "#fff" }}
                            //       size="small"
                            //       variant="contained"
                            //       onClick={() => handleUpdate("master", user.Master, user._id)}
                            //     >
                            //       Update
                            //     </Button>
                            //   </div>
                            // ),
                            Type: (
                              <MDTypography
                                component="a"
                                href="#"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.Type}
                              </MDTypography>
                            ),

                            CreatedAt: (
                              <MDTypography
                                component="a"
                                href="#"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.CreatedAt}
                              </MDTypography>
                            ),
                            UpdatedAt: (
                              <MDTypography
                                component="a"
                                href="#"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.UpdatedAt}
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
