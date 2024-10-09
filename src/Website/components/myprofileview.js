import React, { useState, useEffect, useRef } from "react";
import CommanProfile from "./commanprofile";
import { styled } from "@mui/material/styles";
import { debounce } from "lodash";
import VideoCard from "Website/components/video_card";
import TimelineCard from "Website/components/timeline_card";
import ReelCard from "Website/components/reel_card";
import { WebsiteApi } from "Api/WebsiteApi";
import Backbutton from "./Backbutton.js";
import ReelsSkeleton from "../Skeleton/reels_skeleton";
import Category from "Website/components/category";
import { setCookie, getUserdataCookie, checkCookies } from "../../cookies";
import Reviews_model from "../model_components/reviews_Model";
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
import { set_BackButtonReel } from "Actions/UserActivity";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Typography,
  Card,
  CardHeader,
  Avatar,
  Box,
  CardContent,
  Divider,
  TextField,
  IconButton,
  Stack,
  Badge,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { IoMdAddCircle } from "react-icons/io";
import Sub_icon from "../../assets/website_img/sub_icon.svg";
import Reting_icon from "../../assets/website_img/reting.svg";
import Watch_icon from "../../assets/website_img/watch_icon.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import VideoSkeleton from "../Skeleton/video_skeleton";

const MyProfileView = () => {
  const base_url = process.env.REACT_APP_BASE_URL;
  const [selectedFilter, setSelectedFilter] = useState("Video");
  const [videoList, SetVideoList] = useState([]);
  const [reelslist, SetReelsList] = useState({ data: [] });
  const [timelineList, SetTimelineList] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [scrollHandled, setScrollHandled] = useState(false);
  const [title, setTitle] = useState(""); // Set your default title
  const [reviewId, setReviewId] = useState(""); // Set your default share URL

  const [getUserdata, setGetUserdata] = useState({});
  const [isDefaultPic, setIsDefaultPic] = useState(true);
  const [isReelsView, setReelsView] = useState(true);
  const [avatarSrc, setAvatarSrc] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [profileFile, setProfileFile] = useState(null); // यह रेखा जोड़ें
  const [pageNumber, setPageNumber] = useState(1);
  const [margintop, setMarginTop] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [reelscategory, setReelsCategory] = useState(false);
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const reduxboxclosestatus = useSelector((state) => state.userActivity.boxclosestatus);
  const isBelow500px = useMediaQuery("(max-width:500px)");
  const dispatch = useDispatch();

  const [handleArrowClickArrow, setHandleArrowClick] = useState("");
  const [handleArrowClickArrowNumber, setHandleArrowClickNumber] = useState(0);
  const [eventName, setEventName] = useState("Video");
  const [hasMore, setHasMore] = useState(true);
  const reduxcomments_box_status = useSelector((state) => state.userActivity.comments_box_status);

  useEffect(() => {
    setIsSheetOpen(reduxboxclosestatus);
  }, [reduxboxclosestatus]); // I

  useEffect(() => {
    getUsers();
    if (eventName == "Video") {
      fetchDataVideo(pageNumber);
    } else if (eventName == "Reel") {
      fetchDataReel();
    } else {
      fetchDataTimline(pageNumber);
    }
  }, [pageNumber]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      readImage(file);
    }
  };

  const readImage = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setAvatarSrc(imageUrl);
    setProfileFile(file);
    setProfilePic(imageUrl);
    handleImageUpload(file);
  };

  const handleImageUpload = async (file) => {
    // Perform API call to upload the file and get the new pic URL
    try {
      // Step 1: Call the API to get the S3 upload URL
      const getProfilePicUploadUrlS3 = await WebsiteApi.getProfilePicUploadUrlS3();
      const Profilepicget_url = getProfilePicUploadUrlS3.profilepicget_url.url;
      const profilePicKey = getProfilePicUploadUrlS3.profilepicget_url.key;

      // Step 2: Upload the file to the S3 URL using PUT method
      let contentType;
      if (file.type === "image/jpeg" || file.type === "image/jpg") {
        contentType = "image/jpeg";
      } else if (file.type === "image/png") {
        contentType = "image/png";
      } else {
        // Default content type, agar content type match nahi hota
        contentType = "application/octet-stream";
      }

      console.log(file);
      // Perform the PUT request to upload the file to S3
      fetch(Profilepicget_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-cache",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then(async (data) => {
          // async शब्द जोड़ें यदि आप await उपयोग कर रहे हैं
          try {
            const profilePicKey_response = await WebsiteApi.profilePicKey(profilePicKey);
            const userDataString = getUserdataCookie("Userdata");

            if (userDataString) {
              // Parse the JSON string to get the user object
              const user = userDataString;

              // Update the pic parameter with the new URL
              user.pic = profilePicKey_response.pic;

              // Convert the updated user object back to JSON string
              const updatedUserDataString = JSON.stringify(user);

              // Store the updated user data back in the cookies
              setCookie("Userdata", updatedUserDataString);
            }
            window.location.reload(true);
          } catch (error) {
            console.error("There was a problem with your fetch operation:", error.message);
          }
        })
        .catch((error) => {
          console.error("There was a problem with your fetch operation:", error.message);
        });
    } catch (error) {
      console.error("Error during image upload:", error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await WebsiteApi.getUsers();

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

  const handleAddCircleClick = () => {
    document.getElementById("fileInput").click();
  };
  const handleChangeFillter = (event) => {
    setSelectedFilter(event.target.value);
    if (event.target.value == "Video") {
      SetVideoList([]);
      setPageNumber(1);
      setEventName("Video");
      fetchDataVideo(pageNumber);
      setReelsView(true);
    } else if (event.target.value == "Reel") {
      dispatch(set_BackButtonReel(1));
      setEventName("Reel");
      setPageNumber(1);
      fetchDataReel();
      setReelsView(false);
    } else {
      SetTimelineList([]);
      setPageNumber(1);
      setEventName("Post");
      fetchDataTimline(pageNumber);
      setReelsView(true);
    }
  };

  const handleVideoChange = (index) => {
    setCurrentVideoIndex(index);
  };

  const fetchDataReel = async () => {
    try {
      const number = pageNumber;
      let response;

      if (reduxcategory_id !== "" && pageNumber == 1) {
        // Filter lagane par hi purana data hataiye
        console.log("data");
        SetReelsList({ data: [] });
      }
      response = await WebsiteApi.getMyReels(number);
      if (response && response.status && Array.isArray(response.data)) {
        // Naye data ko purane data ke sath jod dijiye
        SetReelsList((prevData) => ({ data: [...prevData.data, ...response.data] }));
        if (response.data.length === 0) {
          console.log("No more data to fetch. Clearing interval.");
          clearInterval(interval.current);
          return;
        }
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const interval = useRef(null);

  const fetchDataVideo = async (pageNumber) => {
    try {
      const response = await WebsiteApi.getMyVideos(pageNumber);

      if (response && response.status && Array.isArray(response.data)) {
        SetVideoList((prevVideos) => [...prevVideos, ...response.data]);
        setHasMore(response.data.length > 0 && response.hasMore);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched (whether success or failure)
    }
  };
  const fetchDataTimline = async (pageNumber) => {
    try {
      const response = await WebsiteApi.getMyTimeline(pageNumber);

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

  const handleReview = async (video_id, title) => {
    setTitle(title);
    setReviewId(video_id);
    setShowReviewModal(true);
  };
  const handleClose = () => {
    setShowReviewModal(false);
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

  const handleCarouselIndexChange = (index) => {
    setPageNumber((prevReelsId) => prevReelsId + 1); // Increment by 2
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

  const handleScroll = debounce((event) => {
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

  const handleScrollData = () => {
    if (hasMore) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };

  const ChangeBackButtonReels = (events) => {
    handleMouseLeave();
    dispatch(set_BackButtonReel(0));
    setSelectedFilter(events);
    if (events == "Video") {
      SetVideoList([]);
      setPageNumber(1);
      setEventName("Video");
      fetchDataVideo(pageNumber);
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
          <Stack direction="row" spacing={2} sx={{ alignSelf: "center" }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <div className="add_profile_img" onClick={handleAddCircleClick}>
                  <IoMdAddCircle />
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange} // This is where handleImageChange is called
                  />
                </div>
              }
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
                  <div>
                    <img
                      src={Watch_icon}
                      alt={"watchs"}
                      style={{
                        width: isBelow500px ? "17px" : "26px",
                        height: isBelow500px ? "17px" : "26px",
                      }}
                    />
                    <span className="count_network">{getUserdata.watch_time}</span>
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
          {showReviewModal && (
            <Reviews_model title={title} reviewId={reviewId} handleClose={handleClose} />
          )}
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
                <VideoCard videos={videoList} onVideoChange={handleVideoChange} />
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
            onWheel={handleScroll}
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
                <div className="backbutton_reels">
                  <div className="back_button_css" onClick={() => ChangeBackButtonReels("Video")}>
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

export default MyProfileView;
