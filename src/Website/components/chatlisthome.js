import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Chat_icon from "../../assets/website_img/chat_icon.svg";
import { deepOrange } from "@mui/material/colors"; // Import deepOrange color
import ChatSkeleton from "../Skeleton/chat_skeleton";
import { WebsiteApi } from "Api/WebsiteApi";
import { setProfileUrl } from "Actions/UserProfileActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserdataCookie } from "cookies.js";
import { LuDot } from "react-icons/lu";
const base_url = process.env.REACT_APP_BASE_URL;

export default function Chatlisthome() {
  const [chatlisthome, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const reduxprofileurl = useSelector((state) => state.userprofileurlReducer.profiledata);
  const reduxchatlist_data = useSelector((state) => state.chatlistReducer.chatlist_data);
  const navigate = useNavigate();
  const userCookieData = getUserdataCookie("Userdata");

  useEffect(() => {
    if (userCookieData?._id && reduxchatlist_data.userId === userCookieData._id) {
      fetchData();
    }
  }, [reduxchatlist_data]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await WebsiteApi.fetchChats(1);

      if (response && response.status && Array.isArray(response.chat_list)) {
        setChatList(response.chat_list);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
    <div className="latest_jab_div">
      <List
        sx={{
          width: "100%",
          maxWidth: "auto",
          bgcolor: "background.paper",
          height: "35vh",
          overflow: "scroll",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: "15px",
            paddingRight: "15px",
          }}
        >
          <Typography level="h1" className="Latest_Jobs_heading">
            Chat List
          </Typography>
          <Link to="">
            <Link to={`/website-chat/blank_page`} underline="hover">
              <Typography level="h1" className="Latest_Jobs_heading">
                See All
              </Typography>
            </Link>
          </Link>
        </div>
        {loading ? (
          <div>
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {chatlisthome.length === 0 && (
              <div
                style={{
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlignLast: "center",
                }}
              >
                <Typography variant="body1" color="error" className="video_home_card_hending">
                  No List Found
                </Typography>
              </div>
            )}
            {chatlisthome.slice(0, 10).map((chat) => (
              <React.Fragment key={chat._id}>
                <ListItem sx={{ marginTop: "13px" }}>
                  <ListItemAvatar sx={{ marginLeft: "13px", minWidth: "42px" }}>
                    <div
                      //     onClick={() => {
                      //       ProfileUrl(chat.users[0]._id);
                      //     }}
                      style={{ cursor: "pointer" }}
                    >
                      <Link
                        to={
                          userCookieData._id === chat.users[0]._id
                            ? `/website-my-profile-view`
                            : `/Website-user-profile-view/${chat.users[0]._id}`
                        }
                      >
                        <Avatar
                          alt={chat.users[0].first_name}
                          sx={{
                            bgcolor:
                              chat.users[0].pic && chat.users[0].pic.includes("defult_pic.jpg")
                                ? deepOrange[500]
                                : undefined,
                            width: 36,
                            height: 36,
                          }}
                        >
                          {!chat.users[0].pic || chat.users[0].pic.includes("defult_pic.jpg") ? (
                            `${chat.users[0].first_name.charAt(0)}${chat.users[0].last_name.charAt(
                              0
                            )}`
                          ) : (
                            <img
                              alt={`Avatar for ${chat.users[0].first_name}`}
                              src={chat.users[0].pic}
                              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                            />
                          )}
                        </Avatar>
                      </Link>
                    </div>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div className="letest_home_card_thumbnail_user_name">
                        <Link
                          to={
                            userCookieData._id === chat.users[0]._id
                              ? `/website-my-profile-view`
                              : `/Website-user-profile-view/${chat.users[0]._id}`
                          }
                        >
                          <div
                            //   onClick={() => {
                            //     ProfileUrl(chat.users[0]._id);
                            //   }}
                            style={{
                              textDecoration: "none",
                              color: "#2b6639",
                              fontFamily: "Port Lligat Sans",
                              cursor: "pointer",
                            }}
                          >
                            {`${chat.users[0]?.first_name?.substring(
                              0,
                              15
                            )} ${chat.users[0]?.last_name?.substring(0, 15)}`}
                          </div>
                        </Link>
                      </div>
                    }
                    secondary={
                      chat.latestMessage ? chat.latestMessage.content.substring(0, 10) : null
                    }
                  />
                  <span>
                    {chat.latestMessage &&
                      chat.latestMessage.readBy === false &&
                      userCookieData._id !== chat.latestMessage.sender && (
                        <LuDot className="Dot_icon_chat_home" />
                      )}
                  </span>
                  <Link to={`/website-chat/${chat._id}`} underline="hover">
                    <img src={Chat_icon} style={{ marginRight: "10px" }} alt="page" />
                  </Link>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </div>
        )}
      </List>
    </div>
  );
}
