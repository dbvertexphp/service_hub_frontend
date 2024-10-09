import React, { useState, useEffect, useRef } from "react";
const base_url = process.env.REACT_APP_BASE_URL;
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { FaRegHeart, FaEye, FaHeart } from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AuthModel from "./Authmodel";
import Subscribe_model from "../model_components/permission_model";
import Share_model from "../model_components/share_model";
import { WebsiteApi } from "Api/WebsiteApi";
import { useSelector, useDispatch } from "react-redux";
import { setLikeCount } from "Actions/UserActivity";
import PropTypes from "prop-types"; // Import PropTypes
import InfiniteScroll from "react-infinite-scroll-component";
import Report_model from "../model_components/report_model";
import { Popper } from "@mui/base/Popper";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { css } from "@mui/system";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { checkCookies } from "cookies";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { setProfileUrl } from "Actions/UserProfileActions";
import { getUserdataCookie } from "cookies.js";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

import {
  Player,
  BigPlayButton,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton,
} from "video-react";
import { SpaceBarOutlined } from "@mui/icons-material";

const StyledPopperDiv = styled("div")(
  ({ theme }) => css`
    background-color: ${theme.palette.mode === "dark" ? "#808080" : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? "#808080" : "#808080"};
    box-shadow: ${theme.palette.mode === "dark"
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`};
    padding: 0.4rem;
    color: ${theme.palette.mode === "dark" ? "#808080" : "#808080"};
    font-size: 0.875rem;
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    opacity: 1;
    margin: 0.25rem 0;
    width: 88px;
    text-align: center;
    border-top-left-radius: 32px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 32px;
    border-bottom-left-radius: 32px;
    margin-right: 14px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
  `
);

export default function VideoCard({ videos }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [functionCalledFlags, setFunctionCalledFlags] = useState([]);
  const [video_user_id, setVideo_user_id] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showSubscribe_model, setSubscribe_model] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment
  const getWebsiteToken = Cookies.get("Websitetoken");
  const [likeCounts, setlikeCounts] = useState({});
  const reduxprofileurl = useSelector((state) => state.userprofileurlReducer.profiledata);
  const [likeStatuses, setLikeStatuses] = useState({});
  const [title, setTitle] = useState(""); // Set your default title
  const [shareUrl, setShareUrl] = useState(""); // Set your default share URL
  const [shareModalId, setShareModaId] = useState("null");
  const [showFullDescriptions, setShowFullDescriptions] = useState(
    new Array(videos.length).fill(false)
  );
  const [hasMore, setHasMore] = useState(true);
  // Report Model
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportButtonOpen, setReportButtonOpen] = useState("null");
  const [reportModelOpen, setReportModelOpen] = useState("null");
  const [isreportModalOpen, setIsReportModalOpen] = useState(false);
  const popperRef = useRef(null);
  const [openAlert, setOpenAlert] = React.useState(false);
  const videoRefs = useRef([]);
  const observer = useRef(null);
  const isBelow500px = useMediaQuery("(max-width:500px)");
  const isBelow430px = useMediaQuery("(max-width:500px) and (min-width:431px)");
  const is430To200px = useMediaQuery("(max-width:430px) and (min-width:200px)");
  const is768To430px = useMediaQuery("(max-width:768px) and (min-width:430px)");
  const isup769px = useMediaQuery("(min-width:769px)");
  const userCookieData = getUserdataCookie("Userdata");

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      const videoIndex = parseInt(entry.target.dataset.index, 10);
      if (!videoRefs.current[videoIndex]) {
        videoRefs.current[videoIndex] = entry.target;
      }
      try {
        if (entry.isIntersecting && videoRefs.current[videoIndex]) {
          // Video view mein hai, play it
          videoRefs.current[videoIndex].play();
          const accessKey = videoRefs.current[videoIndex].getAttribute("accesskey");
        } else {
          // Video view se bahar gaya hai, pause it
          videoRefs.current[videoIndex].pause();
        }
      } catch (error) {
        // Handle the error by pausing the video
        console.error("Error while playing/pausing video:", error);
        const currentVideo = videoRefs.current[videoIndex];
        if (currentVideo) {
          currentVideo.pause();
        }
      }
    });
  };

  const handleVideoEnd = (videoId) => {
    //console.log(videoId);
    ViewCountAdd(videoId);
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "-5% 0px",
      threshold: 0.9,
    });

    // Observe each video element
    const videoElements = videoRefs.current;
    videoElements.forEach((video) => {
      observer.current.observe(video);
    });
  }, []);

  const handleRef = (index, ref) => {
    videoRefs.current[index] = ref;
    if (observer.current && ref) {
      observer.current.observe(ref);
    }
  };

  useEffect(() => {
    // Observe each video element
    const videoElements = videoRefs.current;
    videoElements.forEach((video) => {
      observer.current.observe(video);
    });

    const handleIntersectionDefault = (entries) => {
      entries.forEach((entry) => {
        const videoIndex = parseInt(entry.target.dataset.index);
        if (videoRefs.current && videoRefs.current[videoIndex]) {
          if (entry.isIntersecting) {
            videoRefs.current[videoIndex].play();
          } else {
            videoRefs.current[videoIndex].pause();
          }
        }
      });
    };

    const observerDefault = new IntersectionObserver(handleIntersectionDefault, {
      root: null,
      rootMargin: "-5% 0px",
      threshold: 0.9,
    });

    // Observe each video element
    // Cleanup when component unmounts
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      if (observerDefault) {
        observerDefault.disconnect();
      }
    };
  }, []);

  const ViewCountAdd = async (videoId) => {
    try {
      const response = await WebsiteApi.ViewCountAdd(videoId);
      if (response) {
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [subscribeStatus, setSubscribeStatus] = useState(
    videos.reduce((statuses, video) => {
      statuses[video.user_id._id] = video.subscribe_status === "Yes" ? "Yes" : "No";
      return statuses;
    }, {})
  );

  const handleLike = async (video_id, TypeNumber, likeCount) => {
    if (getWebsiteToken) {
      try {
        const response = await WebsiteApi.updateVideoLike(video_id, TypeNumber);
        if (response && response.status && response.data) {
          // Update the likeCount based on TypeNumber
          const updatedLikeCount = TypeNumber === "1" ? likeCount + 1 : Math.max(likeCount - 1, 0);
          console.log(updatedLikeCount);
          console.log(likeCount);
          console.log(likeCounts);
          setlikeCounts((prevStatuses) => ({
            ...prevStatuses,
            [video_id]: updatedLikeCount,
          }));

          // Update the like status in the local state
          setLikeStatuses((prevStatuses) => ({
            ...prevStatuses,
            [video_id]: TypeNumber === "1" ? "Yes" : "No",
          }));
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setActionType("like");
      setShowModel(true);
    }
  };

  const handleSubscribe = async (video_user_id) => {
    if (getWebsiteToken) {
      setSubscribe_model(true);
      setVideo_user_id(video_user_id);
    } else {
      setActionType("Subscribe");
      setShowModel(true);
    }
  };

  const handleSubscribeResponse = (response) => {
    handleSubscribeTimeline(video_user_id, response);
    setSubscribe_model(false);
  };

  const handleSubscribeTimeline = async (video_user_id, response) => {
    if (response == "Subscription") {
      try {
        const response = await WebsiteApi.SubscribeRequest(video_user_id);
        if (response && response.status) {
          const updatedStatus = subscribeStatus[video_user_id] === "Yes" ? "No" : "Yes";
          setSubscribeStatus((prevStatuses) => ({
            ...prevStatuses,
            [video_user_id]: updatedStatus,
          }));
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleToggleDescription = (index) => {
    const updatedShowFullDescriptions = [...showFullDescriptions];
    updatedShowFullDescriptions[index] = !updatedShowFullDescriptions[index];
    setShowFullDescriptions(updatedShowFullDescriptions);
  };
  const isSubscribed = (video_user_id) => subscribeStatus[video_user_id] === "Yes";

  if (videos.length === 0) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          justifyContent: "center",
          alignSelf: "center",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Box>
          <Typography variant="body1" color="error" className="video_home_card_hending_Not_found">
            Video Not Found
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleShare = async (video_id, title) => {
    setTitle(title);
    setShareUrl(`${base_url}/website-video-comment/${video_id}`);
    setShowShareModal(true);
    setShareModaId(video_id);
  };
  const handleClose = () => {
    setShowShareModal(false);
  };

  const handleReportModelOpen = (videoId) => {
    setAnchorEl(null);
    if (getWebsiteToken) {
      setReportModelOpen(videoId);
      setReportButtonOpen(videoId);
    } else {
      setActionType("Report");
      setShowModel(true);
    }
  };

  const handleCloseModal = () => {
    setReportModelOpen("");
    setIsReportModalOpen(false);
  };

  const handleOnsuccesModel = () => {
    setReportModelOpen("");
    setOpenAlert(true);
    setIsReportModalOpen(false);
  };

  const handleClickOutside = (event) => {
    if (popperRef.current && !popperRef.current.contains(event.target)) {
      setReportButtonOpen("null");
    }
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const ProfileUrl = async (userId) => {
    const profileUrl = await dispatch(setProfileUrl(userId));
    if (profileUrl) {
      navigate(profileUrl);
    } else {
      console.error("Failed to get profile URL.");
    }
  };

  const getHeight = () => {
    if (is430To200px) {
      return "175px";
    } else if (isBelow430px) {
      return "300px";
    } else if (is768To430px) {
      return "400px";
    } else if (isup769px) {
      return "500px";
    }
  };

  return (
    <InfiniteScroll dataLength={videos.length} next={() => {}} hasMore={hasMore}>
      {videos.map((video, index) => {
        const isLiked =
          likeStatuses[video._id] === "Yes" ||
          (likeStatuses[video._id] == undefined && video.like_status === "Yes");

        const likeCount =
          likeCounts[video._id] !== undefined ? likeCounts[video._id] : video.like_count || 0;

        const isTimelineSubscribed =
          isSubscribed(video.user_id._id) || video.subscribe_status === "Yes";

        const userAvatar = video.user_id.pic.includes("defult_pic.jpg") ? (
          <Avatar sx={{ bgcolor: red[500], width: 36, height: 36 }} aria-label="recipe">
            {`${video.user_id.first_name.charAt(0)}${video.user_id.last_name.charAt(0)}`}
          </Avatar>
        ) : (
          <Avatar alt="Remy Sharp" src={video.user_id.pic} sx={{ width: 36, height: 36 }} />
        );

        const LightTooltip = styled(({ className, ...props }) => (
          <Tooltip {...props} classes={{ popper: className }} />
        ))(({ theme }) => ({
          [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "rgb(255, 255, 255)", // Background color
            border: "1px solid rgb(128, 128, 128)", // Border
            color: "#9b9b9b", // Text color
            padding: "5px 20px 5px 20px",
            borderRadius: "20px 20px 20px 20px",
            fontSize: "0.875rem", // Font size
            fontFamily: "IBM Plex Sans, sans-serif", // Font family
            fontWeight: 500, // Font weight
            textAlign: "center", // Text align
            boxShadow: "rgba(0, 0, 0, 0.25) 0px 4px 4px 0px inset", // Box shadow
            cursor: "pointer",
          },
        }));

        return (
          <Card
            className="Video_list_card"
            key={index}
            sx={{ maxWidth: "-webkit-fill-available", marginTop: "20px" }}
          >
            <CardHeader
              action={
                <LightTooltip
                  placement="bottom-end"
                  title={
                    <span>
                      <span onClick={(event) => handleReportModelOpen(video._id)}>Report</span>
                    </span>
                  }
                  slotProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [0, -13],
                          },
                        },
                      ],
                    },
                  }}
                  className="custom-tooltip" // Add a custom class name
                  arrow={true}
                >
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                </LightTooltip>
              }
              avatar={
                <Link
                  to={
                    userCookieData._id === video.user_id._id
                      ? `/website-my-profile-view`
                      : `/Website-user-profile-view/${video.user_id._id}`
                  }
                >
                  <div style={{ cursor: "pointer" }}>{userAvatar}</div>
                </Link>
              }
              title={
                <div style={{ cursor: "pointer", width: "fit-content" }}>
                  <Link
                    to={
                      userCookieData._id === video.user_id._id
                        ? `/website-my-profile-view`
                        : `/Website-user-profile-view/${video.user_id._id}`
                    }
                  >
                    <Typography variant="h6" className="video_card_user_name_title">
                      {`${video.user_id.first_name} ${video.user_id.last_name}`}
                    </Typography>
                  </Link>
                </div>
              }
              subheader={
                <Typography
                  elevation={8}
                  variant="subtitle1"
                  className="video_card_user_name_subheader rounded-pill"
                >
                  {video.category_id.category_name}
                </Typography>
              }
            />
            <Popper open={reportButtonOpen !== "null"} anchorEl={anchorEl} placement="bottom-end">
              <div ref={popperRef}>
                <StyledPopperDiv
                  className="block_user"
                  onClick={() => handleReportModelOpen(video._id)}
                >
                  Report
                </StyledPopperDiv>
              </div>
            </Popper>
            <CardMedia
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: getHeight(),
                backgroundColor: "#808080",
                position: "relative",
              }}
            >
              <video
                controls
                ref={(ref) => handleRef(index, ref)}
                data-index={index}
                accessKey={video._id}
                onEnded={() => handleVideoEnd(video._id)}
                poster={video.thumbnail_name}
                style={{
                  minWidth: "100%",
                  maxHeight: "100%", // Use 100% height to fill the container
                  //  objectFit: "cover", // Maintain aspect ratio

                  borderRadius: isBelow500px ? "10px" : "10px",
                  aspectRatio: "1/1",
                }}
              >
                <source src={video.video_url} type="video/mp4" />
              </video>
            </CardMedia>

            <CardActions disableSpacing sx={{ paddingBottom: isBelow500px ? "0px" : "0px" }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", minWidth: "60px" }}>
                <IconButton aria-label="eyes" className="details_icon_css">
                  <FaEye />
                  <Typography className="vide_card_count" sx={{ marginLeft: "8px" }}>
                    {video.view_count}
                  </Typography>
                </IconButton>
              </Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", minWidth: "60px" }}>
                <IconButton
                  aria-label="add to favorites"
                  className="details_icon_css"
                  sx={{ marginLeft: "10px" }}
                  onClick={() => handleLike(video._id, isLiked ? "0" : "1", likeCount)}
                >
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                </IconButton>
                <Typography className="vide_card_count" sx={{ paddingLeft: "0px" }}>
                  {likeCount}
                </Typography>
              </Box>

              <Box sx={{ display: "inline-flex", alignItems: "center", minWidth: "60px" }}>
                <IconButton
                  aria-label="comment"
                  className="details_icon_css"
                  sx={{ marginLeft: "10px" }}
                >
                  <Link
                    to={`/website-video-comment/${video._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <BiCommentDetail />
                  </Link>

                  <Typography className="vide_card_count" sx={{ marginLeft: "8px" }}>
                    {video.comment_count}
                  </Typography>
                </IconButton>
              </Box>
              <IconButton
                aria-label="share"
                className="details_icon_css"
                sx={{ marginLeft: "10px" }}
                onClick={() => handleShare(video._id, video.title)}
              >
                <IoMdShare />
              </IconButton>

              {video.user_id._id !== userCookieData._id && (
                <Button
                  variant="contained"
                  sx={{ marginLeft: "auto" }}
                  className={`${
                    isTimelineSubscribed ? "subcribe_button" : "subcribe_button"
                  } rounded-pill`}
                  onClick={() => handleSubscribe(video.user_id._id)}
                  disabled={isTimelineSubscribed}
                >
                  {isTimelineSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              )}
            </CardActions>
            <CardContent sx={{ paddingTop: isBelow500px ? "0px" : "0px" }}>
              <Typography variant="body2" className="video_card_desc_title">
                {`${video.title}`}
              </Typography>
              <div>
                <span
                  className="video_card_desc"
                  dangerouslySetInnerHTML={{
                    __html: showFullDescriptions[index]
                      ? video.description
                          .replace(/(?:\n|\\n)/g, "<br/>")
                          .replace(/\\ntest/g, "<br/>test")
                      : video.description
                          .slice(0, 100)
                          .replace(/(?:\n|\\n)/g, "<br/>")
                          .replace(/\\ntest/g, "<br/>test"),
                  }}
                />
                {video.description.length > 100 && (
                  <span
                    className="video_card_desc"
                    style={{
                      marginTop: "10px",
                      fontSize: "20px",
                      cursor: "pointer",
                      color: "blue",
                    }}
                    onClick={() => handleToggleDescription(index)}
                  >
                    <span
                      style={{
                        marginTop: "10px",
                        fontSize: "18px",
                        cursor: "pointer",
                        color: "blue",
                        fontWeight: "600",
                        fontFamily: "Abhaya Libre",
                      }}
                    >
                      {showFullDescriptions[index] ? " Show Less" : " ...See More"}
                    </span>
                  </span>
                )}
              </div>
            </CardContent>

            {showModel && (
              <AuthModel
                message={
                  actionType === "like"
                    ? "Sign in to make your opinion count."
                    : actionType === "Subscribe"
                    ? "Sign in to subscribe to this user."
                    : actionType === "Report"
                    ? "Sign in to Report."
                    : ""
                }
                heading={
                  actionType === "like"
                    ? "Like this video?"
                    : actionType === "Subscribe"
                    ? "Want to subscribe to this user?"
                    : actionType === "Report"
                    ? "Report This user?"
                    : ""
                }
                onClose={() => setShowModel(false)}
              />
            )}
            {showSubscribe_model && (
              <Subscribe_model
                onClose={() => setSubscribe_model(false)}
                onSubscribe={handleSubscribeResponse}
                message={"Do you want to subscribe this user?"}
                heading={"Subscribe"}
                ButtonText={"Subscribe"}
                ButtonValue={"Subscription"}
              />
            )}
            {showShareModal && shareModalId == video._id && (
              <Share_model title={title} shareUrl={shareUrl} handleClose={handleClose} />
            )}
            {reportModelOpen === video._id && (
              <Report_model
                status_open={true}
                onClose={handleCloseModal}
                onSucces={handleOnsuccesModel}
                type_id={reportButtonOpen}
                report_type={"video"}
              />
            )}
          </Card>
        );
      })}
      <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
          Report Successfully Submitted!
        </Alert>
      </Snackbar>
    </InfiniteScroll>
  );
}

VideoCard.propTypes = {
  videos: PropTypes.array.isRequired, // Assuming reels is an array, adjust the type accordingly
};
