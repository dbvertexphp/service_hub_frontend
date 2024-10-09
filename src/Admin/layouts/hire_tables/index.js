import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { FormControl, InputLabel, Select } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Typography from "@mui/material/Typography";

// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";
import MDInput from "Admin/components/MDInput";
import MDTypography from "Admin/components/MDTypography";
import MDSnackbar from "Admin/components/MDSnackbar";
import DescriptionModel from "../model/description_model";

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
  const [projectupdatename, setProjectUpdateName] = useState([]);
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
  const [newPage, setNewPage] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setErrors] = useState("");
  const [pagenumberStatusupdate, setPagenumberStatusupdate] = useState("");
  const [updatestatusDialogOpen, setUpdatestatusDialogOpen] = useState(false);
  const [successSB, setSuccessSB] = useState(false);

  const [descriptionsModelShow, setDescriptionsModelShow] = useState(false);
  const [DescriptionsData, setDescriptionsData] = useState("");
  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const fetchData = async (page, search) => {
    try {
      const response = await Api.getAllHire(page, search);
      if (response && response.Hires.data && Array.isArray(response.Hires.data)) {
        const datas = response.Hires.data;
        // Modify the data here to match the new structure
        const modifiedData = datas.map((user) => {
          setTotal_rows(response.Hires.total);
          setFirstpageurl(response.Hires.first_page_url);
          setFrom(response.Hires.from);
          setLastpage(response.Hires.last_page);
          setLastpageurl(response.Hires.last_page_url);
          setLinks(response.Hires.links);
          setNextpageurl(response.Hires.next_page_url);
          setPath(response.Hires.path);
          setPer_page(response.Hires.per_page);
          setPrevpageurl(response.Hires.prev_page_url);
          setTotal(response.Hires.total);
          setCurrentpage(response.Hires.current_page);
          return {
            _id: user._id,
            amount: user.amount,
            datetime: user.datetime,
            Payment_status: user.Payment_status,

            work_status_id: user.work_status._id,
            work_status_payment_status: user.work_status.payment_status,

            user_id_id: user.user_id._id,
            user_id_username: user.user_id.username,

            hire_id_id: user.hire_id._id,
            hire_id_username: user.hire_id.username,
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

  const [selectedValue, setSelectedValue] = React.useState(""); // Set your default value here

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

  const handlePageChange = (newPage) => {
    setUserData([]);
    setPagenumberStatusupdate(newPage);
    setNewPage(newPage);
    // fetchData(newPage, searchText);
  };

  useEffect(() => {
    fetchData(newPage, searchText);
    //fetchStatus();
  }, [searchText, newPage]);

  const handleClose = () => {
    setDescriptionsModelShow(false);
  };
  const descriptionShow = (description) => {
    setDescriptionsModelShow(true);
    setDescriptionsData(description);
  };

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Payment Status Update"
      content={"Payment Status Update Successfully"}
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

  const HirePaymentUpdateStatus = async (hireId) => {
    try {
      const response = await Api.HirePaymentUpdateStatus(hireId);
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
                  Hire List
                </MDTypography>
              </MDBox>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                <div>
                  <MDBox pt={1} pr={1}>
                    <MDInput
                      label="Search here"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={() => handlePageChange(newPage, search)}
                    />
                  </MDBox>
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
                            { Header: "Hire", accessor: "Hire", align: "left" },
                            { Header: "Hired", accessor: "Hired", align: "left" },
                            { Header: "Amount", accessor: "Amount", align: "left" },
                            { Header: "Work Status ", accessor: "work_status", align: "left" },
                            { Header: "Created", accessor: "created", align: "center" },
                            {
                              Header: "Hired Paid Status",
                              accessor: "Hired_Paid_Status",
                              align: "center",
                            },
                          ],
                          rows: userData.map((user) => ({
                            Hire: user.user_id_username,
                            Hired: user.hire_id_username,
                            Amount: user.amount,
                            work_status: user.work_status_payment_status,
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
                            Hired_Paid_Status: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                              >
                                <FormGroup className="">
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        defaultChecked={user.Payment_status == "Paid"}
                                        onChange={(event) => HirePaymentUpdateStatus(user._id)}
                                        inputProps={{ "aria-label": "controlled" }}
                                      />
                                    }
                                    label="Paid"
                                    labelPlacement="start"
                                  />
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
        <DescriptionModel
          descriptionsModelShow={descriptionsModelShow}
          handleClose={handleClose}
          DescriptionsData={DescriptionsData}
        />
      )}
    </DashboardLayout>
  );
}

export default Tables;
