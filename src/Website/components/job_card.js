import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { IoMdShare } from "react-icons/io";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Job_model from "../model_components/permission_model";
import AuthModel from "./Authmodel";
import PropTypes from "prop-types";
import { WebsiteApi } from "Api/WebsiteApi";
import { setProfileUrl } from "Actions/UserProfileActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserdataCookie } from "cookies.js";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const VideoCard = ({ jobs, My_Job_list }) => {
  const [showModel, setShowModel] = useState(false);
  const [job_id, setJob_id] = useState(null);
  const [actionType, setActionType] = useState("");
  const [showJob_model, setJob_model] = useState(false);
  const getWebsiteToken = Cookies.get("Websitetoken");
  const [expandedDescriptions, setExpandedDescriptions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userCookieData = getUserdataCookie("Userdata");
  const [showFullDescriptions, setShowFullDescriptions] = useState(
    new Array(jobs.length).fill(false)
  );

  const [applyStatus, setApplyStatus] = useState(
    jobs.reduce((statuses, job) => {
      statuses[job._id] = job.apply_status === "Yes" ? "Yes" : "No";
      return statuses;
    }, {})
  );

  const [jobStatus, setJobStatus] = useState(
    jobs.reduce((statuses, job) => {
      statuses[job._id] = job.job_status === "Open" ? "Open" : "Close";
      return statuses;
    }, {})
  );

  const handleJob = (job_id) => {
    if (getWebsiteToken) {
      setActionType("Apply");
      setJob_model(true);
      setJob_id(job_id);
    } else {
      if (applyStatus[job_id] === "Yes") {
        // User has already applied
        // Handle accordingly, e.g., show a message or perform some action
      } else {
        // User has not applied
        // Show the apply confirmation modal or perform other actions
        setActionType("Apply");
        setShowModel(true);
      }
    }
  };
  const handleJobStatus = (job_id, status) => {
    setActionType(status);
    setJob_model(true);
    setJob_id(job_id);
  };

  const handleJobResponse = (response) => {
    handleJobJob(job_id, response);
    setJob_model(false);
  };

  const handleJobJob = async (job_id, response) => {
    if (response === "Apply") {
      try {
        const response = await WebsiteApi.appliedPostJob(job_id);
        if (response && response.status) {
          setApplyStatus((prevStatuses) => ({
            ...prevStatuses,
            [job_id]: prevStatuses[job_id] === "Yes" ? "No" : "Yes",
          }));
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    if (response === "Close") {
      try {
        const closeResponse = await WebsiteApi.updateJobStatus(job_id, 1);
        if (closeResponse && closeResponse.status) {
          const updatedStatus = jobStatus[job_id] === "Open" ? "Close" : "Close";
          setJobStatus((prevStatuses) => ({
            ...prevStatuses,
            [job_id]: updatedStatus,
          }));
          console.log(updatedStatus);
        } else {
          console.error("Invalid API response format:", closeResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  // const handleToggleDescription = (index) => {
  //   setExpandedDescriptions((prevState) => {
  //     const newState = [...prevState];
  //     newState[index] = !newState[index];
  //     return newState;
  //   });
  // };

  const handleToggleDescription = (index) => {
    const updatedShowFullDescriptions = [...showFullDescriptions];
    updatedShowFullDescriptions[index] = !updatedShowFullDescriptions[index];
    setShowFullDescriptions(updatedShowFullDescriptions);
  };

  const ProfileUrl = async (userId) => {
    const profileUrl = await dispatch(setProfileUrl(userId));
    if (profileUrl) {
      navigate(profileUrl);
    } else {
      console.error("Failed to get profile URL.");
    }
  };
  if (jobs.length === 0) {
    return (
      <Box sx={{ flexGrow: 1, justifyContent: "center", alignSelf: "center", marginTop: "20px" }}>
        <Box>
          <Typography variant="body1" color="error" className="video_home_card_hending_Not_found">
            Jobs Not Found
          </Typography>
        </Box>
      </Box>
    );
  }

  const isJobd = (job_user_id) => applyStatus[job_user_id] === "Yes";
  const isjobStatus = (job_user_id) => jobStatus[job_user_id] === "Close";

  return jobs.map((job, index) => {
    const isJobApply = isJobd(job._id) || job.apply_status === "Yes";
    const isjobStatuschecke = isjobStatus(job._id) || job.job_status === "Close";
    const userAvatar = job.user_id.pic.includes("defult_pic.jpg") ? (
      <Avatar sx={{ bgcolor: red[500], width: 36, height: 36 }} aria-label="recipe">
        {`${job.user_id.first_name.charAt(0)}${job.user_id.last_name.charAt(0)}`}
      </Avatar>
    ) : (
      <Avatar alt="Remy Sharp" src={job.user_id.pic} sx={{ width: 36, height: 36 }} />
    );

    return (
      <Card
        className="Video_list_card"
        key={index}
        sx={{ maxWidth: "-webkit-fill-available", marginTop: "20px" }}
      >
        <CardHeader
          action={<IconButton aria-label="settings"></IconButton>}
          avatar={
            <Link
              to={
                userCookieData._id === job.user_id._id
                  ? `/website-my-profile-view`
                  : `/Website-user-profile-view/${job.user_id._id}`
              }
            >
              <div
                //   onClick={() => {
                //     ProfileUrl(job.user_id._id);
                //   }}
                style={{ cursor: "pointer" }}
              >
                {userAvatar}
              </div>
            </Link>
          }
          title={
            <div
              //   onClick={() => {
              //     ProfileUrl(job.user_id._id);
              //   }}
              style={{ cursor: "pointer" }}
            >
              <Typography variant="h6">
                <Link
                  to={
                    userCookieData._id === job.user_id._id
                      ? `/website-my-profile-view`
                      : `/Website-user-profile-view/${job.user_id._id}`
                  }
                  className="video_card_user_name_title"
                >
                  {`${job.user_id.first_name} ${job.user_id.last_name}`}
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
              {job.category_id.category_name}
            </Typography>
          }
        />
        {/* <CardMedia>
          <Typography variant="body2" className="video_card_desc_title">
            {`${job.title}`}
          </Typography>
           <Typography variant="body2" className="video_card_desc" style={{ marginTop: "10px" }}>
            {expandedDescriptions[index] ? job.description : `${job.description.slice(0, 100)}`}
          </Typography>
          {job.description.length > 100 && (
            <Typography
              className="video_card_desc"
              sx={{ marginTop: "10px", fontSize: "20px", cursor: "pointer", color: "blue" }}
              onClick={() => handleToggleDescription(index)}
            >
              {expandedDescriptions[index] ? "Show Less" : "See More"}
            </Typography>
          )} 
        </CardMedia> */}
        <CardMedia>
          <Typography variant="body2" className="video_card_desc_title">
            {`${job.title}`}
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
                  ? job.description.replace(/(?:\n|\\n)/g, "<br/>").replace(/\\ntest/g, "<br/>test")
                  : job.description
                      .slice(0, 200)
                      .replace(/(?:\n|\\n)/g, "<br/>")
                      .replace(/\\ntest/g, "<br/>test"),
              }}
            />
            {job.description.length > 200 && (
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
                {showFullDescriptions[index] ? " Show Less" : " ... See More"}
              </span>
            )}
          </div>
        </CardMedia>
        <CardActions disableSpacing sx={{ paddingBottom: "20px" }}>
          <IconButton
            aria-label="share"
            className="details_icon_css"
            sx={{ marginLeft: "10px" }}
          ></IconButton>
          {My_Job_list === "My_Job_list" ? (
            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="contained"
                sx={{ marginLeft: "auto" }}
                className={`${
                  isjobStatuschecke ? "close_button_My_list" : "closed_button_My_list"
                } rounded-pill`}
                onClick={() => handleJobStatus(job._id, "Close")}
                disabled={isjobStatuschecke}
              >
                {isjobStatuschecke ? "Closed" : "Close"}
              </Button>
              <Link to={`/website-user-applied-job/${job._id}`}>
                <Button
                  variant="contained"
                  sx={{ marginLeft: "auto" }}
                  className={"subcribe_button rounded-pill"}
                  onClick={() => handleJob(job._id)}
                >
                  View All ({job.applied_count})
                </Button>
              </Link>
            </div>
          ) : job.job_status === "Open" ? (
            userCookieData._id != job.user_id._id && (
              <Button
                variant="contained"
                sx={{ marginLeft: "auto" }}
                className={`${isJobApply ? "subcribe_button" : "subcribe_button"} rounded-pill`}
                onClick={() => handleJob(job._id)}
                disabled={isJobApply || isjobStatuschecke} // Disable if job is closed or already applied
              >
                {isJobApply ? "Applied" : "Apply"}
              </Button>
            )
          ) : (
            userCookieData._id != job.user_id._id && (
              <Button
                variant="contained"
                sx={{ marginLeft: "auto" }}
                className="close_button rounded-pill"
                disabled
              >
                Close
              </Button>
            )
          )}
        </CardActions>

        {showModel && (
          <AuthModel
            message={
              actionType === "Apply"
                ? "Sign in to make Apply."
                : actionType === "Job"
                ? "Sign in to subscribe to this users."
                : ""
            }
            heading={
              actionType === "Apply"
                ? "Apply this job?"
                : actionType === "Job"
                ? "Want to subscribe to this channel?"
                : ""
            }
            onClose={() => setShowModel(false)}
          />
        )}
        {showJob_model && (
          <Job_model
            onClose={() => setJob_model(false)}
            onSubscribe={handleJobResponse}
            message={"Do you want to apply for this job?"}
            heading={"Apply Job"}
            ButtonText={actionType}
            ButtonValue={actionType}
          />
        )}
      </Card>
    );
  });
};

VideoCard.propTypes = {
  jobs: PropTypes.array.isRequired,
  My_Job_list: PropTypes.string, // Make it optional by removing the `isRequired`
};

export default VideoCard;
