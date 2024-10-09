import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Typography, Card, CardHeader, Avatar, Box, Grid, Paper } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { WebsiteApi } from "Api/WebsiteApi";
import Backbutton from "./Backbutton.js";
import Chat_icon from "../../assets/website_img/chat_icon.svg";
import { setProfileUrl } from "Actions/UserProfileActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setChatId } from "../../Actions/ChatActions.js";
import { getUserdataCookie } from "cookies.js";
export default function TimelineList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [joblist, setjobsList] = useState([]);
  const { job_id } = useParams();
  const jobBoxRef = useRef(null);
  const userCookieData = getUserdataCookie("Userdata");

  useEffect(() => {
    const fetchAppliedData = async (job_id) => {
      try {
        const response = await WebsiteApi.getAppliedUsers(job_id);

        if (response && response.status && response.data) {
          const jobsList = response.data;
          setjobsList(jobsList);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAppliedData(job_id);
  }, [job_id]);

  const CheckAuth = async (event, userId) => {
    if (event === "Chat") {
      const chatId = await dispatch(setChatId(userId));
      navigate(`/website-chat/${chatId}`);
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

  const ProfileUrl = async (userId) => {
    const profileUrl = await dispatch(setProfileUrl(userId));
    if (profileUrl) {
      navigate(profileUrl);
    } else {
      console.error("Failed to get profile URL.");
    }
  };

  return (
    <div>
      <Card className="Fix_height_with_sreachbar">
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Typography sx={{ alignSelf: "center" }} className="applied_Heading">
          Applied User
        </Typography>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={9} className="">
            <Box sx={{ paddingBottom: "10px", maxHeight: "200px" }}>
              <Box
                sx={{
                  paddingBottom: "10px",
                  minHeight: "200px",
                  overflow: "auto",
                }}
                ref={jobBoxRef}
              >
                {joblist.length === 0 ? (
                  <Box sx={{ textAlign: "center", paddingTop: "10%" }}>
                    <Typography variant="body1" className="applied_user_name_title">
                      No one applied for the job
                    </Typography>
                  </Box>
                ) : (
                  joblist.map((job) => (
                    <div key={job._id} className="list_box">
                      <CardHeader
                        avatar={
                          <Link
                            to={
                              userCookieData._id === job.user_id._id
                                ? `/website-my-profile-view`
                                : `/Website-user-profile-view/${job.user_id._id}`
                            }
                          >
                            <div
                              // onClick={() => {
                              //   ProfileUrl(job.user_id._id);
                              // }}
                              style={{ cursor: "pointer" }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor:
                                    job.user_id.pic && job.user_id.pic.includes("defult_pic.jpg")
                                      ? deepOrange[500]
                                      : undefined,
                                  width: 40,
                                  height: 40,
                                }}
                                aria-label="recipe"
                              >
                                {job.user_id.pic && !job.user_id.pic.includes("defult_pic.jpg") ? (
                                  <img
                                    alt={`Avatar for ${job.user_id.first_name}`}
                                    src={job.user_id.pic}
                                    style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                                  />
                                ) : (
                                  `${job.user_id.first_name.charAt(
                                    0
                                  )}${job.user_id.last_name.charAt(0)}`
                                )}
                              </Avatar>
                            </div>
                          </Link>
                        }
                        sx={{ paddingBottom: "0px" }}
                        title={
                          <div
                            onClick={() => {
                              ProfileUrl(job.user_id._id);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <Typography variant="h3" className="applied_user_name_title">
                              <Link
                                to={
                                  userCookieData._id === job.user_id._id
                                    ? `/website-my-profile-view`
                                    : `/Website-user-profile-view/${job.user_id._id}`
                                }
                              >
                                {`${job.user_id.first_name} ${job.user_id.last_name}`}
                              </Link>
                            </Typography>
                          </div>
                        }
                        action={
                          <img
                            src={Chat_icon}
                            alt="page"
                            style={{ marginTop: "26px", cursor: "pointer" }}
                            onClick={() => {
                              CheckAuth("Chat", job.user_id._id);
                            }}
                          />
                        }
                      />
                    </div>
                  ))
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
