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
import { useNavigate, Link } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";
import MDInput from "Admin/components/MDInput";
import MDTypography from "Admin/components/MDTypography";
import MDSnackbar from "Admin/components/MDSnackbar";
import DescriptionModel from "../model/description_model";
const base_url = process.env.REACT_APP_BASE_URL;

// Material Dashboard 2 React example components
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import DataTable from "Admin/examples/Tables/DataTable";
import MDPagination from "Admin/components/MDPagination";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

Tables.propTypes = {
  transactionList: PropTypes.array,
  handlePageChangedata: PropTypes.func,
  handleSreachChangedata: PropTypes.func,
};

// Data

function Tables({ transactionList, handlePageChangedata, handleSreachChangedata }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [userDataStatus, setUserDataStatus] = useState([]);
  const [userUpdatetatus, setUpdateDataStatus] = useState([]);
  const [projectupdateId, setProjectUpdateId] = useState([]);
  const [projectupdatename, setProjectUpdateName] = useState([]);
  const [first_page_url, setFirstpageurl] = useState("");
  const [from, setFrom] = useState("");
  const [last_page, setLastpage] = useState("");
  const [last_page_url, setLastpageurl] = useState("");
  const [links, setLinks] = useState("");
  const [page, setPage] = useState("");
  const [total, setTotal] = useState("");
  const [next_page_url, setNextpageurl] = useState("");
  const [path, setPath] = useState("");
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

  const [isLoading, setIsLoading] = useState(true);

  if (!transactionList) {
    return <div>Loading...</div>;
  }

  if (!transactionList.data) {
    return <div>No data found.</div>;
  }
  const per_page = transactionList.per_page;
  const current_page = transactionList.current_page;
  const total_rows = transactionList.total_rows;
  const totalPages = Math.ceil(total_rows / per_page);
  const maxPageNumbers = 5;
  const currentPage = current_page; // Example: Replace with your current page
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const handleClose = () => {
    setDescriptionsModelShow(false);
  };

  const handlePageChange = (newPage) => {
    handlePageChangedata(newPage);
  };

  const handleSearchPageChange = (searchTexts) => {
    handleSreachChangedata(searchTexts);
  };

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Project Status Update"
      content={projectupdatename + " Project Status Update Successfully"}
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
                  Transaction List
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
                      onKeyUp={(e) => handleSearchPageChange(e.target.value)}
                    />
                  </MDBox>
                </div>
              </div>

              <MDBox pt={3}>
                <MDBox pt={3}>
                  <>
                    <DataTable
                      table={{
                        columns: [
                          { Header: "student_name", accessor: "student_name", align: "left" },
                          { Header: "teacher_name", accessor: "teacher_name", align: "left" },
                          { Header: "course_title", accessor: "course_title", align: "left" },
                          { Header: "Amount ", accessor: "amount", align: "left" },
                          { Header: "Created", accessor: "created", align: "center" },
                        ],
                        rows: transactionList.data.map((user) => ({
                          student_name: user.user_id.full_name,
                          teacher_name: user.teacher_id.full_name,
                          course_title: user.course_id ? user.course_id.title : null,
                          amount: user.amount,
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
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {renderSuccessSB}
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
