import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import io from "socket.io-client";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Chat_icon from "../../assets/website_img/chat_icon.svg";
import { deepOrange } from "@mui/material/colors"; // Import deepOrange color
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
const base_url = process.env.REACT_APP_BASE_URL;
import ChatSkeleton from "../Skeleton/chat_skeleton";
import { setProfileUrl } from "Actions/UserProfileActions";
import { LuDot } from "react-icons/lu";
import { getUserdataCookie } from "cookies.js";
const socket = io(base_url);
import SweetAlertComponent from "../Utils/authfile";
import { WebsiteApi } from "Api/WebsiteApi";

export default function Chatlisthome() {
  const [chatlisthome, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { chat_id } = useParams();
  const [selectedIndex, setSelectedIndex] = React.useState(chat_id);
  const [blockedUsersList, setBlockedUsersList] = useState([]);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const reduxchatlist_data = useSelector((state) => state.chatlistReducer.chatlist_data);
  const userCookieData = getUserdataCookie("Userdata");

  const [authChack, setAuthChack] = useState(false);

  useEffect(() => {
    if (
      (userCookieData?._id && reduxchatlist_data.userId === userCookieData._id) ||
      reduxchatlist_data.myId == userCookieData?._id
    ) {
      fetchData();
    }
  }, [reduxchatlist_data]);

  useEffect(() => {
    fetchData();
  }, []);

  const BlockUser = async (chatId, userId, status) => {
    try {
      const blockStatus = status === 1 ? "Yes" : "No";
      socket.emit("block Status", { chatId, status: blockStatus, userId: userId });
      const response = await WebsiteApi.blockUser(chatId, userId, status);
      const updatedStatus = status === 1 ? "Yes" : "No";

      if (updatedStatus === "No") {
        setBlockedUsersList((prevList) => prevList.filter((user) => user._id !== userId));
      }
      console.log(blockedUsersList);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await WebsiteApi.fetchChats(1);

      if (response && response.status && Array.isArray(response.chat_list)) {
        setChatList(response.chat_list);
      } else {
        if (response && response.expired === true) {
          setAuthChack(true);
        }
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const ChatView = (event) => {
    setSelectedIndex(event);
    const updatedChatList = chatlisthome.map((chat) => {
      if (chat._id === event) {
        return { ...chat, latestMessage: { ...chat.latestMessage, readBy: true } };
      }
      return chat;
    });
    setChatList(updatedChatList);
    navigate(`/website-chat/${event}`);
  };

  const BlockedUserList = async () => {
    try {
      const response = await WebsiteApi.blockUserList();

      if (response && response.status && Array.isArray(response.blockedUsers)) {
        setBlockedUsersList(response.blockedUsers);
      } else {
        if (response && response.expired === true) {
          setAuthChack(true);
        }
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUnblockClick = () => {
    if (!showBlockedUsers) {
      BlockedUserList(); // Fetch blocked users only if not already fetched
    }
    setShowBlockedUsers(!showBlockedUsers);
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
    <div className="Latest_Jobs_heading_Screnn_Fix">
      <List
        sx={{
          width: "100%",
          maxWidth: "auto",
          bgcolor: "background.paper",
          height: "84vh",
          overflow: "scroll",
        }}
        style={{}}
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

          <Typography
            level="h1"
            sx={{ cursor: "pointer" }}
            className="Latest_Jobs_heading"
            onClick={handleUnblockClick}
          >
            {showBlockedUsers ? "Chat List" : "Unblock"}
          </Typography>
        </div>
        <div
          style={{
            paddingTop: "15px",
          }}
        >
          {showBlockedUsers ? (
            blockedUsersList.length > 0 ? (
              blockedUsersList.map((chat) => (
                <React.Fragment key={chat._id}>
                  <ListItem
                    sx={{
                      cursor: "pointer",
                      color: selectedIndex === `${chat._id}` ? "#578a48" : "inherit",
                      paddingBottom: "15px",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #f9e0e0",
                    }}
                    className="chatlist_mobile"
                    onClick={(e) => {
                      // Check if the click target or its parent is the Avatar, then redirect to user profile
                      if (
                        e.target.tagName !== "IMG" &&
                        e.target !== e.currentTarget.querySelector(".MuiAvatar-root")
                      ) {
                        ChatView(`${chat.ChatId}`);
                      }
                    }}
                    selected={selectedIndex === `${chat._id}`}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        // onClick={() => {
                        //   ProfileUrl(chat._id);
                        // }}
                        style={{ cursor: "pointer", underline: "hover" }}
                      >
                        <ListItemAvatar sx={{ marginLeft: "13px" }}>
                          <Link
                            to={
                              userCookieData._id === chat._id
                                ? `/website-my-profile-view`
                                : `/Website-user-profile-view/${chat._id}`
                            }
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Avatar
                              alt={chat.first_name}
                              sx={{
                                bgcolor:
                                  chat.pic && chat.pic.includes("defult_pic.jpg")
                                    ? deepOrange[500]
                                    : undefined,
                                width: 36,
                                height: 36,
                              }}
                            >
                              {!chat.pic || chat.pic.includes("defult_pic.jpg") ? (
                                `${chat.first_name.charAt(0)}${chat.last_name.charAt(0)}`
                              ) : (
                                <img
                                  alt={`Avatar for ${chat.first_name}`}
                                  src={chat.pic}
                                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                                />
                              )}
                            </Avatar>
                          </Link>
                        </ListItemAvatar>
                      </div>
                      <ListItemText
                        primary={
                          <div className="letest_home_card_thumbnail_user_name">
                            <div>
                              <Link
                                to={
                                  userCookieData._id === chat._id
                                    ? `/website-my-profile-view`
                                    : `/Website-user-profile-view/${chat._id}`
                                }
                                onClick={(event) => event.stopPropagation()}
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "none",
                                  color: "#2b6639",
                                  fontFamily: "Port Lligat Sans",
                                }}
                              >
                                {chat.first_name}
                              </Link>
                            </div>
                          </div>
                        }
                        secondary={chat.latestMessage ? chat.latestMessage.content : null}
                      />
                    </div>
                    <Button
                      value="My_Subscriber"
                      className="Unblock_button_select"
                      onClick={() => {
                        BlockUser(chat.ChatId, chat._id, 0);
                      }}
                    >
                      Unblock
                    </Button>
                  </ListItem>
                </React.Fragment>
              ))
            ) : (
              <Typography variant="h6" className="No_Chat_meesage" align="center" pb={2}>
                No Blocked Users
              </Typography>
            )
          ) : chatlisthome.length > 0 ? (
            chatlisthome.map((chat) => (
              <React.Fragment key={chat._id}>
                {loading ? (
                  <div key={chat._id}>
                    <ChatSkeleton />
                  </div>
                ) : (
                  <ListItem
                    sx={{
                      cursor: "pointer",
                      color: selectedIndex === `${chat._id}` ? "#578a48" : "inherit",
                      paddingBottom: "10px",
                      paddingTop: "10px",
                      justifyContent: "space-between",
                    }}
                    className="chatlist_mobile"
                    onClick={(e) => {
                      // Check if the click target or its parent is the Avatar, then redirect to user profile
                      if (
                        e.target.tagName !== "IMG" &&
                        e.target !== e.currentTarget.querySelector(".MuiAvatar-root")
                      ) {
                        ChatView(`${chat._id}`);
                      }
                    }}
                    selected={selectedIndex === `${chat._id}`}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        onClick={() => {
                          ProfileUrl(chat.users[0]._id);
                        }}
                        style={{ cursor: "pointer", underline: "hover" }}
                      >
                        <ListItemAvatar sx={{ marginLeft: "13px", minWidth: "42px" }}>
                          <Link
                            to={
                              userCookieData._id === chat.users[0]._id
                                ? `/website-my-profile-view`
                                : `/Website-user-profile-view/${chat.users[0]._id}`
                            }
                            onClick={(event) => event.stopPropagation()}
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
                              {!chat.users[0].pic ||
                              chat.users[0].pic.includes("defult_pic.jpg") ? (
                                `${chat.users[0].first_name.charAt(
                                  0
                                )}${chat.users[0].last_name.charAt(0)}`
                              ) : (
                                <img
                                  alt={`Avatar for ${chat.users[0].first_name}`}
                                  src={chat.users[0].pic}
                                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                                />
                              )}
                            </Avatar>
                          </Link>
                        </ListItemAvatar>
                      </div>
                      <ListItemText
                        primary={
                          <div>
                            <Link
                              to={
                                userCookieData._id === chat.users[0]._id
                                  ? `/website-my-profile-view`
                                  : `/Website-user-profile-view/${chat.users[0]._id}`
                              }
                              className="letest_home_card_thumbnail_user_name"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {chat.users[0]?.first_name?.substring(0, 15)}
                            </Link>
                          </div>
                        }
                        secondary={
                          chat.latestMessage && chat.latestMessage.content
                            ? chat.latestMessage.content.length > 10
                              ? chat.latestMessage.content.substring(0, 10) + "..."
                              : chat.latestMessage.content
                            : null
                        }
                      />
                    </div>
                    <div>
                      <span>
                        {chat.latestMessage &&
                          chat.latestMessage.readBy === false &&
                          userCookieData._id !== chat.latestMessage.sender &&
                          chat_id != chat._id && <LuDot className="Dot_icon_chat" />}
                      </span>
                      <img
                        src={Chat_icon}
                        style={{ marginRight: "10px" }}
                        alt="page"
                        onClick={(e) => {
                          ChatView(`${chat._id}`);
                        }}
                      />
                    </div>
                  </ListItem>
                )}
              </React.Fragment>
            ))
          ) : (
            <Typography variant="h6" className="No_Chat_meesage" align="center" mb={1}>
              No List Found
            </Typography>
          )}
        </div>
      </List>
      {authChack && <SweetAlertComponent />}
    </div>
  );
}
