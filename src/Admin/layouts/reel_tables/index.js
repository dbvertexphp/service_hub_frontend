import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
const base_url = process.env.REACT_APP_BASE_URL;
import DescriptionModel from "../model/description_model";

// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";
import MDInput from "Admin/components/MDInput";
import MDTypography from "Admin/components/MDTypography";
import MDSnackbar from "Admin/components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "Admin/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "Admin/examples/Navbars/DashboardNavbar";
import Footer from "Admin/examples/Footer";
import DataTable from "Admin/examples/Tables/DataTable";
import MDPagination from "Admin/components/MDPagination";
import Icon from "@mui/material/Icon";
import { Api } from "Api/Api";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormControl, InputLabel, Select } from "@mui/material";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

// Data

function Tables() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
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
    fetchData(newPage, searchText);
  };

  const handlePageChangesreach = (newPage) => {
    setUserData([]);
    setPagenumberStatusupdate(newPage);
  };

  useEffect(() => {
    fetchData(newPage, searchText, Short);
  }, [searchText, newPage, Short]);

  const fetchData = async (page, search, Short) => {
    try {
      const response = await Api.getAllReels(page, search, Short);
      if (response && response.Reels.data && Array.isArray(response.Reels.data)) {
        const datas = response.Reels.data;
        // Modify the data here to match the new structure
        const modifiedData = datas.map((user) => {
          setTotal_rows(response.Reels.total);
          setFirstpageurl(response.Reels.first_page_url);
          setFrom(response.Reels.from);
          setLastpage(response.Reels.last_page);
          setLastpageurl(response.Reels.last_page_url);
          setLinks(response.Reels.links);
          setNextpageurl(response.Reels.next_page_url);
          setPath(response.Reels.path);
          setPer_page(response.Reels.per_page);
          setPrevpageurl(response.Reels.prev_page_url);
          setTotal(response.Reels.total);
          setCurrentpage(response.Reels.current_page);
          return {
            _id: user._id,
            share_Id: user.share_Id,
            thumbnail_name: user.thumbnail_name,
            view_count: user.view_count,
            comment_count: user.comment_count,
            title: user.title,
            description: user.description,
            video_url: user.video_url,
            deleted_at: user.deleted_at,
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

  const totalPages = Math.ceil(total_rows / per_page);
  const maxPageNumbers = 5;
  const currentPage = current_page; // Example: Replace with your current page
  const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
  const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Reels Status Update"
      content={"Reels Status Update Successfully"}
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

  const VideoAdminStatusUpdate = async (reelsId) => {
    try {
      const response = await Api.ReelsAdminStatus(reelsId);
      if (response) {
        setSuccessSB(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleClose = () => {
    setDescriptionsModelShow(false);
  };
  const descriptionShow = (description) => {
    setDescriptionsModelShow(true);
    setDescriptionsData(description);
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
                  Quicky List
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

                          <MenuItem value="view_count">View Count</MenuItem>
                          <MenuItem value="comment_count">Comment Count</MenuItem>
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
                    <MDBox pt={1} pr={1}>
                      <MDInput
                        label="Search here"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={() => handlePageChangesreach(newPage, search)}
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
                              Header: "Thumbnail",
                              accessor: "author",
                              width: "10%",
                              align: "left",
                            },
                            { Header: "Title", accessor: "Title", align: "left" },
                            { Header: "View Count", accessor: "View_Count", align: "center" },
                            { Header: "Comment Count", accessor: "Comment_Count", align: "center" },
                            { Header: "Description", accessor: "Description", align: "left" },
                            { Header: "Url", accessor: "Url", align: "center" },
                            { Header: "Active", accessor: "action", align: "center" },
                          ],
                          rows: userData.map((user) => ({
                            author: (
                              <MDBox display="flex" alignItems="center" lineHeight={1}>
                                <img src={user.thumbnail_name} width="100" height="50" />
                              </MDBox>
                            ),
                            Title: user.title && user.title.slice(0, 30),
                            View_Count: (
                              <Link to={`/view-count-list/${user._id}/Quicky`}>
                                {user.view_count}
                              </Link>
                            ),
                            Comment_Count: user.comment_count,
                            Description: (
                              <MDTypography
                                component="a"
                                variant="caption"
                                sx={{ cursor: "pointer" }}
                                color="text"
                                fontWeight="medium"
                                onClick={() => {
                                  descriptionShow(user.description);
                                }}
                              >
                                {user.description && user.description.slice(0, 30)}{" "}
                                {user.description && user.description.length > 30 ? "..." : ""}{" "}
                              </MDTypography>
                            ),
                            Url: (
                              <MDTypography
                                component="a"
                                href={`/website-reels-list/${user.share_Id}`}
                                target="_blank" // Target attribute se link ek naye tab mein khulega
                                rel="noopener noreferrer" // Security reasons ke liye rel attribute add kiya gaya hai
                                variant="caption"
                                color="textPrimary"
                                fontWeight="medium"
                                style={{ color: "#0000EE", textDecoration: "none" }} // Link underline remove karne ke liye
                              >
                                {`${base_url}/website-reels-list/${user.share_Id}`}
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
                                        defaultChecked={user.deleted_at == null}
                                        onChange={(event) => VideoAdminStatusUpdate(user._id)}
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
