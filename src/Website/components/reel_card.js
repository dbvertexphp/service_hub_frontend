import React, { useEffect, useState, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  IconButton,
  Button,
  Typography,
  CardContent,
  TextField,
  CardHeader,
  Divider,
} from "@mui/material";
const base_url = process.env.REACT_APP_BASE_URL;
import { Link } from "react-router-dom";
import SendIcon from "../../assets/website_img/send button.svg";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import InputAdornment from "@mui/material/InputAdornment";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Cookies from "js-cookie";
import Videos from "./reels_slider";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import { FaRegHeart, FaEye, FaHeart } from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IoMdShare } from "react-icons/io";
import { WebsiteApi } from "Api/WebsiteApi";
import AuthModel from "./Authmodel";
import { getUserdataCookie, checkCookies } from "cookies.js";
import createAvatar from "../Utils/avatarUtils";
import { RxCross2 } from "react-icons/rx";
import Subscribe_model from "../model_components/permission_model";
import useMediaQuery from "@mui/material/useMediaQuery";
import CommentSkeleton from "../Skeleton/comment_skeleton";
import Share_model from "../model_components/share_model";
import { useNavigate } from "react-router-dom";
import Report_model from "../model_components/report_model";
import { Popper } from "@mui/base/Popper";
import { css } from "@mui/system";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { setProfileUrl } from "Actions/UserProfileActions";
import { set_CommentsStatus } from "Actions/UserActivity";
import { useDispatch, useSelector } from "react-redux";
const drawerBleeding = 60;
import EmojiPicker from "emoji-picker-react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor: theme.palette.mode === "light" ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#356c42",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#356c42",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#356c42 !important",
      borderRadius: "30px",
    },
    "& fieldset": {
      borderColor: "#356c42 !important",
      borderRadius: "30px",
    },
  },
});

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

const Reels_card = ({ reels, handleArrowClickArrow, onIndexChange, DefultIndexNumber }) => {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [likeCounts, setLikeCounts] = useState({});
  const [CommentCounts, setCommentCounts] = useState({});
  const [reels_user_id, setReels_user_id] = useState(null);
  const [showSubscribe_model, setSubscribe_model] = useState(false);
  const [likeStatuses, setLikeStatuses] = useState({});
  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment
  const [showFullDescriptions, setShowFullDescription] = useState(false);
  const getWebsiteToken = Cookies.get("Websitetoken");
  const [opencomment, setOpenCommant] = React.useState(null);
  const [userData, setUserData] = useState({});
  const [newCommentSubmitted, setNewCommentSubmitted] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState({});
  const [commentlist, setCommentsList] = useState([]);
  const [postcomment, setPostComment] = useState("");
  const [reel_ids, setReelIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const commentBoxRef = useRef(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [title, setTitle] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  // Report Model
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportButtonOpen, setReportButtonOpen] = useState("null");
  const [reportModelOpen, setReportModelOpen] = useState(false);
  const [isreportModalOpen, setIsReportModalOpen] = useState(false);
  const popperRef = useRef(null);
  const [openAlert, setOpenAlert] = React.useState(false);
  const postRefs = useRef([]);
  const observer = useRef(null);

  const isBelow500px = useMediaQuery("(max-width:500px)");
  const isUp768px = useMediaQuery("(max-width:768px)");

  ////////// Slider Reels ///////////////////
  const [activeIndex, setActiveIndex] = useState(0);
  const [incmentIndex, setIncmentIndex] = useState(0);
  const [canMoveUp, setCanMoveUp] = useState(true);
  const [canMoveDown, setCanMoveDown] = useState(true);
  const [isSwiping, setIsSwiping] = useState(true);
  const userCookieDatass = getUserdataCookie("Userdata");

  useEffect(() => {
    const direction = handleArrowClickArrow.split("_")[0];
    const number = parseInt(handleArrowClickArrow.split("_")[1]);
    handleArrowClickInternal(direction);
  }, [handleArrowClickArrow]);

  const handleArrowClickInternal = (direction) => {
    const totalSlides = reels.data.length;
    let newIndex = activeIndex;

    if (direction === "up" && activeIndex > 0) {
      newIndex = activeIndex - 1;
    } else if (direction === "down" && activeIndex < totalSlides - 1) {
      newIndex = activeIndex + 1;
    }

    setCanMoveUp(newIndex > 0);
    setCanMoveDown(newIndex < totalSlides - 1);
    setActiveIndex(newIndex);
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev);
  };

  const handleCarouselChange = (index) => {
    if ((index + 1) % 3 === 0) {
      // Invoke the callback function provided via props
      if (incmentIndex <= index) {
        setIncmentIndex(index);
        onIndexChange(index + 1); // Pass the index to the callback function
      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    const emojiToAdd = emoji.emoji || emoji.unified || ""; // Choose the property you want to use
    setPostComment((prevMessage) => prevMessage + emojiToAdd);
  };

  ////////// Slider Reels ///////////////////

  const toggleDrawer = (newOpen) => () => {
    setCommentsList([]);
    setOpenCommant(newOpen);
    setReelIds(newOpen);
    fetchDataReelscommant(newOpen);
    if (!newOpen) {
      dispatch(set_CommentsStatus(false));
    } else {
      dispatch(set_CommentsStatus(true));
    }
  };

  const handleClose = () => {
    setOpenCommant(false);
    dispatch(set_CommentsStatus(false));
  };

  const handleAuthCheck = () => {
    if (checkCookies()) {
      // User is logged in, make API call
    } else {
      setActionType("Comment");
      setShowModel(true);
    }
  };
  const handleSubscribe = async (reels_user_id) => {
    if (getWebsiteToken) {
      setSubscribe_model(true);
      setReels_user_id(reels_user_id);
    } else {
      setActionType("Subscribe");
      setShowModel(true);
    }
  };

  const fetchDataReelscommant = async (reel_ids) => {
    try {
      setApiLoading(true);
      const response = await WebsiteApi.getReelComments(reel_ids);

      if (response && response.status) {
        const commentsList = response.comments;
        setCommentsList(commentsList);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setApiLoading(false);
    }
  };

  useEffect(() => {
    if (newCommentSubmitted) {
      // Scroll to the bottom when a new comment is submitted
      commentBoxRef.current.scrollTop = commentBoxRef.current.scrollHeight;
      // Reset the flag
      setNewCommentSubmitted(false);
    }
  }, [newCommentSubmitted]);

  const container = typeof window !== "undefined" ? window.document.body : null;

  const handleSubmitComment = async (event, ReelsIDS, CommentLenth) => {
    event.preventDefault();
    console.log(CommentLenth);
    if (!postcomment.trim()) {
      setError("Please enter a comment.");
    } else {
      try {
        const response = await WebsiteApi.addReelComment(reel_ids, postcomment);
        setIsEmojiPickerOpen(false);
        if (response && response.status && response.data) {
          const newComment = {
            _id: response.data._id,
            user_id: userData,
            comment: postcomment,
            // Add other properties if needed
          };
          setCommentCounts((prevCounts) => ({
            ...prevCounts,
            [reel_ids]: CommentLenth + 1, // Increment count for the specific post
          }));

          setCommentsList((prevComments) => {
            if (Array.isArray(prevComments)) {
              return [...prevComments, newComment];
            } else {
              return [newComment];
            }
          });

          setNewCommentSubmitted(true);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setPostComment("");
      setError("");
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescriptions);
  };
  const handleLike = async (reel_id, currentLikeStatus, likeCount) => {
    if (getWebsiteToken) {
      try {
        const newLikeStatustype = currentLikeStatus === "1" ? "1" : "0";
        const newLikeStatus = currentLikeStatus === "1" ? "Yes" : "No";
        const newLikeCount =
          currentLikeStatus === "1" ? Math.max(likeCount + 1) : Math.max(likeCount - 1, 0);

        const response = await WebsiteApi.updateReelLike(reel_id, newLikeStatustype);
        setLikeCounts((prevStatuses) => ({
          ...prevStatuses,
          [reel_id]: newLikeCount,
        }));
        setLikeStatuses((prevStatuses) => ({
          ...prevStatuses,
          [reel_id]: currentLikeStatus === "1" ? "Yes" : "No",
        }));

        if (response && response.status && response.data) {
          // Update the likeCount and likeStatus in the local state
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

  const handleSubscribeTimeline = async (reels_user_id, response) => {
    if (response == "Subscription") {
      try {
        const response = await WebsiteApi.SubscribeRequest(reels_user_id);
        if (response && response.status) {
          const updatedStatus = subscribeStatus[reels_user_id] === "Yes" ? "No" : "Yes";
          setSubscribeStatus((prevStatuses) => ({
            ...prevStatuses,
            [reels_user_id]: updatedStatus,
          }));
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  const handleSubscribeResponse = (response) => {
    handleSubscribeTimeline(reels_user_id, response);
    setSubscribe_model(false);
  };

  useEffect(() => {
    const userCookieData = getUserdataCookie("Userdata");
    setUserData(userCookieData);
  }, []);

  useEffect(() => {
    if (DefultIndexNumber == 0) {
      setActiveIndex(0);
      setIncmentIndex(0);
    }
  }, [DefultIndexNumber]);

  const handleShare = async (post_id, title) => {
    setTitle(title);
    setShareUrl(`${base_url}/website-reels-filter-list/${post_id}`);
    setShowShareModal(true);
  };
  const handleCloseShare = () => {
    setShowShareModal(false);
  };

  if (reels.data.length === 0) {
    return (
      <Card
        className={`${isBelow500px ? "video-container_mobile" : "video-container"}`}
        style={{ backgroundColor: "#000000" }}
      >
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: "20px",
            marginTop: isBelow500px ? "50vh" : "38vh",
          }}
        >
          <Box>
            <Typography
              variant="body1"
              color="error"
              className="video_home_card_hending_Not_found_Reels"
            >
              Quicky Not Found
            </Typography>
          </Box>
        </Box>
      </Card>
    );
  }

  const handleReportButtonOpen = (event, postid) => {
    setAnchorEl(event.currentTarget);
    setReportButtonOpen(postid);
    if (reportModelOpen !== "") {
      handleClickOutside("mousedown");
    }
  };

  const handleReportModelOpen = (postid) => {
    setAnchorEl(null);
    if (getWebsiteToken) {
      setReportModelOpen(true);
      setReportButtonOpen(postid);
    } else {
      setActionType("Report");
      setShowModel(true);
    }
  };

  const handleCloseModal = () => {
    setReportModelOpen(false);
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
    <div className="">
      <div className="vertical-slider-container">
        <div
          className="col-lg-12 col-md-12 vertical-carousel"
          style={{ backgroundColor: "#000000" }}
        >
          <Carousel
            axis="vertical"
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
            infiniteLoop={false}
            selectedItem={activeIndex}
            onChange={handleCarouselChange} // Add this onChange handler
            emulateTouch={true}
            swipeable={true}
            height="100vh" // Set the height to the full screen height
          >
            {reels.data.map((post, idx) => {
              const isLiked =
                likeStatuses[post._id] === "Yes" ||
                (likeStatuses[post._id] == undefined && post.like_status === "Yes");

              const likeCount =
                likeCounts[post._id] !== undefined ? likeCounts[post._id] : post.like_count || 0;

              const CommentCount =
                CommentCounts[post._id] !== undefined
                  ? CommentCounts[post._id]
                  : post.comment_count || 0;

              const isReelsSubscribed =
                subscribeStatus[reels_user_id] === "Yes" || post.subscribe_status === "Yes";

              const avatarComponent = createAvatar(
                post.user_id.pic,
                post.user_id.first_name,
                post.user_id.last_name,
                "headerdesktop"
              );

              return (
                <React.Fragment key={idx + 1}>
                  <div className="Reels_Slider" key={idx + 1} data-key={idx + 1}>
                    <Videos src={post.reel_url} Reels_Id={post._id}></Videos>
                    <div className="descpstion">
                      <div className="fa" style={{ display: "flex", marginBottom: "15px" }}>
                        <Link
                          to={
                            userCookieDatass._id === post.user_id._id
                              ? `/website-my-profile-view`
                              : `/Website-user-profile-view/${post.user_id._id}`
                          }
                        >
                          {avatarComponent}
                        </Link>
                        <span>
                          <Link
                            className="fa_text"
                            to={
                              userCookieDatass._id === post.user_id._id
                                ? `/website-my-profile-view`
                                : `/Website-user-profile-view/${post.user_id._id}`
                            }
                          >
                            {`${post.user_id.first_name.substring(0, 7)} ${post.user_id.last_name}`}
                          </Link>
                        </span>
                        {post.user_id._id !== userCookieDatass._id &&
                          (isReelsSubscribed ? (
                            <Button
                              variant="contained"
                              sx={{ marginLeft: "auto" }}
                              className={`${
                                isReelsSubscribed ? "subcribe_button_reel" : "subcribe_button_reel"
                              } rounded-pill`}
                              onClick={() => handleSubscribe(post.user_id._id)}
                              disabled={isReelsSubscribed}
                            >
                              {isReelsSubscribed ? "Subscribed" : "Subscribe"}
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              sx={{ marginLeft: "auto" }}
                              className={`${
                                isReelsSubscribed ? "subcribe_button_reel" : "subcribe_button_reel"
                              } rounded-pill`}
                              onClick={() => handleSubscribe(post.user_id._id)}
                              disabled={isReelsSubscribed}
                            >
                              {isReelsSubscribed ? "Unsubscribe" : "Subscribed"}
                            </Button>
                          ))}
                      </div>
                      <Typography
                        className="descpstion_reels"
                        onClick={toggleDescription}
                        style={{ cursor: "pointer" }}
                        sx={toggleDescription ? { height: "fit-content" } : {}}
                      >
                        {showFullDescriptions ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: post.description
                                .replace(/(?:\n|\\n)/g, "<br/>")
                                .replace(/\\ntest/g, "<br/>test"),
                            }}
                          />
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `${post.description
                                .slice(0, 100)
                                .replace(/(?:\n|\\n)/g, "<br/>")
                                .replace(/\\ntest/g, "<br/>test")}${
                                post.description.length > 100
                                  ? " <span style='color: blue; font-weight: 500;'>...See More</span>"
                                  : ""
                              }`,
                            }}
                          />
                        )}
                      </Typography>
                    </div>
                    <IconButton
                      className="icon-styling_view like details_icon_css"
                      style={{ textDecoration: "none", color: "inherit" }}
                      onClick={toggleDrawer(post._id)}
                    >
                      <FaEye />
                    </IconButton>
                    <Typography
                      aria-label="like"
                      className="icon-styling_view_count like details_icon_css"
                    >
                      {post.view_count}
                    </Typography>
                    <IconButton
                      aria-label="like"
                      onClick={() => handleLike(post._id, isLiked ? "0" : "1", likeCount)}
                      className="icon-styling like details_icon_css"
                    >
                      {isLiked ? <FaHeart /> : <FaRegHeart />}
                    </IconButton>
                    <Typography
                      aria-label="like"
                      className="icon-styling_like_count like details_icon_css"
                    >
                      {likeCount}
                    </Typography>
                    <IconButton
                      className="icon-styling_commant like details_icon_css"
                      style={{ textDecoration: "none", color: "inherit" }}
                      onClick={toggleDrawer(post._id)}
                    >
                      <BiCommentDetail />
                    </IconButton>
                    <Typography
                      aria-label="like"
                      className="icon-styling_commant_count like details_icon_css"
                    >
                      {CommentCount}
                    </Typography>
                    <IconButton
                      aria-label="share"
                      className="icon-styling_share like details_icon_css"
                    >
                      <IoMdShare onClick={() => handleShare(post.share_Id, post.title)} />
                    </IconButton>
                    <IconButton
                      aria-label="share"
                      className="icon-styling_report like details_icon_css"
                      onClick={(event) => handleReportButtonOpen(event, post._id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <LightTooltip
                      placement="bottom-end"
                      title={
                        <span>
                          <span onClick={(event) => handleReportModelOpen(post._id)}>Report</span>
                        </span>
                      }
                      slotProps={{
                        popper: {
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, -17],
                              },
                            },
                          ],
                        },
                      }}
                      arrow={true}
                    >
                      <IconButton
                        aria-label="settings"
                        className="icon-styling_report like details_icon_css"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </LightTooltip>
                  </div>
                  {opencomment && !isUp768px && (
                    <Dialog
                      open={opencomment == post._id}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      fullWidth={true}
                      maxWidth="xxl"
                      box-shadow=" rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px"
                    >
                      <div className="modal-container">
                        <div className="video-box">
                          <video autoPlay={true} muted="muted">
                            <source src={post.reel_url} />
                          </video>
                        </div>
                        <div className="w-100">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "10px",
                            }}
                          >
                            <div style={{ textAlign: "center", flex: 1 }}>
                              <Typography variant="body1" className="commant_Heading">
                                Comments
                              </Typography>
                            </div>
                            <div style={{ textAlign: "right", marginRight: "20px" }}>
                              <Typography
                                variant="body1"
                                className="commant_Heading"
                                sx={{ cursor: "pointer" }}
                                onClick={handleClose}
                              >
                                <RxCross2 />
                              </Typography>
                            </div>
                          </div>
                          <div className="comment-container overflow-auto" ref={commentBoxRef}>
                            <div
                              className="card1"
                              style={{ padding: "1rem", overflowY: "scroll", height: "76vh" }}
                            >
                              {loading ? (
                                <div>
                                  <CommentSkeleton />
                                  <CommentSkeleton />
                                  <CommentSkeleton />
                                  <CommentSkeleton />
                                  <CommentSkeleton />
                                  <CommentSkeleton />
                                  <CommentSkeleton />
                                  <CommentSkeleton />
                                  <CommentSkeleton />
                                </div>
                              ) : (
                                <div>
                                  {commentlist === undefined || commentlist.length === 0 ? (
                                    <div style={{ textAlign: "center", paddingTop: "42%" }}>
                                      <Typography variant="body1" className="No_comments">
                                        No comments available.
                                      </Typography>
                                    </div>
                                  ) : (
                                    commentlist.map((comment) => (
                                      <div key={comment._id}>
                                        <CardHeader
                                          avatar={
                                            <div
                                              onClick={() => {
                                                ProfileUrl(comment.user_id._id);
                                              }}
                                              style={{ cursor: "pointer" }}
                                            >
                                              {createAvatar(
                                                comment.user_id.pic,
                                                comment.user_id.first_name,
                                                comment.user_id.last_name,
                                                "chatheader"
                                              )}
                                            </div>
                                          }
                                          sx={{ paddingBottom: "0px" }}
                                          title={
                                            <div
                                              onClick={() => {
                                                ProfileUrl(comment.user_id._id);
                                              }}
                                              style={{ cursor: "pointer" }}
                                            >
                                              <Typography
                                                variant="h3"
                                                className="video_card_user_name_title"
                                              >
                                                {`${comment.user_id.first_name} ${comment.user_id.last_name}`}
                                              </Typography>
                                            </div>
                                          }
                                        />
                                        <CardContent className="commant_message_box">
                                          <Typography
                                            paragraph
                                            className="commant_message"
                                            sx={{ paddingLeft: "53px" }}
                                          >
                                            {comment.comment}
                                            <Divider
                                              sx={{
                                                backgroundColor: "#356C42",
                                                height: "1px",
                                                opacity: "1.25",
                                              }}
                                            />
                                          </Typography>
                                        </CardContent>
                                      </div>
                                    ))
                                  )}
                                  {isEmojiPickerOpen && (
                                    <EmojiPicker
                                      style={{ width: "100%" }}
                                      onEmojiClick={handleEmojiSelect}
                                    />
                                  )}
                                </div>
                              )}
                            </div>

                            <Card
                              className="card2"
                              sx={{ bgcolor: "primary" }}
                              style={{ marginLeft: "0.2rem" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  outline: "none",
                                  textDecorationLine: "none",
                                }}
                              >
                                <CardContent
                                  className="comment_box comment_box_reels"
                                  component="form"
                                  noValidate
                                  autoComplete="off"
                                  onSubmit={(event) => {
                                    event.preventDefault();
                                    handleSubmitComment(
                                      event,
                                      post._id,
                                      commentlist ? commentlist.length : 0
                                    );
                                  }}
                                >
                                  <CssTextField
                                    fullWidth
                                    multiline
                                    value={postcomment}
                                    onChange={(e) => setPostComment(e.target.value)}
                                    label="Add a Comment"
                                    id="custom-css-outlined-input"
                                    className="rounded-pill"
                                    error={Boolean(error)}
                                    helperText={error}
                                    onFocus={handleAuthCheck}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <div onClick={toggleEmojiPicker} className="emoji_icon">
                                            {isEmojiPickerOpen ? (
                                              <KeyboardIcon />
                                            ) : (
                                              <EmojiEmotionsIcon />
                                            )}
                                          </div>
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                  <IconButton type="submit" sx={{ paddingTop: "0px" }}>
                                    <img
                                      src={SendIcon}
                                      alt="send_icon"
                                      style={{ transform: "rotate(45deg)" }}
                                    />
                                  </IconButton>
                                </CardContent>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </Dialog>
                  )}
                </React.Fragment>
              );
            })}
          </Carousel>
          {opencomment && isUp768px && (
            <Root>
              <CssBaseline />
              <Global
                styles={{
                  ".MuiDrawer-root > .MuiPaper-root": {
                    height: `calc(80% - ${drawerBleeding}px)`,
                    overflow: "visible",
                    margin: "0px",
                    width: "100%",
                  },
                }}
              />
              <Box sx={{ textAlign: "center", pt: 1 }}>
                <Button onClick={toggleDrawer(true)}>Open</Button>
              </Box>

              <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={opencomment}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                <StyledBox
                  sx={{
                    position: "absolute",
                    top: -drawerBleeding,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    visibility: "visible",
                    right: 0,
                    left: 0,
                  }}
                >
                  <Puller />
                  <Typography
                    sx={{ p: 2, color: "text.secondary" }}
                    className="commant_Heading_mobile"
                  >
                    Comments
                  </Typography>
                </StyledBox>
                <StyledBox
                  sx={{
                    px: 2,
                    paddingBottom: "61px",
                    height: "100%",
                    overflow: "auto",
                  }}
                  ref={commentBoxRef}
                >
                  {loading ? (
                    <div>
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                      <CommentSkeleton />
                    </div>
                  ) : (
                    <div>
                      {commentlist === undefined || commentlist.length === 0 ? (
                        <div style={{ textAlign: "center", paddingTop: "42%" }}>
                          <Typography variant="body1" className="No_comments">
                            No comments available.
                          </Typography>
                        </div>
                      ) : (
                        commentlist.map((comment) => (
                          <div key={comment._id}>
                            <CardHeader
                              avatar={
                                <div
                                  onClick={() => {
                                    ProfileUrl(comment.user_id._id);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  {createAvatar(
                                    comment.user_id.pic,
                                    comment.user_id.first_name,
                                    comment.user_id.last_name,
                                    "Mobile_commant"
                                  )}
                                </div>
                              }
                              sx={{ paddingBottom: "0px", paddingTop: "0px" }}
                              title={
                                <div
                                  onClick={() => {
                                    ProfileUrl(comment.user_id._id);
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <Typography variant="h3" className="video_card_user_name_title">
                                    {`${comment.user_id.first_name} ${comment.user_id.last_name}`}
                                  </Typography>
                                </div>
                              }
                            />
                            <CardContent className="commant_message_box">
                              <Typography
                                paragraph
                                className="commant_message_mobile"
                                sx={{ paddingLeft: "37px" }}
                              >
                                {comment.comment &&
                                  comment.comment.match(/.{1,36}/g).map((chunk, index) => (
                                    <React.Fragment key={index}>
                                      {chunk}
                                      {index < comment.comment.length / 36 - 1 && <br />}
                                    </React.Fragment>
                                  ))}
                                <Divider
                                  sx={{
                                    backgroundColor: "#356C42",
                                    height: "1px",
                                    opacity: "1.25",
                                    margin: "0.3rem 0",
                                  }}
                                />
                              </Typography>
                            </CardContent>
                          </div>
                        ))
                      )}
                      {isEmojiPickerOpen && (
                        <EmojiPicker style={{ width: "100%" }} onEmojiClick={handleEmojiSelect} />
                      )}
                    </div>
                  )}
                </StyledBox>
                <Card
                  className="card2"
                  sx={{ bgcolor: "primary" }}
                  style={{ marginLeft: "0.2rem" }}
                >
                  <div style={{ display: "flex", outline: "none", textDecorationLine: "none" }}>
                    <CardContent
                      className="comment_box comment_box_reels_mobile"
                      component="form"
                      noValidate
                      autoComplete="off"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmitComment(event, reel_ids, commentlist ? commentlist.length : 0);
                      }}
                    >
                      <CssTextField
                        fullWidth
                        multiline
                        value={postcomment}
                        onChange={(e) => setPostComment(e.target.value)}
                        label="Add a Comment"
                        id="custom-css-outlined-input"
                        className="rounded-pill"
                        error={Boolean(error)}
                        helperText={error}
                        onFocus={handleAuthCheck}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <div onClick={toggleEmojiPicker} className="emoji_icon">
                                {isEmojiPickerOpen ? <KeyboardIcon /> : <EmojiEmotionsIcon />}
                              </div>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <IconButton type="submit" sx={{ paddingTop: "0px" }}>
                        <img
                          src={SendIcon}
                          alt="send_icon"
                          style={{ transform: "rotate(45deg)" }}
                        />
                      </IconButton>
                    </CardContent>
                  </div>
                </Card>
              </SwipeableDrawer>
            </Root>
          )}
          {showModel && (
            <AuthModel
              message={
                actionType === "like"
                  ? "Sign in to make your opinion count."
                  : actionType === "Subscribe"
                  ? "Sign in to subscribe to this user."
                  : actionType === "Comment"
                  ? "Sign in to make your Comment."
                  : actionType === "Report"
                  ? "Sign in to Report."
                  : ""
              }
              heading={
                actionType === "like"
                  ? "Like this Quicky?"
                  : actionType === "Subscribe"
                  ? "Want to subscribe to this user?"
                  : actionType === "Comment"
                  ? "Comment this video?"
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
          {showShareModal && (
            <Share_model title={title} shareUrl={shareUrl} handleClose={handleCloseShare} />
          )}
          {reportModelOpen && (
            <Report_model
              status_open={true}
              onClose={handleCloseModal}
              onSucces={handleOnsuccesModel}
              type_id={reportButtonOpen}
              report_type={"reels"}
            />
          )}
          <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
              Report Successfully Submitted!
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

Reels_card.propTypes = {
  reels: PropTypes.object.isRequired, // Assuming reels is an object with a 'data' array
  handleArrowClickArrow: PropTypes.string,
  DefultIndexNumber: PropTypes.number,
  onIndexChange: PropTypes.func,
  window: PropTypes.func,
};

export default Reels_card;
