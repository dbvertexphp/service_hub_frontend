import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
const base_url = process.env.REACT_APP_BASE_URL;
import Cookies from "js-cookie";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
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
import { WebsiteApi } from "Api/WebsiteApi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLikeCount } from "Actions/UserActivity";
import PropTypes from "prop-types"; // Import PropTypes
import Share_model from "../model_components/share_model";
import Report_model from "../model_components/report_model";
import { Popper } from "@mui/base/Popper";
import { styled } from "@mui/material/styles";
import { css } from "@mui/system";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { setProfileUrl } from "Actions/UserProfileActions";
import { getUserdataCookie } from "cookies.js";

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
export default function TimelineCard({ timelines }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeline_user_id, setTimeline_user_id] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [showSubscribe_model, setSubscribe_model] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment
  const getWebsiteToken = Cookies.get("Websitetoken");
  const [likeCounts, setlikeCounts] = useState({});
  const [likeStatuses, setLikeStatuses] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareModalId, setShareModaId] = useState("null");
  const [title, setTitle] = useState(""); // Set your default title
  const [shareUrl, setShareUrl] = useState(""); // Set your default share URL
  const [showFullDescriptions, setShowFullDescriptions] = useState(
    new Array(timelines.length).fill(false)
  );
  const userCookieData = getUserdataCookie("Userdata");

  // Report Model
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportButtonOpen, setReportButtonOpen] = useState("null");
  const [reportModelOpen, setReportModelOpen] = useState("null");
  const [isreportModalOpen, setIsReportModalOpen] = useState(false);
  const popperRef = useRef(null);
  const [openAlert, setOpenAlert] = React.useState(false);
  const timelineRefs = useRef([]);
  const observer = useRef(null);
  const isBelow500px = useMediaQuery("(max-width:500px)");

  const [subscribeStatus, setSubscribeStatus] = useState(
    timelines.reduce((statuses, timeline) => {
      statuses[timeline.user_id._id] = timeline.subscribe_status === "Yes" ? "Yes" : "No";
      return statuses;
    }, {})
  );

  const handleLike = async (post_timeline_id, TypeNumber, likeCount) => {
    if (getWebsiteToken) {
      try {
        const response = await WebsiteApi.updatePostTimelineLike(post_timeline_id, TypeNumber);
        if (response && response.status && response.data) {
          // Update the likeCount based on TypeNumber
          const updatedLikeCount = TypeNumber === "1" ? likeCount + 1 : Math.max(likeCount - 1, 0);

          console.log("updatedLikeCount", updatedLikeCount);

          setlikeCounts((prevStatuses) => ({
            ...prevStatuses,
            [post_timeline_id]: updatedLikeCount,
          }));

          // Update the like status in the local state
          setLikeStatuses((prevStatuses) => ({
            ...prevStatuses,
            [post_timeline_id]: TypeNumber === "1" ? "Yes" : "No",
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

  const handleSubscribe = async (timeline_user_id) => {
    if (getWebsiteToken) {
      setSubscribe_model(true);
      setTimeline_user_id(timeline_user_id);
    } else {
      setActionType("Subscribe");
      setShowModel(true);
    }
  };

  const handleSubscribeResponse = (response) => {
    handleSubscribeTimeline(timeline_user_id, response);
    setSubscribe_model(false);
  };

  const handleSubscribeTimeline = async (timeline_user_id, response) => {
    if (response == "Subscription") {
      try {
        const response = await WebsiteApi.SubscribeRequest(timeline_user_id);
        if (response && response.status) {
          const updatedStatus = subscribeStatus[timeline_user_id] === "Yes" ? "No" : "Yes";
          setSubscribeStatus((prevStatuses) => ({
            ...prevStatuses,
            [timeline_user_id]: updatedStatus,
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
  const isSubscribed = (timeline_user_id) => subscribeStatus[timeline_user_id] === "Yes";

  if (timelines.length === 0) {
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
            Timeline Post Not Found
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleShare = async (timeline_id, title) => {
    setTitle(title);
    setShareUrl(`${base_url}/website-timeline-comment/${timeline_id}`);
    setShowShareModal(true);
    setShareModaId(timeline_id);
  };
  const handleClose = () => {
    setShowShareModal(false);
  };

  const handleReportModelOpen = (timelineid) => {
    setAnchorEl(null);
    if (getWebsiteToken) {
      setReportModelOpen(timelineid);
      setReportButtonOpen(timelineid);
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
  return timelines.map((timeline, index) => {
    const isLiked =
      likeStatuses[timeline._id] === "Yes" ||
      (likeStatuses[timeline._id] == undefined && timeline.like_status === "Yes");

    const likeCount =
      likeCounts[timeline._id] !== undefined ? likeCounts[timeline._id] : timeline.like_count || 0;

    const isTimelineSubscribed =
      isSubscribed(timeline.user_id._id) || timeline.subscribe_status === "Yes";

    const userAvatar = timeline.user_id.pic.includes("defult_pic.jpg") ? (
      <Avatar sx={{ bgcolor: red[500], width: 36, height: 36 }} aria-label="recipe">
        {`${timeline.user_id.first_name.charAt(0)}${timeline.user_id.last_name.charAt(0)}`}
      </Avatar>
    ) : (
      <Avatar alt="Remy Sharp" src={timeline.user_id.pic} sx={{ width: 36, height: 36 }} />
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
      <div key={index}>
        <Card
          className="Video_list_card"
          key={index}
          sx={{ maxWidth: "-webkit-fill-available", marginTop: isBelow500px ? "10px" : "30px" }}
        >
          <CardHeader
            action={
              <LightTooltip
                placement="bottom-end"
                title={
                  <span>
                    <span onClick={(event) => handleReportModelOpen(timeline._id)}>Report</span>
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
                  userCookieData._id === timeline.user_id._id
                    ? `/website-my-profile-view`
                    : `/Website-user-profile-view/${timeline.user_id._id}`
                }
              >
                <div
                  onClick={() => {
                    ProfileUrl(timeline.user_id._id);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {userAvatar}
                </div>
              </Link>
            }
            title={
              <div>
                <Typography variant="h6">
                  <Link
                    to={
                      userCookieData._id === timeline.user_id._id
                        ? `/website-my-profile-view`
                        : `/Website-user-profile-view/${timeline.user_id._id}`
                    }
                    className="video_card_user_name_title"
                  >
                    {`${timeline.user_id.first_name} ${timeline.user_id.last_name}`}
                  </Link>
                </Typography>
              </div>
            }
            subheader={
              <Typography
                elevation={8}
                variant="subtitle1"
                className="video_card_user_name_subheader rounded-pill"
              >
                {timeline.category_id.category_name}
              </Typography>
            }
          />

          <CardMedia>
            <Typography variant="body2" className="video_card_desc_title">
              {`${timeline.title}`}
            </Typography>
            <div
              style={{
                marginTop: "20px",
              }}
            >
              <span
                className="video_card_desc"
                dangerouslySetInnerHTML={{
                  __html: showFullDescriptions[index]
                    ? timeline.description
                        .replace(/(?:\n|\\n)/g, "<br/>")
                        .replace(/\\ntest/g, "<br/>test")
                    : timeline.description
                        .slice(0, 200)
                        .replace(/(?:\n|\\n)/g, "<br/>")
                        .replace(/\\ntest/g, "<br/>test"),
                }}
              />
              {timeline.description.length > 200 && (
                <span
                  style={{
                    marginTop: "10px",
                    fontSize: "18px",
                    cursor: "pointer",
                    color: "blue",
                    fontWeight: "600",
                    fontFamily: "Abhaya Libre",
                  }}
                  onClick={() => handleToggleDescription(index)}
                >
                  {showFullDescriptions[index] ? "Show Less" : " ...Show More"}
                </span>
              )}
            </div>
          </CardMedia>
          <CardActions disableSpacing sx={{ paddingBottom: "20px" }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", minWidth: "60px" }}>
              <IconButton
                aria-label="add to favorites"
                className="details_icon_css"
                sx={{ marginLeft: "10px" }}
                onClick={() => handleLike(timeline._id, isLiked ? "0" : "1", likeCount)}
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
                  to={`/website-timeline-comment/${timeline._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <BiCommentDetail />
                </Link>

                <Typography className="vide_card_count" sx={{ marginLeft: "8px" }}>
                  {timeline.comment_count}
                </Typography>
              </IconButton>
            </Box>
            <IconButton aria-label="share" className="details_icon_css" sx={{ marginLeft: "10px" }}>
              <IoMdShare onClick={() => handleShare(timeline._id, timeline.title)} />
            </IconButton>
            {timeline.user_id._id !== userCookieData._id && (
              <Button
                variant="contained"
                sx={{ marginLeft: "auto" }}
                className={`${
                  isTimelineSubscribed ? "subcribe_button" : "subcribe_button"
                } rounded-pill`}
                onClick={() => handleSubscribe(timeline.user_id._id)}
                disabled={isTimelineSubscribed}
              >
                {isTimelineSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            )}
          </CardActions>

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
                  ? "Like this timeline?"
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
          {showShareModal && shareModalId == timeline._id && (
            <Share_model title={title} shareUrl={shareUrl} handleClose={handleClose} />
          )}
          {reportModelOpen === timeline._id && (
            <Report_model
              status_open={true}
              onClose={handleCloseModal}
              onSucces={handleOnsuccesModel}
              type_id={reportButtonOpen}
              report_type={"timeline"}
            />
          )}
        </Card>
        <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
            Report Successfully Submitted!
          </Alert>
        </Snackbar>
      </div>
    );
  });
}

TimelineCard.propTypes = {
  timelines: PropTypes.array.isRequired,
};
