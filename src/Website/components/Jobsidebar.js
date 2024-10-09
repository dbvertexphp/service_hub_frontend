import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { WebsiteApi } from "Api/WebsiteApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSidebarNumber } from "../../Actions/AuthActions";
import { Link } from "react-router-dom";
import createAvatar from "../Utils/avatarUtils";
import { setCategory_id } from "Actions/CategoryActions";
import { setProfileUrl } from "Actions/UserProfileActions";
import ChatSkeleton from "../Skeleton/chat_skeleton";
import { getUserdataCookie, checkCookies } from "cookies";
import AuthModel from "./Authmodel";

function JobSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [thumbnails, setThumbnails] = useState([]);
  const [jobNotFound, setJobNotFound] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment
  const userCookieData = getUserdataCookie("Userdata");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await WebsiteApi.getPaginatedJob(1);

        if (response && response.status && Array.isArray(response.data)) {
          setThumbnails(response.data);
          setJobNotFound(response.data.length === 0);
        } else {
          console.error("Invalid API response format:", response);
          setJobNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setJobNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ProfileUrl = async (userId) => {
    const profileUrl = await dispatch(setProfileUrl(userId));
    if (profileUrl) {
      navigate(profileUrl);
    } else {
      console.error("Failed to get profile URL.");
    }
  };

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

  return (
    <div className="latest_jab_div">
      <List
        sx={{
          width: "100%",
          maxWidth: "auto",
          bgcolor: "background.paper",
        }}
        style={{ paddingBottom: 15 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingLeft: "15px",
            paddingRight: "15px",
          }}
        >
          <Typography level="h1" className="Latest_Jobs_heading">
            Latest Work
          </Typography>
          <span style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
            <Typography level="h1" className="Latest_Jobs_heading">
              {checkCookies() ? (
                <Link
                  to={`/website-job-list`}
                  onClick={(event) => event.stopPropagation()}
                  className="Latest_Jobs_heading"
                >
                  See All
                </Link>
              ) : (
                <div
                  onClick={(event) => {
                    CheckAuth("Job_List");
                  }}
                  className="Latest_Jobs_heading"
                >
                  See All
                </div>
              )}
            </Typography>
          </span>
        </div>
        {loading ? (
          <div>
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {thumbnails.length === 0 && jobNotFound && (
              <div
                style={{
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlignLast: "center",
                }}
              >
                <Typography variant="body1" color="error" className="video_home_card_hending">
                  Job Not Found
                </Typography>
              </div>
            )}

            {/* Thumbnails Rendering */}
            {thumbnails.map((thumbnail, index) => {
              if (index < 3) {
                const avatarComponentDestop = createAvatar(
                  thumbnail.user_id.pic,
                  thumbnail.user_id.first_name,
                  thumbnail.user_id.last_name,
                  "headerdesktop"
                );

                return (
                  <React.Fragment key={thumbnail._id}>
                    <span
                      style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                      onClick={(event) => {
                        CheckAuth("Job_List");
                      }}
                    >
                      <ListItem
                        alignItems="flex-start"
                        sx={{ marginTop: "0px", marginLeft: "10px", alignItems: "center" }}
                      >
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
                        <ListItemText
                          sx={{
                            marginLeft: "8px",
                            marginRight: "13px",
                          }}
                          level="title-md"
                          primary={
                            <span>
                              {checkCookies() ? (
                                <div>
                                  <Link
                                    to={
                                      userCookieData._id === thumbnail.user_id._id
                                        ? `/website-my-profile-view`
                                        : `/Website-user-profile-view/${thumbnail.user_id._id}`
                                    }
                                    key={thumbnail._id}
                                    onClick={(event) => event.stopPropagation()}
                                    style={{
                                      cursor: "pointer",
                                      color: "#2b6639",
                                      fontFamily: "Port Lligat Sans",
                                      fontSize: "20.161px",
                                      fontStyle: "normal",
                                      fontWeight: "400 ",
                                      letterSpacing: "-0.412px",
                                      width: "fit-content",
                                    }}
                                  >
                                    {`${thumbnail.user_id.first_name} ${thumbnail.user_id.last_name}`}
                                  </Link>
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    ProfileUrl(thumbnail.user_id._id);
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    color: "#2b6639",
                                    fontFamily: "Port Lligat Sans",
                                    fontSize: "20.161px",
                                    fontStyle: "normal",
                                    fontWeight: "400 ",
                                    letterSpacing: "-0.412px",
                                    width: "fit-content",
                                  }}
                                >
                                  {thumbnail.user_id.first_name}
                                </div>
                              )}
                            </span>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                className="Latest_Jobs_user_job"
                              >
                                {thumbnail.title.length > 25
                                  ? `${thumbnail.title.slice(0, 25)}...`
                                  : thumbnail.title}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    </span>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                );
              }
              return null; // Return null if index is not less than 3
            })}
          </div>
        )}
      </List>
      {showModel && (
        <AuthModel
          message={actionType === "Job_List" ? "Sign in to View Job List." : ""}
          heading={actionType === "Job_List" ? "Job List" : ""}
          onClose={() => setShowModel(false)}
        />
      )}
    </div>
  );
}

export default JobSidebar;
