import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AuthModel from "../components/Authmodel";
import PropTypes from "prop-types";
import { WebsiteApi } from "Api/WebsiteApi";
import { Typography, Card, CardHeader, Avatar, Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { setChatId } from "../../Actions/ChatActions";
import { Link } from "react-router-dom";
import Chat_icon from "../../assets/website_img/chat_icon.svg";
import { deepOrange } from "@mui/material/colors"; // Import deepOrange color
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProfileUrl } from "Actions/UserProfileActions";
import { FaStar } from "react-icons/fa";
import { getUserdataCookie, checkCookies } from "cookies";
import useMediaQuery from "@mui/material/useMediaQuery";

ScrollDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  reviewId: PropTypes.string.isRequired,
};

export default function ScrollDialog({ handleClose, reviewId }) {
  const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState("paper");
  const [reviewslist, setReviewsList] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [actionType, setActionType] = useState(""); // Like or Comment
  const [showModel, setShowModel] = useState(false);
  const isBelow500px = useMediaQuery("(max-width:500px)");
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
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

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const review_id = reviewId;
        const number = 1;

        const response = await WebsiteApi.getReview(review_id, number);

        if (response && response.status && Array.isArray(response.reviews)) {
          setReviewsList(response.reviews);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  const ProfileUrl = async (userId) => {
    const profileUrl = await dispatch(setProfileUrl(userId));
    if (profileUrl) {
      navigate(profileUrl);
    } else {
      console.error("Failed to get profile URL.");
    }
  };

  const handleShowMore = () => {
    setShowFullDescription(true);
  };
  const handleShowless = () => {
    setShowFullDescription(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          id="scroll-dialog-title"
          className="Edit_Subscription_heading"
          sx={{ alignSelf: "center", marginTop: "0px" }}
        >
          Reviews
        </DialogTitle>
        <DialogContent
          dividers={scroll === "paper"}
          sx={{ width: isBelow500px ? "314px" : "576px" }}
        >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <div style={{ textAlignLast: "center", marginTop: "20px" }}>
              {reviewslist.length === 0 && (
                <div style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
                  <Typography variant="body1" color="error" className="Latest_Jobs_user_name">
                    Review List Not Found
                  </Typography>
                </div>
              )}
            </div>

            {/* Map through the reviewslist to display each chat */}
            {reviewslist.map((chat) => (
              <React.Fragment key={chat._id}>
                <ListItem sx={{ marginTop: "13px" }}>
                  <ListItemAvatar sx={{ marginLeft: "13px" }}>
                    <div
                      onClick={() => {
                        ProfileUrl(chat.sender._id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <Avatar
                        alt={chat.sender.first_name}
                        sx={{
                          bgcolor:
                            chat.sender.pic && chat.sender.pic.includes("defult_pic.jpg")
                              ? deepOrange[500]
                              : undefined,
                          width: 36,
                          height: 36,
                        }}
                      >
                        {!chat.sender.pic || chat.sender.pic.includes("defult_pic.jpg") ? (
                          `${chat.sender.first_name.charAt(0)}${chat.sender.last_name.charAt(0)}`
                        ) : (
                          <img
                            alt={`Avatar for ${chat.sender.first_name}`}
                            src={chat.sender.pic}
                            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                          />
                        )}
                      </Avatar>
                    </div>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <span className="Latest_Jobs_user_name">
                        {chat.sender.first_name.substring(0, 20)}
                        <span style={{ marginLeft: "20px", color: "#ffe234" }}>
                          <FaStar />
                        </span>
                        ({chat.review_number})
                      </span>
                    }
                    secondary={
                      <React.Fragment>
                        {showFullDescription ? (
                          <React.Fragment>
                            <span className="Latest_Jobs_user_name"> {chat.description}</span>
                            <span
                              style={{
                                marginLeft: "10px",
                                color: "gray",
                                cursor: "pointer",
                                fontWeight: "500",
                              }}
                              onClick={handleShowless}
                              className="Latest_review_show_more"
                            >
                              Show Less
                            </span>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <span className="Latest_Jobs_user_name">
                              {chat.description.substring(0, 70)}
                            </span>
                            {chat.description.length > 70 && (
                              <span
                                style={{
                                  marginLeft: "10px",
                                  color: "gray",
                                  cursor: "pointer",
                                  fontWeight: "500",
                                  color: "#2b6639",
                                }}
                                onClick={handleShowMore}
                                className="Latest_review_show_more"
                              >
                                Show More
                              </span>
                            )}
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    }
                  />

                  <span
                    onClick={() => {
                      CheckAuth("Chat", chat.sender._id);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={Chat_icon} style={{ marginRight: "10px" }} alt="page" />
                  </span>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="close_button rounded-pill" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {showModel && (
        <AuthModel
          message={actionType === "Chat" ? "Sign in to chat with the user." : ""}
          heading={actionType === "Chat" ? "Do you want to chat with the user ?" : ""}
          onClose={() => setShowModel(false)}
        />
      )}
    </React.Fragment>
  );
}
