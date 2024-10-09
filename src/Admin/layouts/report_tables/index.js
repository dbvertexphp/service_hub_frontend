import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";
import MDInput from "Admin/components/MDInput";
import MDTypography from "Admin/components/MDTypography";
import MDSnackbar from "Admin/components/MDSnackbar";
import DescriptionModel from "../model/description_model";
const base_url = process.env.REACT_APP_BASE_URL;
import Switch from "@mui/material/Switch";

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
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

// Data

function Tables() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [userDataStatus, setUserDataStatus] = useState([]);
  const [userUpdatetatus, setUpdateDataStatus] = useState([]);
  const [projectupdateId, setProjectUpdateId] = useState([]);
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

  const handlePageChange = (newPage, searchText) => {
    setPagenumberStatusupdate(newPage);
    setUserData([]);
    fetchData(newPage, searchText);
  };

  const fetchData = async (page, searchText) => {
    try {
      const response = await Api.getAllReports(page, searchText);
      if (response && response.Reports.data && Array.isArray(response.Reports.data)) {
        const datas = response.Reports.data;
        // Modify the data here to match the new structure
        const modifiedData = datas.map((user) => {
          setTotal_rows(response.Reports.total);
          setFirstpageurl(response.Reports.first_page_url);
          setFrom(response.Reports.from);
          setLastpage(response.Reports.last_page);
          setLastpageurl(response.Reports.last_page_url);
          setLinks(response.Reports.links);
          setNextpageurl(response.Reports.next_page_url);
          setPath(response.Reports.path);
          setPer_page(response.Reports.per_page);
          setPrevpageurl(response.Reports.prev_page_url);
          setTotal(response.Reports.total);
          setCurrentpage(response.Reports.current_page);
          return {
            _id: user._id,
            description: user.description,
            title: user.title,
            report_type: user.report_type,
            datetime: user.createdAt,
            user_id_id: user.user_id._id,
            user_id_username: user.user_id.username,
            type_id_user_id_username: user.type_id.user_id.username,
            type_id_active: user.type_id.deleted_at,
            type_id_id: user.type_id._id,
            type_id_title: user.type_id.title,
            type_id_share_Id: user.type_id.share_Id,
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

  useEffect(() => {
    fetchData(newPage, searchText);
    //fetchStatus();
  }, []);

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
      title="Status Update"
      content={"Status Update Successfully"}
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

  const VideoAdminStatusUpdate = async (videoId, type) => {
    try {
      let response;
      if (type == "video") {
        response = await Api.VideoAdminStatus(videoId);
      } else if (type == "reels") {
        response = await Api.ReelsAdminStatus(videoId);
      } else if (type == "timeline") {
        response = await Api.TimelineAdminStatus(videoId);
      }
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
      <MDBox pt={6} pb={3} style={{ height: "85vh" }}>
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
                  Report List
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
                      onKeyDown={() => handlePageChange(newPage, searchText)}
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
                            { Header: "Title", accessor: "Title", align: "left" },
                            { Header: "Description", accessor: "Description", align: "left" },

                            { Header: "Url", accessor: "Url", align: "center" },

                            {
                              Header: "Report By Username",
                              accessor: "Reporter_by_Username",
                              align: "center",
                            },
                            {
                              Header: "Reported Username",
                              accessor: "Reporter_Username",
                              align: "center",
                            },
                            { Header: "Created", accessor: "created", align: "center" },
                            { Header: "Active", accessor: "action", align: "center" },
                          ],
                          rows: userData.map((user) => ({
                            Title: user.title,
                            Description: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                color="text"
                                fontWeight="medium"
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                  descriptionShow(user.description);
                                }}
                              >
                                {user.description.length > 15
                                  ? `${user.description.slice(0, 15)}...`
                                  : user.description}
                              </MDTypography>
                            ),

                            Url: (
                              <MDTypography
                                component="a"
                                href={
                                  user.report_type === "video"
                                    ? `/website-video-comment/${user.type_id_id}`
                                    : user.report_type === "reels"
                                    ? `/website-reels-list/${user.type_id_share_Id}`
                                    : user.report_type === "timeline"
                                    ? `/website-timeline-comment/${user.type_id_id}`
                                    : ""
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="caption"
                                color="textPrimary"
                                fontWeight="medium"
                                style={{ color: "#0000EE", textDecoration: "none" }}
                              >
                                {user.report_type === "video"
                                  ? `${base_url}/website-video-comment/${user.type_id_id}`.substring(
                                      0,
                                      30
                                    )
                                  : user.report_type === "reels"
                                  ? `${base_url}/website-reels-list/${user.type_id_share_Id}`.substring(
                                      0,
                                      30
                                    )
                                  : user.report_type === "timeline"
                                  ? `${base_url}/website-timeline-comment/${user.type_id_id}`.substring(
                                      0,
                                      30
                                    )
                                  : ""}
                              </MDTypography>
                            ),

                            Reporter_by_Username: user.user_id_username,
                            Reporter_Username: user.type_id_user_id_username,
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
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        defaultChecked={user.type_id_active == null}
                                        onChange={(event) =>
                                          VideoAdminStatusUpdate(user.type_id_id, user.report_type)
                                        }
                                        inputProps={{ "aria-label": "controlled" }}
                                      />
                                    }
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
