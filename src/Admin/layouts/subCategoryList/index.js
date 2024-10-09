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
const base_url = process.env.REACT_APP_BASE_URL;
import EditSubCategory from "../components/editsubcategory";

function SubCategoryList() {
  const navigate = useNavigate();
  const { category_id } = useParams();
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
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState("");
  const [showModel, setShowModel] = useState(false);

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
      const response = await Api.getSubCategoryByCategoryIdInAdmin(category_id);
      console.log(response.subcategories);
      if (response && response.subcategories && Array.isArray(response.subcategories)) {
        const datas = response.subcategories;
        const modifiedData = datas.map((user) => {
          return {
            subcategory_id: user.subcategory_id,
            subcategory_image: user.subcategory_image,
            subcategory_name: user.subcategory_name,
            datetime: user.datetime,
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
  }, [showModel]);

  const editsubcategoryfun = (subcategory_name, subcategory_id, subcategory_image) => {
    setSubCategoryName(subcategory_name);
    setSubCategoryId(subcategory_id);
    setSubCategoryImage(subcategory_image);
    setShowModel(true);
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
                  Sub Category List
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
                        Sub Category List
                      </Typography>
                      <DataTable
                        table={{
                          columns: [
                            {
                              Header: "SubCategoryName",
                              accessor: "SubCategoryName",
                              width: "10%",
                              align: "left",
                            },

                            {
                              Header: "SubCategoryImage",
                              accessor: "SubCategoryImage",
                              align: "left",
                            },
                            { Header: "Datetime", accessor: "Datetime", align: "center" },
                            { Header: "action", accessor: "action", align: "center" },
                          ],
                          rows: userData.map((user) => ({
                            SubCategoryName: (
                              <MDTypography
                                component="a"
                                href="#"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                {user.subcategory_name}
                              </MDTypography>
                            ),
                            SubCategoryImage: (
                              <MDBox display="flex" alignItems="center" lineHeight={1}>
                                <MDBox ml={2} lineHeight={1}>
                                  {user.subcategory_image ? (
                                    <img
                                      src={`${base_url}/${user.subcategory_image}`}
                                      alt="Sub Category Image"
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
                            Datetime: (
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
                                  editsubcategoryfun(
                                    user.subcategory_name,
                                    user.subcategory_id,
                                    user.subcategory_image
                                  )
                                }
                              >
                                Edit
                              </MDTypography>
                            ),
                            editSubCategoryComponent: showModel && (
                              <EditSubCategory
                                onClose={() => setShowModel(false)}
                                subcategory_name={subCategoryName}
                                subcategory_id={subCategoryId}
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
      {showModel && (
        <EditSubCategory
          onClose={() => setShowModel(false)}
          category_id={category_id}
          subcategory_name={subCategoryName}
          subcategory_id={subCategoryId}
          subcategory_image={subCategoryImage}
        />
      )}
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

export default SubCategoryList;
