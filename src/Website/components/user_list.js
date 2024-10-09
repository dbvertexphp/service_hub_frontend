import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatSkeleton from "../Skeleton/chat_skeleton";
import {
  Typography,
  Card,
  CardHeader,
  Avatar,
  Box,
  Grid,
  Paper,
  Button,
  Stack,
  Snackbar,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { WebsiteApi } from "Api/WebsiteApi";
import Backbutton from "./Backbutton.js";
import Chat_icon from "../../assets/website_img/chat_icon.svg";
import MuiAlert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { setChatId } from "../../Actions/ChatActions.js";
import { getUserdataCookie, checkCookies } from "cookies";
import AuthModel from "./Authmodel";
import { setProfileUrl } from "Actions/UserProfileActions";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SubscriptionList() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [subscriberlist, setSubscriberList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment
  const [loading, setLoading] = useState(false);
  const reduxsearch_data = useSelector((state) => state.searchReducer.search_data);
  const userCookieData = getUserdataCookie("Userdata");

  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const search = reduxsearch_data;
      const response = await WebsiteApi.getAllUsersWebsite(page, search);

      if (response && response.status && response.data) {
        const newSubscriberList = [...subscriberlist, ...response.data];
        setSubscriberList(newSubscriberList);
        setPage(page + 1);
        setHasMore(response.data.length > 0);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const CheckAuth = async (event, userId) => {
    if (checkCookies()) {
      if (event === "Chat") {
        const chatId = await dispatch(setChatId(userId));
        navigate(`/website-chat/${chatId}`);
      }
    } else {
      setActionType(event);
      setShowModel(true);
    }
  };

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
      <Card className="" sx={{ paddingBottom: "10px", minHeight: "91vh" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
          <Typography className="Edit_Subscription_heading">Users</Typography>
        </Stack>
        <Stack
          sx={{
            background: "#F8F8F8",
            marginTop: "15px",
            paddingTop: "15px",
            paddingBottom: "15px",
            background: "#FAFAFA",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        ></Stack>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={9} className="">
            <Box sx={{ paddingBottom: "10px", paddingTop: "30px", maxHeight: "auto" }}>
              <InfiniteScroll
                dataLength={subscriberlist.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p></p>}
                scrollThreshold={0.9}
              >
                {subscriberlist.length === 0 ? (
                  <Box sx={{ textAlign: "center", paddingTop: "10%" }}>
                    <Typography variant="body1" className="applied_user_name_title">
                      No Subscribers List
                    </Typography>
                  </Box>
                ) : (
                  subscriberlist.map((subscriber) => (
                    <div key={subscriber._id} className="list_box">
                      {loading ? (
                        <div key={subscriber._id}>
                          <ChatSkeleton />
                        </div>
                      ) : (
                        <CardHeader
                          avatar={
                            <div
                              // onClick={() => {
                              //   ProfileUrl(subscriber._id);
                              // }}
                              style={{ cursor: "pointer" }}
                            >
                              <Link
                                to={
                                  userCookieData._id === subscriber._id
                                    ? `/website-my-profile-view`
                                    : `/Website-user-profile-view/${subscriber._id}`
                                }
                              >
                                <Avatar
                                  sx={{
                                    bgcolor:
                                      subscriber.pic && subscriber.pic.includes("defult_pic.jpg")
                                        ? deepOrange[500]
                                        : undefined,
                                    width: 40,
                                    height: 40,
                                  }}
                                  aria-label="recipe"
                                >
                                  {subscriber.pic && !subscriber.pic.includes("defult_pic.jpg") ? (
                                    <img
                                      alt={`Avatar for ${subscriber.first_name}`}
                                      src={subscriber.pic}
                                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                                    />
                                  ) : (
                                    `${subscriber.first_name.charAt(
                                      0
                                    )}${subscriber.last_name.charAt(0)}`
                                  )}
                                </Avatar>
                              </Link>
                            </div>
                          }
                          sx={{ paddingBottom: "0px" }}
                          title={
                            <div
                              onClick={() => {
                                ProfileUrl(subscriber._id);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <Typography variant="h3">
                                <Link
                                  to={
                                    userCookieData._id === subscriber._id
                                      ? `/website-my-profile-view`
                                      : `/Website-user-profile-view/${subscriber._id}`
                                  }
                                  className="applied_user_name_title"
                                >
                                  {`${subscriber.first_name} ${subscriber.last_name}`}
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
                                CheckAuth("Chat", subscriber._id);
                              }}
                            />
                          }
                        />
                      )}
                    </div>
                  ))
                )}
              </InfiniteScroll>
            </Box>
          </Grid>
        </Grid>

        {showModel && (
          <AuthModel
            message={actionType === "Chat" ? "Sign in to chat with the user." : ""}
            heading={actionType === "Chat" ? "Do you want to chat with the user ?" : ""}
            onClose={() => setShowModel(false)}
          />
        )}
      </Card>
    </div>
  );
}
