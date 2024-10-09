import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Grid, Card, Button } from "@mui/material";
import MDBox from "Admin/components/MDBox";
import MDInput from "Admin/components/MDInput";
import MDTypography from "Admin/components/MDTypography";
import DataTable from "Admin/examples/Tables/DataTable";
import MDPagination from "Admin/components/MDPagination";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import MDSnackbar from "Admin/components/MDSnackbar";
import DescriptionModel from "../model/description_model";
import { Api } from "Api/Api";

function Tables() {
  const [userData, setUserData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [successSB, setSuccessSB] = useState(false);
  const [descriptionsModelShow, setDescriptionsModelShow] = useState(false);
  const [descriptionsData, setDescriptionsData] = useState("");

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage, perPage, searchText);
  };

  const fetchData = async (currentPage, limit, searchText) => {
    console.log(currentPage);
    try {
      const response = await Api.getTeacherPaymentStatuses(currentPage, 10, searchText);
      console.log(response);
      if (response && response.Teachers) {
        setUserData(response.Teachers);
        setTotalRows(response.totalCount);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(currentPage, perPage, searchText);
  }, [currentPage, perPage, searchText]);

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
      title="Project Status Update"
      content="Project Status Update Successfully"
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

  const navigate = useNavigate();

  const handlePaidClick = (teacherId) => {
    navigate(`/teacher-pay-status/${teacherId}`);
  };

  console.log(userData);

  const columns = [
    { Header: "Teacher Id", accessor: "teacher_id" },
    { Header: "Teacher Name", accessor: "teacher_name" },
    { Header: "Total Paid Amount", accessor: "amount" },
    { Header: "Total Remaining Amount", accessor: "Remainingamount" },
    { Header: "Students Total Amount", accessor: "Totalamount" },
    { Header: "Teacher Missing Days", accessor: "MissingDays" },
    { Header: "Remark", accessor: "remark" },
    { Header: "UpdatedAt", accessor: "UpdatedAt" },
    {
      Header: "Paid",
      accessor: "paid",
      Cell: ({ row }) => (
        <Button
          onClick={() => handlePaidClick(row.original.teacher_id)}
          variant="contained"
          color="primary"
          type="submit"
        >
          Pay
        </Button>
      ),
    },
  ];

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
                  Teacher Payment Status
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          fetchData(1, perPage, searchText);
                        }
                      }}
                    />
                  </MDBox>
                </div>
              </div>

              <MDBox pt={3}>
                <MDBox pt={3}>
                  <DataTable
                    table={{
                      columns: columns,
                      rows: userData.map((payment) => ({
                        teacher_id: payment.teacher_id,
                        teacher_name: payment.full_name,
                        amount: payment.totalPaidAmount,
                        Remainingamount: payment.remaining_amount,
                        Totalamount: payment.totalAmount,
                        MissingDays: payment.missingDays,
                        remark: payment.remark,
                        UpdatedAt: payment.payment_datetime,
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
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        <span className="admin_paginetions_iocn">
                          <MdKeyboardArrowLeft />
                        </span>
                      </MDPagination>

                      {Array.from(
                        { length: Math.min(5, totalRows / perPage) },
                        (_, i) => i + 1
                      ).map((pageNumber) => (
                        <MDPagination
                          item
                          key={pageNumber}
                          active={pageNumber === currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </MDPagination>
                      ))}

                      <MDPagination
                        item
                        key="next"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        <span className="admin_paginetions_iocn">
                          <MdKeyboardArrowRight />
                        </span>
                      </MDPagination>
                    </MDPagination>
                  </div>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {renderSuccessSB}
      {descriptionsModelShow && (
        <DescriptionModel
          descriptionsModelShow={descriptionsModelShow}
          handleClose={handleClose}
          DescriptionsData={descriptionsData}
        />
      )}
      <Footer />
    </DashboardLayout>
  );
}

Tables.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      teacher_id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Tables;
