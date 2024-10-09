import React, { useState, useEffect, useRef } from "react";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Box from "@mui/joy/Box";
import { ThemeProvider } from "@mui/joy/styles";
import theme from "assets/theme";
import Grid from "@mui/joy/Grid";
import JoyCard from "@mui/joy/Card";
import JoyBox from "@mui/joy/Box";
import JoyTypography from "@mui/joy/Typography";
import JoyCardContent from "@mui/joy/CardContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarNumber } from "../../Actions/AuthActions";
import { Link } from "react-router-dom";
import createAvatarJoy from "../Utils/avatarUtils_joy";
import { getUserdataCookie, checkCookies } from "cookies";
import AuthModel from "./Authmodel";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { setProfileUrl } from "Actions/UserProfileActions";

function LetestjobHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [thumbnails, setThumbnails] = useState([]);
  const [jobNotFound, setJobNotFound] = useState(false);
  const containerRef = useRef(null);
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const reduxHomePageData = useSelector((state) => state.homepageReducer.HomePageData);
  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment
  const isBelow500px = useMediaQuery("(max-width:500px)");
  const userCookieData = getUserdataCookie("Userdata");

  const ProfileUrl = async (userId) => {
    const profileUrl = await dispatch(setProfileUrl(userId));
    if (profileUrl) {
      navigate(profileUrl);
    } else {
      console.error("Failed to get profile URL.");
    }
  };

  useEffect(() => {
    if (reduxHomePageData && reduxHomePageData.jobList && reduxHomePageData.jobList.data) {
      setThumbnails(reduxHomePageData.jobList.data);
      setJobNotFound(reduxHomePageData.jobList.data.length === 0);
    } else {
      setThumbnails([]);
    }
  }, [reduxHomePageData]);

  const handleButtonClickSidebarNumber = (sibarnumber) => {
    // Dispatch the setNumber action with the desired number
    dispatch(setSidebarNumber(sibarnumber));
  };

  const CheckAuth = async (event) => {
    if (checkCookies()) {
      handleButtonClickSidebarNumber(6);
      navigate("/website-job-list");
    } else {
      setActionType(event);
      setShowModel(true);
    }
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 3000, min: 1800 },
      items: 4,
      slidesToSlide: 3,
    },
    desktop: {
      breakpoint: { max: 1800, min: 1400 },
      items: 3,
      slidesToSlide: 2, // optional, default to 1.
    },
    largedesktop: {
      breakpoint: { max: 1400, min: 1200 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1200, min: 768 },
      items: 4,
      slidesToSlide: 3, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 767, min: 350 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid xs={12} md={12}>
          <JoyCard className="video_home_card" sx={{ mt: 3 }}>
            <JoyBox sx={{ display: "flex", justifyContent: "space-between" }}>
              <JoyTypography level="h3" className="video_home_card_hending">
                Latest Work Requirement
              </JoyTypography>
              <span
                style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                onClick={(event) => {
                  CheckAuth("Job_List");
                }}
              >
                <JoyTypography level="h3" className="video_home_card_hending">
                  {checkCookies() ? (
                    <Link
                      to={`/website-job-list`}
                      onClick={(event) => event.stopPropagation()}
                      className="video_home_card_hending"
                    >
                      See All
                    </Link>
                  ) : (
                    <div
                      onClick={(event) => {
                        CheckAuth("Timeline_List");
                      }}
                      className="video_home_card_hending"
                    >
                      See All
                    </div>
                  )}
                </JoyTypography>
              </span>
            </JoyBox>
            <Carousel
              responsive={responsive}
              autoPlay={false}
              swipeable={true}
              draggable={true}
              showDots={false}
              infinite={false}
              partialVisible={false}
              dotListClass="custom-dot-list-style"
              className="Carousel_slider"
            >
              {thumbnails.length === 0 ? (
                <Box
                  sx={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="error"
                    className="video_home_card_hending_Not_found"
                    sx={{ width: "max-content" }}
                  >
                    Work Not Found
                  </Typography>
                </Box>
              ) : (
                thumbnails.map((thumbnail) => {
                  const avatarComponentDestop = isBelow500px
                    ? createAvatarJoy(
                        thumbnail.user_id.pic,
                        thumbnail.user_id.first_name,
                        thumbnail.user_id.last_name,
                        "HomepageJobmobile"
                      )
                    : createAvatarJoy(
                        thumbnail.user_id.pic,
                        thumbnail.user_id.first_name,
                        thumbnail.user_id.last_name,
                        "headerdesktop"
                      );
                  return (
                    <span
                      style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                      onClick={(event) => {
                        CheckAuth("Job_List");
                      }}
                      key={thumbnail._id}
                    >
                      <JoyCard
                        variant="soft"
                        key={thumbnail._id}
                        sx={{
                          flexGrow: 1,
                          minWidth: isBelow500px ? "92px" : "auto",
                          minHeight: isBelow500px ? "130px" : "150px",
                        }}
                        className="letest_home_card_thumbnail slider_video"
                      >
                        <JoyCardContent>
                          <JoyBox sx={{ display: "flex", alignItems: "center" }}>
                            {checkCookies() ? (
                              <Link
                                to={
                                  userCookieData._id === thumbnail.user_id._id
                                    ? `/website-my-profile-view`
                                    : `/Website-user-profile-view/${thumbnail.user_id._id}`
                                }
                                key={thumbnail._id}
                                onClick={(event) => event.stopPropagation()}
                              >
                                <div style={{ cursor: "pointer" }}>{avatarComponentDestop}</div>
                              </Link>
                            ) : (
                              <div
                                onClick={() => {
                                  ProfileUrl(thumbnail.user_id._id);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {avatarComponentDestop}
                              </div>
                            )}
                            <JoyBox sx={{}}>
                              <div style={{ cursor: "pointer" }}>
                                {checkCookies() ? (
                                  <Link
                                    to={
                                      userCookieData._id === thumbnail.user_id._id
                                        ? `/website-my-profile-view`
                                        : `/Website-user-profile-view/${thumbnail.user_id._id}`
                                    }
                                    key={thumbnail._id}
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    <div style={{ cursor: "pointer" }}>
                                      <JoyTypography
                                        sx={{ marginLeft: "8px" }}
                                        level="title-md"
                                        className="letest_home_card_thumbnail_user_name"
                                      >
                                        {`${thumbnail.user_id.first_name} ${thumbnail.user_id.last_name}`}
                                      </JoyTypography>
                                    </div>
                                  </Link>
                                ) : (
                                  <div
                                    onClick={() => {
                                      ProfileUrl(thumbnail.user_id._id);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <JoyTypography
                                      sx={{ marginLeft: "8px" }}
                                      level="title-md"
                                      className="letest_home_card_thumbnail_user_name"
                                    >
                                      {`${thumbnail.user_id.first_name} ${thumbnail.user_id.last_name}`}
                                    </JoyTypography>
                                  </div>
                                )}
                              </div>
                              <JoyTypography
                                sx={{ marginLeft: "8px" }}
                                level="title-md"
                                className="letest_home_card_thumbnail_category_name"
                              >
                                {thumbnail.category_id.category_name}
                              </JoyTypography>
                            </JoyBox>
                          </JoyBox>
                          <JoyTypography className="letest_home_card_thumbnail_title">
                            {thumbnail.title.length > 20
                              ? `${thumbnail.title.slice(0, 20)}...`
                              : thumbnail.title}
                          </JoyTypography>
                          <JoyTypography className="letest_home_card_thumbnail_desc">
                            {thumbnail.description.length > 45
                              ? `${thumbnail.description.slice(0, 45)}...`
                              : thumbnail.description}
                          </JoyTypography>
                        </JoyCardContent>
                      </JoyCard>
                    </span>
                  );
                })
              )}
            </Carousel>
          </JoyCard>
        </Grid>
        {showModel && (
          <AuthModel
            message={actionType === "Job_List" ? "Sign in to View Job List." : ""}
            heading={actionType === "Job_List" ? "Job List" : ""}
            onClose={() => setShowModel(false)}
          />
        )}
      </Grid>
    </ThemeProvider>
  );
}

export default LetestjobHome;
