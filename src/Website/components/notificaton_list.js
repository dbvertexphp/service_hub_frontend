import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import Button from "@mui/material/List";
import Card from "@mui/material/Card";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { WebsiteApi } from "Api/WebsiteApi";
import Backbutton from "./Backbutton.js";
import createAvatar from "../Utils/avatarUtils";
import { setProfileUrl } from "Actions/UserProfileActions";
import { set_Notification_Type } from "Actions/UserActivity.js";
import { getUserdataCookie } from "cookies.js";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function NotificationList() {
  const [notificationList, setNotificationList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [status_id, setStatus] = useState("");
  const [accpetbuttonVisible, setAcceptButtonVisible] = useState(true);
  const [hiddenButtons, setHiddenButtons] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userCookieData = getUserdataCookie("Userdata");
  const isBelow500px = useMediaQuery("(max-width:500px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await WebsiteApi.NotificationList(1);

        if (response && response.status && Array.isArray(response.notifications)) {
          setNotificationList(response.notifications);
        } else {
          // console.error("Invalid API response format:", response);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  const acceptAndRemoveClubRequest = async (club_id, status, first_name, notificetion_id) => {
    setStatus(`${first_name} club request was Accpet`);

    try {
      const response = await WebsiteApi.AcceptClubRequest(club_id, status, notificetion_id);
      if (response && response.status) {
        setHiddenButtons((prevHiddenButtons) => ({
          ...prevHiddenButtons,
          [notificetion_id]: true, // Hide the button for the clicked notification
        }));
        setOpen(true);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleNotificationClick = async (type, metadata, message) => {
    console.log(message);
    if (message == "Sent Club Request") {
      const Type_Redux = "Club_Requests";
      await dispatch(set_Notification_Type(Type_Redux));
    } else if (message == "Your request has been accepted") {
      const Type_Redux = "My_Club";
      await dispatch(set_Notification_Type(Type_Redux));
    } else if (message == "Accept Club Request") {
      const Type_Redux = "Club_Add";
      await dispatch(set_Notification_Type(Type_Redux));
    }

    switch (type) {
      case "Payment":
      case "Completed":
      case "Review":
        navigate("/website-hire-list");
        break;
      case "Friend_Request":
      case "Request_Accept":
        navigate("/website-friend-list");
        break;
      // Add more cases for other notification types if needed
      case "Applied_Job":
        navigate(`/website-user-applied-job/${metadata.Job_id}`);
        break;
      default:
        break;
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
    <Card className="Fix_height_without_sreachbar">
      <div className="back_button_css">
        <Backbutton />
      </div>
      <Typography className="Edit_profile_heading" sx={{ textAlign: "center" }}>
        Notification
      </Typography>
      <div className="latest_jab_div">
        {notificationList.length === 0 ? (
          <Typography
            sx={{ textAlign: "center", marginTop: 2 }}
            className="applied_user_name_title"
          >
            Notification Not Found
          </Typography>
        ) : (
          <List
            sx={{
              width: "100%",
              maxWidth: "auto",
              bgcolor: "background.paper",
            }}
            style={{ paddingBottom: 15 }}
          >
            {notificationList.map((notification) => (
              <React.Fragment key={notification._id}>
                <ListItem sx={{ marginTop: "13px" }}>
                  <ListItemAvatar sx={{ marginLeft: "13px" }}>
                    <Link
                      to={
                        userCookieData._id === notification.sender._id
                          ? `/website-my-profile-view`
                          : `/Website-user-profile-view/${notification.sender._id}`
                      }
                    >
                      <div
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                          textDecorationStyle: "solid",
                          textDecorationColor: "blue",
                        }}
                      >
                        {/* createAvatar function ko call karein */}
                        {createAvatar(
                          notification.sender.pic,
                          notification.sender.first_name,
                          notification.sender.last_name,
                          isBelow500px ? "notification_list_mobile" : "notification_list"
                        )}
                      </div>
                    </Link>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <div className="notification_sender_name">
                          <Link
                            to={
                              userCookieData._id === notification.sender._id
                                ? `/website-my-profile-view`
                                : `/Website-user-profile-view/${notification.sender._id}`
                            }
                            className="notification_sender_name"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {notification.sender.first_name}
                          </Link>
                        </div>
                        <div>&nbsp;</div>
                        <div className="notification_message">{notification.message}</div>
                      </div>
                    }
                    secondary={
                      <div>
                        <div className="notification_message">
                          {notification.type === "Payment" && (
                            <div>Booking Date {notification.date}</div>
                          )}
                        </div>
                        <div className="notification_message">{notification.time}</div>
                      </div>
                    }
                    onClick={() =>
                      handleNotificationClick(
                        notification.type,
                        notification?.metadata,
                        notification.message
                      )
                    }
                    className="Latest_Jobs_user_name"
                  />
                  {notification.type === "Friend_Request" && !hiddenButtons[notification._id] && (
                    <Button
                      className="Friend_Request_button rounded-pill"
                      onClick={() =>
                        acceptAndRemoveClubRequest(
                          notification.sender._id,
                          1,
                          notification.sender.first_name,
                          notification._id
                        )
                      }
                    >
                      Accept
                    </Button>
                  )}
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
          {status_id}!
        </Alert>
      </Snackbar>
    </Card>
  );
}
