import React, { useState, useEffect, useRef } from "react";
import TimelineCard from "Website/components/timeline_card";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import {
  Typography,
  Card,
  CardHeader,
  Avatar,
  Box,
  CardContent,
  Divider,
  TextField,
  IconButton,
} from "@mui/material";
import SendIcon from "../../assets/website_img/send button.svg";
import { deepOrange } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { WebsiteApi } from "Api/WebsiteApi";
import AuthModel from "./Authmodel";
import { getUserdataCookie, checkCookies } from "cookies.js";
import Backbutton from "./Backbutton.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProfileUrl } from "Actions/UserProfileActions";
import InputAdornment from "@mui/material/InputAdornment";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import KeyboardIcon from "@mui/icons-material/Keyboard";

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

export default function TimelineList() {
  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment
  const [timelinelist, setTimelineList] = useState([]);
  const [commentlist, setCommentsList] = useState([]);
  const [postcomment, setPostComment] = useState("");
  const [error, setError] = useState("");
  const { timelineId } = useParams();
  const [userData, setUserData] = useState({});
  const [newCommentSubmitted, setNewCommentSubmitted] = useState(false);
  const commentBoxRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev);
  };

  const handleEmojiSelect = (emoji) => {
    const emojiToAdd = emoji.emoji || emoji.unified || ""; // Choose the property you want to use
    setPostComment((prevMessage) => prevMessage + emojiToAdd);
  };

  const fetchData = async (timelineId) => {
    try {
      const response = await WebsiteApi.getTimelineComments(timelineId);

      if (response && response.status && response.data) {
        const timelineData = response.data;
        const commentsList = response.comments;

        setTimelineList([timelineData]);
        setCommentsList(commentsList);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(timelineId);
  }, [timelineId]);

  useEffect(() => {
    const userCookieData = getUserdataCookie("Userdata");
    setUserData(userCookieData);
  }, []);

  useEffect(() => {
    if (newCommentSubmitted) {
      // Scroll to the bottom when a new comment is submitted
      commentBoxRef.current.scrollTop = commentBoxRef.current.scrollHeight;
      // Reset the flag
      setNewCommentSubmitted(false);
    }
  }, [newCommentSubmitted]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!postcomment.trim()) {
      setError("Please enter a comment.");
    } else {
      try {
        const response = await WebsiteApi.addTimelineComment(timelineId, postcomment);
        if (response && response.status && response.data) {
          const newComment = {
            _id: response.data._id,
            user_id: userData,
            comment: postcomment,
            // Add other properties if needed
          };
          setCommentsList((prevComments) => [...prevComments, newComment]);
          setNewCommentSubmitted(true);
          setIsEmojiPickerOpen(false);
          fetchData(timelineId);
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

  const handleAuthCheck = () => {
    if (checkCookies()) {
      // User is logged in, make API call
    } else {
      setActionType("Comment");
      setShowModel(true);
    }
  };

  const userAvatars = commentlist.map((comment) => {
    const userPic = comment.user_id && comment.user_id.pic;

    return (
      <Avatar
        key={comment._id}
        sx={{
          bgcolor: userPic && userPic.includes("defult_pic.jpg") ? deepOrange[500] : undefined,
          width: 36,
          height: 36,
        }}
        aria-label="recipe"
      >
        {userPic && !userPic.includes("defult_pic.jpg") ? (
          <img
            alt={`Avatar for ${comment.user_id.first_name}`}
            src={userPic}
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        ) : (
          `${comment.user_id.first_name.charAt(0)}${comment.user_id.last_name.charAt(0)}`
        )}
      </Avatar>
    );
  });

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
      <Card className="" sx={{ paddingBottom: "10px" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <TimelineCard timelines={timelinelist} />
        <Typography sx={{ paddingTop: "20px", alignSelf: "center" }} className="commant_Heading">
          Comments
        </Typography>
        <Box sx={{ paddingBottom: "10px", minHeight: "200px" }}>
          <Box
            sx={{ paddingBottom: "10px", minHeight: "200px", height: "400px", overflow: "auto" }}
            ref={commentBoxRef}
          >
            {commentlist.length === 0 ? (
              <Box sx={{ textAlign: "center", paddingTop: "42%" }}>
                <Typography variant="body1" className="No_comments">
                  No comments available.
                </Typography>
              </Box>
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
                        {userAvatars.filter((avatar) => avatar.key === comment._id)}
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
                        <Typography variant="h3" className="video_card_user_name_title">
                          {`${comment.user_id.first_name} ${comment.user_id.last_name}`}
                        </Typography>
                      </div>
                    }
                  />
                  <CardContent className="commant_message_box">
                    <Typography paragraph className="commant_message" sx={{ paddingLeft: "44px" }}>
                      {comment.comment}
                      <Divider
                        sx={{ backgroundColor: "#356C42", height: "1px", opacity: "1.25" }}
                      />
                    </Typography>
                  </CardContent>
                </div>
              ))
            )}
            {isEmojiPickerOpen && (
              <EmojiPicker className="Emoji_pickerss" onEmojiClick={handleEmojiSelect} />
            )}
          </Box>
          <CardContent
            className="comment_box"
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmitComment}
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
            <IconButton type="submit" sx={{ paddingTop: "0px", paddingRight: "0px" }}>
              <img src={SendIcon} alt="send_icon" style={{ transform: "rotate(45deg)" }} />
            </IconButton>
          </CardContent>
        </Box>
        {showModel && (
          <AuthModel
            message={
              actionType === "Comment"
                ? "Sign in to make your Comment."
                : actionType === "Subscribe"
                ? "Sign in to subscribe to this users."
                : ""
            }
            heading={
              actionType === "Comment"
                ? "Comment this video?"
                : actionType === "Subscribe"
                ? "Want to subscribe to this channel?"
                : ""
            }
            onClose={() => setShowModel(false)}
          />
        )}
      </Card>
    </div>
  );
}
