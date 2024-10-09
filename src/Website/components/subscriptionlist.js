import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
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
import ChatSkeleton from "../Skeleton/chat_skeleton";
import { useParams } from "react-router-dom";
import { WebsiteApi } from "Api/WebsiteApi";
import Backbutton from "./Backbutton.js";
import Chat_icon from "../../assets/website_img/chat_icon.svg";
import MuiAlert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { setChatId } from "../../Actions/ChatActions.js";
import { getUserdataCookie, checkCookies } from "cookies";
import AuthModel from "./Authmodel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setProfileUrl } from "Actions/UserProfileActions";
import ButtonJoy from "@mui/joy/Button";
import DraggableDialog from "../model_components/permission_model";

export default function SubscriptionList() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [subscriberlist, setsubscribersList] = useState([]);
  const subscriberBoxRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState("My_Subscriber");
  const [unsubscriberbutton, setUnSubscriberButton] = useState(true);
  const [first_name, setFirst_name] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment
  const userCookieData = getUserdataCookie("Userdata");

  useEffect(() => {
    GetMySubscribe();
  }, []);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChangeFillter = (event) => {
    setSelectedFilter(event.target.value);
    if (event.target.value == "My_Subscriber") {
      setUnSubscriberButton(true);
      GetMySubscribe();
    } else if (event.target.value == "Subscription_Request") {
      setUnSubscriberButton(false);
      fetchDataSubscription_Request();
    }
  };

  const GetMySubscribe = async () => {
    try {
      setLoading(true);
      const response = await WebsiteApi.GetMySubscribe();

      if (response && response.status && response.data) {
        const subscribersList = response.data;
        setsubscribersList(subscribersList);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataSubscription_Request = async () => {
    try {
      setLoading(true);
      const response = await WebsiteApi.getSubscriptionRequest();

      if (response && response.status && response.data) {
        const subscribersList = response.data;
        setsubscribersList(subscribersList);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const UnSubscribeRequest = async (subscriber_id, first_name) => {
    try {
      setLoading(true);
      const response = await WebsiteApi.UnSubscribeRequest(subscriber_id);

      if (response && response.status) {
        const updatedList = subscriberlist.filter((job) => job._id !== subscriber_id);
        setsubscribersList(updatedList);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
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

  // const [loading, setLoading] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  const handleUnsubscribe = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setConfirmationOpen(true);
  };

  const handleCloseConfirmation = (action) => {
    if (action === "Unsubscribe" && selectedSubscriber) {
      UnSubscribeRequest(selectedSubscriber._id, selectedSubscriber.first_name);
    }
    setConfirmationOpen(false);
  };

  return (
    <div>
      <Card className="" sx={{ paddingBottom: "10px", minHeight: "91vh" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
          <Typography className="Edit_Subscription_heading">Subscription</Typography>
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
        >
          <Grid container spacing={2}>
            <Grid item xs={12} className="">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Button
                  value="My_Subscriber"
                  onClick={handleChangeFillter}
                  className={`Calendra_fillter_button_${
                    selectedFilter === "My_Subscriber" ? "select" : "unselect"
                  }`}
                >
                  Subscriber
                </Button>
                <Button
                  value="Subscription_Request"
                  onClick={handleChangeFillter}
                  className={`Calendra_fillter_button_${
                    selectedFilter === "Subscription_Request" ? "select" : "unselect"
                  }`}
                >
                  Subscribed
                </Button>
              </div>
            </Grid>
          </Grid>
        </Stack>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={9} className="">
            <Box sx={{ paddingBottom: "10px", paddingTop: "30px", maxHeight: "auto" }}>
              <Box
                sx={{
                  paddingBottom: "10px",
                  minHeight: "auto",
                  overflow: "auto",
                }}
                ref={subscriberBoxRef}
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
                              onClick={() => {
                                ProfileUrl(subscriber._id);
                              }}
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
                            unsubscriberbutton ? (
                              <img
                                src={Chat_icon}
                                alt="page"
                                style={{ marginTop: "26px", cursor: "pointer" }}
                                onClick={() => {
                                  CheckAuth("Chat", subscriber._id);
                                }}
                              />
                            ) : (
                              <Button
                                variant="contained"
                                sx={{ marginLeft: "auto", marginTop: "16px" }}
                                className="Calendra_fillter_button_select rounded-pill"
                                onClick={() => handleUnsubscribe(subscriber)}
                              >
                                UnSubscribe
                              </Button>
                            )
                          }
                        />
                      )}
                    </div>
                  ))
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
        {confirmationOpen && (
          <DraggableDialog
            onClose={handleCloseConfirmation}
            onSubscribe={handleCloseConfirmation}
            message={`Are you sure you want to unsubscribe ${selectedSubscriber?.first_name}?`}
            heading="Unsubscribe Confirmation"
            ButtonText="Unsubscribe"
            ButtonValue="Unsubscribe"
            open={confirmationOpen}
          />
        )}

        <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
            {first_name} Has Been Unsubscribed!
          </Alert>
        </Snackbar>
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
