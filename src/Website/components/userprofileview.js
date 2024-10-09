import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import VideoCard from "Website/components/video_card";
import { debounce } from "lodash";
import TimelineCard from "Website/components/timeline_card";
import ReelCard from "Website/components/reel_card";
import { getUserdataCookie, checkCookies } from "cookies";
import { WebsiteApi } from "Api/WebsiteApi";
import Backbutton from "./Backbutton.js";
import ReelsSkeleton from "../Skeleton/reels_skeleton";
import Category from "Website/components/category";
import PropTypes from "prop-types";
import { CiFilter } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import useMediaQuery from "@mui/material/useMediaQuery";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import { ThemeProvider } from "@mui/joy/styles";
import { useSelector, useDispatch } from "react-redux";
import { setCategory_id } from "Actions/CategoryActions";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { set_BackButtonReel } from "Actions/UserActivity";
import {
  Typography,
  Card,
  Avatar,
  Stack,
  Badge,
  Grid,
  Paper,
  Button,
  Snackbar,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { deepOrange } from "@mui/material/colors";
import { IoMdAddCircle } from "react-icons/io";
import Sub_icon from "../../assets/website_img/sub_icon.svg";
import Reting_icon from "../../assets/website_img/reting.svg";
import Chat_Profile_icon from "../../assets/website_img/chat_profile_icon.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModel from "./Authmodel";
import { setChatId } from "../../Actions/ChatActions.js";
import VideoSkeleton from "../Skeleton/video_skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import Reviews_model from "../model_components/reviews_Model";

const MyProfileView = ({ user_id }) => {
  const dispatch = useDispatch();
  const [openfriendrequest, setFriendRequest] = React.useState(false);
  const [openfriendrequestMessage, setFriendRequestMessage] = React.useState("");
  const [selectedFilter, setSelectedFilter] = useState("Video");
  const navigate = useNavigate();
  const [videoList, setVideoList] = useState([]);
  const [reelslist, SetReelsList] = useState({ data: [] });
  const [timelineList, SetTimelineList] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scrollHandled, setScrollHandled] = useState(false);
  const [pageNumberReels, setPageNumberReels] = useState(1);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [title, setTitle] = useState(""); // Set your default title
  const [reviewId, setReviewId] = useState(""); // Set your default share URL

  const [getUserdata, setGetUserdata] = useState({});
  const [avatarSrc, setAvatarSrc] = useState("");
  const [isDefaultPic, setIsDefaultPic] = useState(true);
  const [isReelsView, setReelsView] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [margintop, setMarginTop] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [reelscategory, setReelsCategory] = useState(false);
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const reduxboxclosestatus = useSelector((state) => state.userActivity.boxclosestatus);
  const isBelow500px = useMediaQuery("(max-width:500px)");
  const [handleArrowClickArrow, setHandleArrowClick] = useState("");
  const [handleArrowClickArrowNumber, setHandleArrowClickNumber] = useState(0);
  const [eventName, setEventName] = useState("Video");
  const reduxcomments_box_status = useSelector((state) => state.userActivity.comments_box_status);

  useEffect(() => {
    setIsSheetOpen(reduxboxclosestatus);
  }, [reduxboxclosestatus]); // I

  useEffect(() => {
    getUserView(user_id);
    if (isReelsView) {
      if (eventName == "Video") {
        fetchDataVideo(user_id, pageNumber);
      } else {
        fetchDataTimline(user_id, pageNumber);
      }
    }
  }, [pageNumber, user_id]);

  const handleVideoChange = (index) => {
    setCurrentVideoIndex(index);
  };

  const handleScrollData = () => {
    if (hasMore) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFriendRequest(false);
  };

  const CheckAuth = async (event, userId) => {
    if (checkCookies()) {
      if (event === "Chat") {
        const chatId = await dispatch(setChatId(userId));
        navigate(`/website-chat/${chatId}`);
      } else if (event === "Hire") {
        navigate(`/website-hire/${userId}`);
      } else if (event === "Add_friend") {
        try {
          const response = await WebsiteApi.Sendfriendrequest(user_id);
          if (response && response.status) {
            // Update the user data to reflect the change in Friend_status
            setGetUserdata((prevUserData) => ({
              ...prevUserData,
              Friend_status: "Pending",
            }));
            setFriendRequest(true);
            setFriendRequestMessage("Friend Request Sent Successfully!");
          } else {
            console.error("Invalid API response format:", response);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    } else {
      setActionType(event);
      // Show the model only when the user is not a friend or the friend request is pending
      if (getUserdata.Friend_status === "No" || getUserdata.Friend_status === "Pending") {
        setShowModel(true);
      }
    }
  };

  const getUserView = async (user_id) => {
    try {
      const response = await WebsiteApi.getUserView(user_id);

      if (response && response.status && response.user) {
        setGetUserdata(response.user);
        setIsDefaultPic(response.user.pic.includes("defult_pic.jpg"));
        setAvatarSrc(response.user.pic);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleChangeFillter = (event) => {
    setSelectedFilter(event.target.value);
    if (event.target.value == "Video") {
      setVideoList([]);
      setPageNumber(1);
      setEventName("Video");
      fetchDataVideo(user_id, pageNumber);
      setReelsView(true);
    } else if (event.target.value == "Reel") {
      dispatch(set_BackButtonReel(1));
      setPageNumberReels(1);
      setEventName("Reel");
      fetchDataReel(user_id);
      setReelsView(false);
    } else {
      SetTimelineList([]);
      setPageNumber(1);
      setEventName("Post");
      fetchDataTimline(user_id, pageNumber);
      setReelsView(true);
    }
  };

  const handleCarouselIndexChange = (index) => {
    setPageNumberReels((prevReelsId) => prevReelsId + 1); // Increment by 2
  };

  const fetchDataReel = async (user_id) => {
    try {
      const number = pageNumberReels;
      let response;

      // Reels ko fetch karte samay user_id ka istemal karein
      response = await WebsiteApi.getUserReels(user_id, number);

      if (response && response.status && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          console.log("No more data to fetch. Clearing interval.");
          clearInterval(interval.current);
          return;
        }
        // Naye data ko state mein jodne ke liye SetReelsList ka istemal karein
        SetReelsList((prevData) => ({ data: [...prevData.data, ...response.data] }));
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const interval = useRef(null);

  const fetchDataVideo = async (user_id, pageNumber) => {
    try {
      const response = await WebsiteApi.getUserVideos(user_id, pageNumber);

      if (response && response.status && Array.isArray(response.data)) {
        setVideoList((prevVideos) => [...prevVideos, ...response.data]);
        setHasMore(response.data.length > 0 && response.hasMore); // Assuming your API response has a 'hasMore' property
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched (whether success or failure)
    }
  };
  const fetchDataTimline = async (user_id, pageNumber) => {
    try {
      const response = await WebsiteApi.getUserTimeline(user_id, pageNumber);

      if (response && response.status && Array.isArray(response.data)) {
        SetTimelineList((prevTimeline) => [...prevTimeline, ...response.data]);
        setHasMore(response.data.length > 0 && response.hasMore);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleChatClick = async (userId) => {
  //   try {
  //     const chatId = await dispatch(setChatId(userId));
  //     // Redirect to the specified URL
  //     //history.push(`/website-chat/${chatId}`);
  //   } catch (error) {
  //     console.error("Error creating chat:", error);
  //   }
  // };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important;",
    borderRadius: "50px",
    border: "1px solid #f3f3f3",
    padding: theme.spacing(1),
    marginBottom: "20px",
    marginTop: "20px",
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  const ProfileItem = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    marginBottom: "0px",
    marginTop: "0px",
    textAlign: "center",
    boxShadow:
      "0px 2px 1px -1px rgb(0 0 0 / 0%), 0px 1px 1px 0px rgb(0 0 0 / 0%), 0px 1px 3px 0px rgb(0 0 0 / 0%)",
  }));

  const handleReview = async (video_id, title) => {
    setTitle(title);
    setReviewId(video_id);
    setShowReviewModal(true);
  };
  const handleClose = () => {
    setShowReviewModal(false);
  };

  const acceptAndRemoveClubRequest = async () => {
    try {
      const sender_id = user_id;
      const club_id = user_id;
      const type = "Friend_Request";
      const status = 1;
      const notificetionData = await WebsiteApi.getNotificationId(sender_id, type);
      const notificetion_id = notificetionData.notificetion_id;
      const response = await WebsiteApi.AcceptClubRequest(club_id, status, notificetion_id);
      if (response && response.status) {
        setGetUserdata((prevUserData) => ({
          ...prevUserData,
          Friend_status: "Yes",
        }));
        setFriendRequest(true);
        setFriendRequestMessage("Club request was Accpet!");
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCategory = () => {
    if (!margintop) {
      setMarginTop(true);
    } else {
      setMarginTop(false);
    }
    if (!reelscategory) {
      setReelsCategory(true);
    } else {
      setReelsCategory(false);
    }
  };

  const handleClickAnywhere = () => {
    setIsSheetOpen(false); // Close the Sheet when user clicks anywhere on the screen
  };

  const handleCategorybyReelsClick = (categoryId, category_name) => {
    if (category_name === "All") {
      setSelectedCategory(categoryId);
      const categoryIds = null;
      dispatch(setCategory_id(categoryIds));
    } else {
      setSelectedCategory(categoryId);
      dispatch(setCategory_id(categoryId));
    }
  };

  const handleArrowClickInternal = (direction) => {
    if (direction === "up") {
      const handleArrowNumberUpdate = handleArrowClickArrowNumber + 1;
      setHandleArrowClickNumber(handleArrowNumberUpdate);
      setHandleArrowClick(`up_${handleArrowNumberUpdate}`);
    } else {
      const handleArrowNumberUpdate = handleArrowClickArrowNumber - 1;
      setHandleArrowClickNumber(handleArrowNumberUpdate);
      setHandleArrowClick(`down_${handleArrowNumberUpdate}`);
    }
  };

  const handleScrollReels = debounce((event) => {
    if (!reduxcomments_box_status) {
      if (!scrollHandled) {
        setScrollHandled(true);
        if (event.deltaY > 0) {
          handleArrowClickInternal("down");
        } else {
          handleArrowClickInternal("up");
        }
        // Reset the flag after a short delay to allow future scrolls
        setTimeout(() => {
          setScrollHandled(false);
        }, 200); // Adjust the delay as per your requirement
      }
    }
  }, 200);

  const handleMouseEnter = () => {
    console.log("handleMouseEnter");
    document.body.style.overflow = "hidden"; // Disable scroll on the entire screen
  };

  const handleMouseLeave = () => {
    console.log("handleMouseLeave");
    document.body.style.overflow = ""; // Enable scroll on the entire screen
  };

  const ChangeBackButtonReels = (events) => {
    handleMouseLeave();
    dispatch(set_BackButtonReel(0));
    setSelectedFilter(events);
    if (events == "Video") {
      setVideoList([]);
      setPageNumber(1);
      setEventName("Video");
      fetchDataVideo(user_id, pageNumber);
      setReelsView(true);
    }
  };

  const interests = getUserdata.interest || [];
  const aboutMe = getUserdata.about_me || "";
  const [showAllInterests, setShowAllInterests] = useState(false);
  const [showFullAboutMe, setShowFullAboutMe] = useState(false);
  const [interestsToShow, setInterestsToShow] = useState([]);
  const [aboutMeToShow, setAboutMeToShow] = useState("");

  useEffect(() => {
    if (showAllInterests) {
      setInterestsToShow(interests);
    } else {
      setInterestsToShow(interests.slice(0, 3));
    }
  }, [showAllInterests, interests]);

  useEffect(() => {
    if (showFullAboutMe) {
      setAboutMeToShow(aboutMe);
    } else {
      setAboutMeToShow(aboutMe.slice(0, 100)); // Adjust the slice length as per requirement
    }
  }, [showFullAboutMe, aboutMe]);

  const toggleInterestsDisplay = () => {
    setShowAllInterests((prevShowAllInterests) => !prevShowAllInterests);
  };

  const toggleAboutMeDisplay = () => {
    setShowFullAboutMe((prevShowFullAboutMe) => !prevShowFullAboutMe);
  };

  return (
    <div>
      {isReelsView ? (
        <Card>
          <div className="back_button_css">
            <Backbutton />
          </div>
          <Stack direction="row" spacing={2}>
            <Grid container spacing={2} sx={{ justifyContent: "center" }}>
              <Grid ProfileItem xs={10}>
                <ProfileItem
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Grid ProfileItem xs={4}>
                    <Button
                      className="profile_view_button"
                      onClick={() => {
                        CheckAuth("Hire", getUserdata._id);
                      }}
                    >
                      HIRE
                    </Button>
                  </Grid>
                  <Grid ProfileItem xs={4}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    >
                      {getUserdata.pic && getUserdata.pic.includes("defult_pic.jpg") ? (
                        <Avatar
                          alt={getUserdata.first_name.charAt(0) + getUserdata.last_name.charAt(0)}
                          sx={{
                            bgcolor: deepOrange[500],
                            width: isBelow500px ? "60px" : "100px",
                            height: isBelow500px ? "60px" : "100px",
                            border: "5px solid #8CF6E3",
                          }}
                        >
                          {getUserdata.first_name.charAt(0)}
                          {getUserdata.last_name.charAt(0)}
                        </Avatar>
                      ) : (
                        <Avatar
                          alt="Travis Howard"
                          src={avatarSrc}
                          sx={{ width: 86, height: 86, border: "5px solid #8CF6E3" }}
                        />
                      )}
                    </Badge>
                  </Grid>
                  <Grid ProfileItem xs={4}>
                    {getUserdata.Friend_status === "No" && (
                      <Button
                        className="profile_view_button profile_view_button_padding"
                        onClick={() => {
                          CheckAuth("Add_friend");
                        }}
                      >
                        ADD FRIEND
                      </Button>
                    )}

                    {getUserdata.Friend_status === "Accept" && (
                      <Button
                        className="profile_view_button profile_view_button_padding"
                        onClick={() => acceptAndRemoveClubRequest()}
                      >
                        Accept
                      </Button>
                    )}

                    {getUserdata.Friend_status === "Pending" && (
                      <Button
                        className="profile_view_button_panding profile_view_button_padding"
                        disabled
                      >
                        SENT REQUEST
                      </Button>
                    )}

                    {getUserdata.Friend_status !== "No" &&
                      getUserdata.Friend_status !== "Pending" &&
                      getUserdata.Friend_status !== "Accept" && (
                        <Button
                          className="profile_view_button profile_view_button_padding_panding"
                          disabled
                        >
                          FRIEND
                        </Button>
                      )}
                  </Grid>
                </ProfileItem>
              </Grid>
            </Grid>
          </Stack>
          <Stack sx={{ alignSelf: "center", marginTop: "0px" }}>
            <Typography className="Profile_name">
              {getUserdata.first_name + " " + getUserdata.last_name}
            </Typography>
          </Stack>
          <Stack sx={{ alignSelf: "center", marginTop: isBelow500px ? "0px" : "10px" }}>
            <Typography className="Profile_username">
              {"( @" + getUserdata.username + " )"}
            </Typography>
          </Stack>
          <Stack>
            <Grid container spacing={2} sx={{ justifyContent: "center" }}>
              <Grid item xs={10} className="">
                <Item
                  sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}
                >
                  <div>
                    <img
                      src={Sub_icon}
                      alt={"sub_icon"}
                      style={{ width: isBelow500px ? "17px" : "26px" }}
                    />
                    <span className="count_network">{getUserdata.subscribe}</span>
                  </div>
                  <div>
                    <img
                      src={Reting_icon}
                      alt={"reting"}
                      style={{
                        width: isBelow500px ? "17px" : "26px",
                        height: isBelow500px ? "17px" : "26px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleReview(getUserdata._id, getUserdata.subscribe)}
                    />
                    <span className="count_network">{getUserdata.review}</span>
                  </div>

                  <div style={{ marginTop: "8px" }}>
                    <img
                      src={Chat_Profile_icon}
                      alt={"chat_icon"}
                      style={{
                        width: isBelow500px ? "17px" : "26px",
                        height: isBelow500px ? "17px" : "26px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        CheckAuth("Chat", getUserdata._id);
                      }}
                    />
                  </div>
                </Item>
              </Grid>
            </Grid>
          </Stack>
          <Stack>
            <Grid container spacing={2} sx={{ justifyContent: "center" }}>
              <Grid item xs={10} className="">
                <Typography>
                  <span className="profile_interst_detils_heading">Interests :</span>
                  {interestsToShow.map((interest, index) => (
                    <span key={index} className="profile_interst_detils">
                      {interest}
                      {index !== interestsToShow.length - 1 && ", "}
                    </span>
                  ))}
                  {interests.length > 3 && (
                    <span
                      style={{
                        marginTop: "10px",
                        fontSize: "18px",
                        cursor: "pointer",
                        color: "blue",
                        fontWeight: "600",
                        fontFamily: "Abhaya Libre",
                      }}
                      onClick={toggleInterestsDisplay}
                    >
                      {showAllInterests ? "Show less" : "...See more"}
                    </span>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Stack>
          <Stack>
            <Grid container spacing={2} sx={{ justifyContent: "center" }}>
              <Grid item xs={10} className="">
                {aboutMe ? (
                  <Typography className="profile_interst_detils">
                    <span className="profile_interst_detils_heading">About Me : </span>
                    <span className="profile_interst_detils">
                      {aboutMeToShow}
                      {aboutMe.length > 100 && ( // Adjust the length condition as per requirement
                        <span
                          style={{
                            marginTop: "10px",
                            fontSize: "18px",
                            cursor: "pointer",
                            color: "blue",
                            fontWeight: "600",
                            fontFamily: "Abhaya Libre",
                          }}
                          onClick={toggleAboutMeDisplay}
                        >
                          {showFullAboutMe ? "Show less" : "...See more"}
                        </span>
                      )}
                    </span>
                  </Typography>
                ) : (
                  <Typography>
                    <span className="profile_interst_detils_heading">About Me :</span>
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Stack>
          <Stack
            sx={{
              background: "#F8F8F8",
              marginTop: "15px",
              paddingTop: "15px",
              paddingBottom: "15px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} className="">
                <div
                  style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}
                >
                  <Button
                    value="Video"
                    onClick={handleChangeFillter}
                    className={`profile_fillter_button_${
                      selectedFilter === "Video" ? "select" : "unselect"
                    }`}
                  >
                    Video
                  </Button>
                  <Button
                    value="Reel"
                    onClick={handleChangeFillter}
                    className={`profile_fillter_button_${
                      selectedFilter === "Reel" ? "select" : "unselect"
                    }`}
                  >
                    Quicky
                  </Button>
                  <Button
                    value="Post"
                    onClick={handleChangeFillter}
                    className={`profile_fillter_button_${
                      selectedFilter === "Post" ? "select" : "unselect"
                    }`}
                  >
                    Post
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Stack>
          {selectedFilter === "Video" && (
            <InfiniteScroll dataLength={videoList.length} next={handleScrollData} hasMore={hasMore}>
              {loading ? (
                <div>
                  <VideoSkeleton />
                  <VideoSkeleton />
                  <VideoSkeleton />
                  <VideoSkeleton />
                </div>
              ) : (
                <VideoCard
                  videos={videoList}
                  currentVideoIndex={currentVideoIndex}
                  onVideoChange={handleVideoChange}
                />
              )}
            </InfiniteScroll>
          )}

          {selectedFilter === "Post" && (
            <InfiniteScroll
              dataLength={timelineList.length}
              next={handleScrollData}
              hasMore={hasMore}
            >
              <TimelineCard timelines={timelineList} />
            </InfiniteScroll>
          )}

          {selectedFilter === "Reel" && <ReelCard reels={reelslist} />}

          {showModel && (
            <AuthModel
              message={
                actionType === "Chat"
                  ? "Sign in to chat with the user."
                  : actionType === "Hire"
                  ? "Sign in to hire with the user."
                  : actionType === "Add_friend"
                  ? "Sign in to send a friend request"
                  : ""
              }
              heading={
                actionType === "Chat"
                  ? "Do you want to chat with the user ?"
                  : actionType === "Hire"
                  ? "Do you want to Hire with the user ?"
                  : actionType === "Add_friend"
                  ? "You want to send a friend request to the user ?"
                  : ""
              }
              onClose={() => setShowModel(false)}
            />
          )}
          {showReviewModal && (
            <Reviews_model title={title} reviewId={reviewId} handleClose={handleClose} />
          )}
          <Snackbar open={openfriendrequest} autoHideDuration={3000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
              {openfriendrequestMessage}
            </Alert>
          </Snackbar>
        </Card>
      ) : (
        <Grid
          container
          className="mobile_coanitner_reels"
          justifyContent="center"
          style={{ maxWidth: "100%", margin: "auto" }}
        >
          <Grid
            item
            xxl={7}
            xl={8}
            lg={6}
            md={8}
            sm={10}
            onWheel={handleScrollReels}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ width: "100%" }}
          >
            {loading ? (
              <div>
                <ReelsSkeleton />
              </div>
            ) : (
              <div
                className={`${isBelow500px ? "video-container_mobile" : "video-container"}`}
                style={{ backgroundColor: "#000000" }}
              >
                <div className="backbutton_reels" onClick={() => ChangeBackButtonReels("Video")}>
                  <div className="back_button_css">
                    <Backbutton />
                  </div>

                  {reelscategory && (
                    <div
                      aria-label="like"
                      className="icon-styling_fillter_box like details_icon_css"
                    >
                      <ThemeProvider>
                        {/* Add click event listener to handle clicks anywhere on the screen */}
                        <div onClick={handleClickAnywhere}>
                          <Sheet
                            open={isSheetOpen} // Open the Sheet based on state
                            onClose={() => setIsSheetOpen(false)} // Close the Sheet when onClose event is triggered
                            variant="outlined"
                            sx={{
                              width: "auto",
                              maxHeight: 300,
                              overflow: "auto",
                              borderRadius: "sm",
                            }}
                          >
                            <List>
                              <ListSubheader
                                sticky
                                className={`category_button_unselect_reels_heanding`}
                              >
                                Category
                              </ListSubheader>

                              {selectedCategory && (
                                <ListItem nested>
                                  <List>
                                    {categories.map((category, index) => (
                                      <ListItem key={index}>
                                        <ListItemButton
                                          className={`category_button_${
                                            selectedCategory === category._id
                                              ? "select"
                                              : "unselect"
                                          }_reels`}
                                          onClick={() =>
                                            handleCategorybyReelsClick(
                                              category._id,
                                              category.category_name
                                            )
                                          }
                                        >
                                          {category.category_name}
                                        </ListItemButton>
                                      </ListItem>
                                    ))}
                                  </List>
                                </ListItem>
                              )}
                            </List>
                          </Sheet>
                        </div>
                      </ThemeProvider>
                    </div>
                  )}
                </div>
                <ReelCard
                  reels={reelslist}
                  window={window}
                  handleArrowClickArrow={handleArrowClickArrow}
                  onIndexChange={handleCarouselIndexChange} // Pass the callback function here
                />
              </div>
            )}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

MyProfileView.propTypes = {
  user_id: PropTypes.string.isRequired, // Adjust the type accordingly
};

export default MyProfileView;
