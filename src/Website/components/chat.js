// Import necessary libraries and components
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IoCheckmarkDone } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Popper } from "@mui/base/Popper";
import { css } from "@mui/system";
import {
  Box,
  Card,
  CardHeader,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  IconButton,
  Divider,
  FormGroup,
  Alert,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { WebsiteApi } from "Api/WebsiteApi";
import PropTypes from "prop-types";
import SendIcon from "../../assets/website_img/send button.svg";
import Lottie from "react-lottie";
import typingAnimation from "../../assets/typing.json";
import { getUserdataCookie } from "cookies.js";
import { deepOrange } from "@mui/material/colors";
import createAvatar from "../Utils/avatarUtils";
const base_url = process.env.REACT_APP_BASE_URL;
import { setProfileUrl } from "Actions/UserProfileActions";
import { setchatlist_data } from "Actions/chatlistAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Backbutton from "./Backbutton.js";
import useMediaQuery from "@mui/material/useMediaQuery";
import DraggableDialog from "../model_components/permission_model";
import { saveChatData } from "Actions/ChatActions";
import { updateChatData } from "Actions/ChatActions";

const socket = io(base_url);
let isFormGroupVisible;
const StyledPopperDiv = styled("div")(
  ({ theme }) => css`
    background-color: ${theme.palette.mode === "dark" ? "#808080" : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? "#808080" : "#808080"};
    box-shadow: ${theme.palette.mode === "dark"
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`};
    padding: 0.4rem;
    color: ${theme.palette.mode === "dark" ? "#808080" : "#808080"};
    font-size: 0.875rem;
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    opacity: 1;
    margin: 0.25rem 0;
    width: 88px;
    text-align: center;
    border-top-left-radius: 32px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 32px;
    border-bottom-left-radius: 32px;
    margin-right: 14px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
  `
);

const StyledPopperDivBloced = styled("div")(
  ({ theme }) => css`
    background-color: ${theme.palette.mode === "dark" ? "#808080" : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? "#808080" : "#808080"};
    box-shadow: ${theme.palette.mode === "dark"
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`};
    padding: 0.4rem;
    color: ${theme.palette.mode === "dark" ? "#808080" : "#808080"};
    font-size: 0.875rem;
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    opacity: 1;
    margin: 0.25rem 0;
    text-align: center;
  `
);

const convertTo12HourFormat = (datetime) => {
  const [datePart, timePart] = datetime.split(" ");
  const [day, month, year] = datePart.split("-");
  const [hours, minutes, seconds] = timePart.split(":");

  let period = "AM";

  // Convert hours to 12-hour format
  let formattedHours = parseInt(hours, 10);
  if (formattedHours > 12) {
    formattedHours -= 12;
    period = "PM";
  }

  // Add leading zeros to minutes and seconds if needed
  const formattedMinutes = minutes.padStart(2, "0");
  const formattedSeconds = seconds.padStart(2, "0");

  // Format the result
  const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

  return formattedTime;
};

const ChatPageWrapper = ({}) => {
  const { chat_id } = useParams();
  const ChatPageBalnk = () => {
    const scrollRef = useRef(null);

    return (
      <Card>
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            height: "91vh", // Height set to 100vh
            position: "relative", // Position relative to contain absolutely positioned input
            justifyContent: "center", // Center content vertically
            alignItems: "center", // Center content horizontally
          }}
        >
          <img
            src="/assets/images/auth_logo.png"
            alt="Auth_Logo"
            className="img-fluid"
            style={{
              opacity: "0.5", // Reduce opacity to 50%
              width: "50%", // Reduce width to 50% of original size
              height: "auto", // Maintain aspect ratio
            }}
          />
        </Box>
      </Card>
    );
  };

  const ChatMsg = ({ avatar, messages, side, first_name, last_name, datetime, readBy }) => {
    const formattedDatetime = convertTo12HourFormat(datetime);

    return (
      <Grid container spacing={1} justify={side === "right" ? "flex-end" : "flex-start"}>
        <Grid item xs={12} style={{ paddingLeft: "0px" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{ textAlign: side === "right" ? "right" : "left", marginLeft: "0px" }}
            >
              <Typography
                sx={{
                  padding: 1,
                  borderRadius: 4,
                  marginBottom: 1,
                  display: "inline-block",
                  wordBreak: "break-word",
                  fontFamily: "Poppins sans-serif",
                  fontWeight: "400",
                  fontSize: "14px",
                  marginTop: "10px",
                  marginLeft: "0px",
                  ...(side === "right"
                    ? {
                        borderTopRightRadius: 4,
                        marginLeft: "36px",
                        marginRight: "17px",
                        backgroundColor: "#f0f0f0",
                        background: "#F1F1F1",
                      }
                    : {
                        marginRight: "36px",
                        marginLeft: "17px",
                        borderTopLeftRadius: 4,
                        backgroundColor: "#1976D2",
                        color: "#000",
                        background: "#DCDCDC",
                      }),
                }}
              >
                {msg}
                <Typography sx={{ textAlign: "-webkit-right" }}>
                  <Typography className="chat_time_minuts">
                    {formattedDatetime}
                    {side === "right" && (
                      <Typography
                        className="chat_delevied_icon"
                        style={{ color: readBy ? "#34b7f1" : "black" }}
                      >
                        <IoCheckmarkDone style={{ color: readBy ? "#34b7f1" : "black" }} />
                      </Typography>
                    )}
                  </Typography>
                </Typography>
              </Typography>
            </div>
          ))}
        </Grid>
      </Grid>
    );
  };

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

  ChatMsg.propTypes = {
    readBy: PropTypes.bool,
    avatar: PropTypes.string,
    datetime: PropTypes.string,
    last_name: PropTypes.string,
    first_name: PropTypes.string,
    messages: PropTypes.arrayOf(PropTypes.string),
    side: PropTypes.oneOf(["left", "right"]),
  };

  const Header = ({ userData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [onlineStatus, setOnlineStatus] = useState("Offline");
    const [anchorEl, setAnchorEl] = useState(null);
    const { chat_id } = useParams();
    const [blockButton, setBlockButton] = useState(userData.blockStatus._id !== userData._id);
    const placement = "bottom-end";
    const userCookieData = getUserdataCookie("Userdata");
    const isBelow1200px = useMediaQuery("(max-width:1200px)");

    const chatData = useSelector((state) => state.chat.chatPageData);

    const handleClickDelete = (event) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popper" : undefined;
    const chatId = chat_id;

    const BlockUser = async (chatId, userId, status) => {
      try {
        const blockStatus = status === 1 ? "Yes" : "No";
        socket.emit("block Status", { chatId, status: blockStatus, userId: userId });
        const response = await WebsiteApi.blockUser(chatId, userId, status);
        const updatedStatus = status === 1 ? "Yes" : "No";

        // Update the chatData with new block status
        const updatedChatData = {
          header_user_data: {
            ...chatData.header_user_data,
            blockStatus: {
              ...chatData.header_user_data.blockStatus,
              Blocked: updatedStatus,
            },
          },
        };

        // // Dispatch the updated chatData to the Redux store

        if (dispatch(updateChatData(updatedChatData))) {
          if (chatData.header_user_data.blockStatus.Blocked === "Yes") {
            setBlockButton(true);
          } else {
            setBlockButton(false);
          }
        }
      } catch (error) {
        console.error("Error saving message:", error);
      }
    };

    useEffect(() => {
      userCookieData.ChatStatus = true;
      socket.emit("setup", userCookieData, userData._id);
      socket.on("user online", ({ userId, online, Chat_Status }) => {
        if (Chat_Status == "Online") {
          setOnlineStatus("Online");
        } else {
          setOnlineStatus("Offline");
        }
      });
      return () => {
        // Clean up event listener on component unmount
        socket.off("user online");
      };
    }, [userData._id]);

    const avatarComponent = createAvatar(
      userData.pic,
      userData.first_name,
      userData.last_name,
      "chatheader"
    );
    const ProfileUrl = async (userId) => {
      const profileUrl = await dispatch(setProfileUrl(userId));
      if (profileUrl) {
        navigate(profileUrl);
      } else {
        console.error("Failed to get profile URL.");
      }
    };
    return (
      <Grid>
        <Card>
          <Box>
            <CardHeader
              action={
                <IconButton aria-label="settings" onClick={handleClickDelete}>
                  <MoreVertIcon />
                </IconButton>
              }
              avatar={
                <div style={{ display: "flex" }}>
                  <div>{isBelow1200px && <Backbutton />}</div>
                  <div style={{ cursor: "pointer" }}>
                    <Link to={`/Website-user-profile-view/${userData._id}`}>{avatarComponent}</Link>
                  </div>
                </div>
              }
              title={
                <div
                  onClick={() => {
                    ProfileUrl(userData._id);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Typography variant="h6">
                    <Link
                      className="video_card_user_name_title"
                      to={`/Website-user-profile-view/${userData._id}`}
                    >
                      {`${userData.first_name} ${userData.last_name}`}
                    </Link>
                  </Typography>
                </div>
              }
              //   subheader={
              //     <Typography
              //       elevation={8}
              //       variant="subtitle1"
              //       className={`video_card_user_name_subheader_chat_online rounded-pill ${
              //         onlineStatus === "Online" ? "online" : "offline"
              //       }`}
              //     ></Typography>
              //   }
            />
            <Popper id={id} open={open} anchorEl={anchorEl} placement={placement}>
              <StyledPopperDiv
                className="block_user"
                onClick={() => {
                  BlockUser(chatId, userData._id, blockButton ? 1 : 0);
                }}
              >
                {blockButton ? "Block" : "Unblock"}
              </StyledPopperDiv>
            </Popper>
          </Box>
        </Card>
      </Grid>
    );
  };

  Header.propTypes = {
    userData: PropTypes.shape({
      pic: PropTypes.string.isRequired,
      blockStatus: PropTypes.object,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
    }).isRequired,
  };

  const ChatPage = () => {
    const { chat_id } = useParams();
    const dispatch = useDispatch();
    const [onlineStatus, setOnlineStatus] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [latestMessage, setLatestMessage] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const userCookieData = getUserdataCookie("Userdata");
    const scrollRef = useRef(null);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [block_StatusSocket, setBlock_StatusSocket] = useState({});
    const placement = "bottom-end";
    //const [showModel, setShowModel] = useState(false);
    const [isBlock, setIsBlocked] = useState(false);

    useEffect(() => {
      if (chatData) {
        dispatch(saveChatData(chatData));
      }
    }, [chatData, dispatch]);

    const chatPageData = useSelector((state) => state.chat.chatPageData);

    useEffect(() => {
      if (chatData && chatData.header_user_data) {
        console.log(chatData);
        const blockStatus = chatData.header_user_data.blockStatus.Blocked;
        setIsBlocked(blockStatus === "Yes");
      }
    }, [chatData]);

    const toggleEmojiPicker = () => {
      setIsEmojiPickerOpen((prev) => !prev);
    };

    const handleEmojiSelect = (emoji) => {
      const emojiToAdd = emoji.emoji || emoji.unified || ""; // Choose the property you want to use
      setNewMessage((prevMessage) => prevMessage + emojiToAdd);
    };

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: typingAnimation,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await WebsiteApi.allMessages(chat_id);
          if (response && response.status) {
            setChatData(response);
          } else {
            console.error("Invalid API response format:", response);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      if (chat_id !== "65c4805be321e444ec2ce111") {
        fetchData();
        if (socket.emit("join chat", chat_id)) {
          console.log("room join");
        }
      }
    }, [chat_id]);

    const fetchData = async () => {
      const response = await WebsiteApi.allMessages(chat_id);
      if (response && response.status) {
        setChatData(response);
      } else {
        console.error("Invalid API response format:", response);
      }
    };

    useEffect(() => {
      const readbyHandler = async (message) => {
        fetchData();
        console.log("read by", message);
      };
      socket.on("read by", readbyHandler);
      if (chat_id !== "65c4805be321e444ec2ce111") {
        fetchData();
        if (socket.emit("join chat", chat_id)) {
          console.log("room join");
        }
      }

      return () => {
        socket.off("read by", readbyHandler);
      };
    }, [chat_id]);

    useEffect(() => {
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));

      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatData, scrollRef]);

    useEffect(() => {
      socket.on("block Status", ({ status, userId }) => {
        setBlock_StatusSocket({ status, userId });
      });
    }, [chat_id]);

    useEffect(() => {
      const messageReceivedHandler = async (message) => {
        const { content, datetime, sender } = message.response;

        // Set readBy status to false for all incoming messages
        const newMessage = {
          readBy: false,
          datetime,
          _id: message.response._id,
          dateLabel: message.response.dateLabel,
          sender: {
            pic: sender.pic,
            _id: sender._id,
            first_name: sender.first_name,
            last_name: sender.last_name,
          },
          content,
        };

        setChatData((prevChatData) => ({
          ...prevChatData,
          messages: [...prevChatData.messages, newMessage],
        }));

        try {
          // Send the read receipt to the server if the message is sent by the current user
          if (sender._id !== userCookieData._id) {
            console.log(message.response.chat.users[0]._id);
            socket.emit("message read", message.response.chat.users[0]._id);
          }
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      };

      socket.on("message received", messageReceivedHandler);

      return () => {
        socket.off("message received", messageReceivedHandler);
      };
    }, [userCookieData]);

    useEffect(() => {
      const handleScroll = () => {
        if (scrollRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            //const unreadMessages = chatData.messages.filter((message) => !message.readBy);
            //console.log("user id", chatData.header_user_data._id);
            // console.log(unreadMessages[0]._id);
            //unreadMessages.forEach((message) => {
            //console.log(message._id);
            // socket.emit("message read", message._id, chatData.header_user_data._id);
            //});
          }
        }
      };

      if (scrollRef.current) {
        scrollRef.current.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (scrollRef.current) {
          scrollRef.current.removeEventListener("scroll", handleScroll);
        }
      };
    }, [chatData, socket]);

    useEffect(() => {
      const handleReadStatusUpdate = (messageId) => {
        setChatData((prevChatData) => {
          const updatedMessages = prevChatData.messages.map((message) => {
            return { ...message, readBy: true };
          });
          return { ...prevChatData, messages: updatedMessages };
        });
      };

      socket.on("message read update", handleReadStatusUpdate);

      return () => {
        socket.off("message read update", handleReadStatusUpdate);
      };
    }, [socket]);

    useEffect(() => {
      if (socket) {
        socket.on("typing", () => {
          setIsTyping(true);
        });

        socket.on("stop typing", () => {
          setIsTyping(false);
        });
      }
    }, [socket]);

    const typingHandler = (e) => {
      setNewMessage(e.target.value);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }

      if (!socketConnected) return;

      setTyping(true);
      if (socket) {
        socket.emit("typing", {
          chatData: {
            room: chat_id,
            chatData_id: chatData.header_user_data._id,
          },
        });
      }

      let lastTypingTime = new Date().getTime();
      const TIMER_LENGTH = 3000;

      setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime;

        if (timeDiff >= TIMER_LENGTH && typing) {
          socket.emit("stop typing", chat_id);
          setTyping(false);
        }
      }, TIMER_LENGTH);
    };

    const sendMessage = async () => {
      socket.emit("stop typing", chat_id);
      try {
        // Send the message to the server
        const response = await WebsiteApi.sendMessageAPI(newMessage, chat_id);
        setIsEmojiPickerOpen(false);
        if (response) {
          socket.emit("new message", {
            response,
          });
          console.log(response);
          // console.log("message id : ", response._id);
          // console.log("user id : ", response.chat.users[0]._id);

          socket.emit("message read", response);

          const updatedMessage = {
            ...response,
            //readBy: onlineStatus,
          };

          setChatData((prevChatData) => {
            const updatedChatData = {
              ...prevChatData,
              messages: [...prevChatData.messages, updatedMessage],
            };
            return updatedChatData;
          });

          // Clear the input field
          setNewMessage("");
          setFocusOnInputField();
        } else {
          //setShowModel(true);
          console.error("Error saving message:", response);
        }
      } catch (error) {
        console.error("Error saving message:", error);
      }
    };

    const setFocusOnInputField = () => {
      // Set focus back to the input field
      const inputField = document.getElementById("custom-css-outlined-input");
      if (inputField) {
        inputField.focus();
      }
    };

    if (!chatData) {
      return null; // or loading indicator
    }

    const { header_user_data, messages: chatMessages } = chatData;
    const { _id: headerUserId, blockStatus } = header_user_data;
    const isBlockedButton =
      chatData.header_user_data.blockStatus._id !== chatData.header_user_data._id;
    const isBlocked = chatData.header_user_data.blockStatus.Blocked === "Yes";
    const isIDMatched = chatData.header_user_data.blockStatus._id === chatData.header_user_data._id;
    const isSocketStatusYes = block_StatusSocket.status === "Yes";
    const isSocketUserIDMatched = block_StatusSocket.userId !== chatData.header_user_data._id;

    if (block_StatusSocket.status) {
      // Agar koi bhi match nahi hoti, toh socket status check karo
      if (isSocketStatusYes && isSocketUserIDMatched) {
        // Agar socket status "Yes" hai aur user IDs match karte hain, toh false
        isFormGroupVisible = false;
      } else {
        // Agar kuch bhi match nahi hota, toh true
        isFormGroupVisible = true;
      }
    } else if (chatData.header_user_data.blockStatus.Blocked === "Yes") {
      // Agar Blocked "Yes" hai
      if (isIDMatched) {
        // Agar IDs match karte hain, toh false
        isFormGroupVisible = true;
      } else {
        // Agar IDs match nahi karte, toh true
        isFormGroupVisible = false;
      }
    } else {
      // Agar Blocked "No" hai, toh isFormGroupVisible true hoga
      isFormGroupVisible = true;
    }

    // const handleCloseConfirmation = async () => {
    //   try {
    //     const user_ID = chatData.header_user_data.blockStatus._id;
    //     const block_status = "No";
    //     socket.emit("block Status", {
    //       chat_id,
    //       status: block_status,
    //       userId: chatData.header_user_data.blockStatus._id,
    //     });
    //     const response = await WebsiteApi.blockUser(chat_id, user_ID, block_status);
    //     isFormGroupVisible = true;
    //     // Update the chatData with new block status
    //     // const updatedChatData = {
    //     //   header_user_data: {
    //     //     ...chatData.header_user_data,
    //     //     blockStatus: {
    //     //       ...chatData.header_user_data.blockStatus,
    //     //       Blocked: block_status,
    //     //     },
    //     //   },
    //     // };

    //     // // Dispatch the updated chatData to the Redux store
    //     // dispatch(updateChatData(updatedChatData));
    //   } catch (error) {
    //     console.log("failed");
    //   }
    // };

    return (
      <Card>
        <CssBaseline />
        <Header userData={header_user_data} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            height: "80vh", // Height set to 100vh
            position: "relative", // Position relative to contain absolutely positioned input
            paddingTop: "20px",
            paddingBottom: "55px",
            overflowX: "hidden",
          }}
        >
          {chatMessages.length > 0 && (
            <Grid container sx={{ overflow: "scroll" }} ref={scrollRef}>
              {chatMessages.map((message, index) => (
                <React.Fragment key={message._id}>
                  {index === 0 || message.dateLabel !== chatMessages[index - 1].dateLabel ? (
                    <Typography
                      elevation={8}
                      variant="subtitle1"
                      className="chat_date_status rounded-pill"
                      key={message._id + "-label"}
                    >
                      {message.dateLabel}
                    </Typography>
                  ) : null}
                  <ChatMsg
                    key={message._id}
                    avatar={message.sender.pic}
                    first_name={message.sender.first_name}
                    last_name={message.sender.last_name}
                    datetime={message.datetime}
                    readBy={message.readBy}
                    messages={[message.content]}
                    side={message.sender._id === headerUserId ? "left" : "right"}
                  />
                </React.Fragment>
              ))}
            </Grid>
          )}

          {chatPageData &&
          chatPageData.header_user_data &&
          chatPageData.header_user_data.blockStatus.Blocked === "Yes" ? (
            <Typography className="No_Chat_message" align="center" mb={5}>
              You Are Blocked{" "}
              {`${chatPageData.header_user_data.first_name} ${chatPageData.header_user_data.last_name}`}
            </Typography>
          ) : (
            <span> </span>
          )}

          {isTyping && (
            <Grid container>
              <div>
                <Lottie
                  options={defaultOptions}
                  height={30}
                  width={70}
                  style={{ marginBottom: 20, marginLeft: 10 }}
                />
              </div>
            </Grid>
          )}

          {isTyping && chatMessages.length === 0 && (
            <div style={{ margin: "auto", marginTop: "139px" }}>
              <Typography variant="body1" align="center" mt={5} className="No_Chat_meesage">
                Typing...
              </Typography>
            </div>
          )}

          {!isTyping && chatMessages.length === 0 && (
            <div style={{ margin: "auto", marginTop: "139px" }}>
              <Typography variant="body1" align="center" mt={5} className="No_Chat_meesage">
                {chatData.status ? "No Messages Found" : "No Chat Found"}
              </Typography>
            </div>
          )}

          {isFormGroupVisible ? (
            <span>
              {isEmojiPickerOpen && (
                <EmojiPicker style={{ width: "100%" }} onEmojiClick={handleEmojiSelect} />
              )}
              <FormGroup
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  backgroundColor: "#ffffff", // Example background color
                  paddingTop: "10px",
                  paddingBottom: "10px", // Example padding
                  borderTop: "1px solid #dddddd", // Example border
                }}
              >
                <Grid
                  container
                  item
                  xs={12}
                  alignItems="center"
                  justifyContent="center"
                  marginBottom="0px"
                >
                  <Grid
                    container
                    item
                    xs={12}
                    alignItems="center"
                    justifyContent="center"
                    marginBottom="0px"
                  >
                    <Grid item xs={10}>
                      <CssTextField
                        fullWidth
                        multiline
                        maxRows={2}
                        label="Message"
                        id="custom-css-outlined-input"
                        className="rounded-pill"
                        inputRef={(input) => input && input.focus()}
                        value={newMessage}
                        onChange={typingHandler}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && newMessage.trim() !== "") {
                            e.preventDefault(); // Enter key ka default behavior ko rokne ke liye
                            sendMessage();
                          }
                        }}
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
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        type="submit"
                        sx={{ padding: "0px" }}
                        disabled={!newMessage.trim()}
                      >
                        <img
                          onClick={newMessage.trim() ? sendMessage : null}
                          src={SendIcon}
                          alt="send_icon"
                          style={{
                            transform: "rotate(45deg)",
                            opacity: newMessage.trim() ? 1 : 0.5,
                            cursor: newMessage.trim() ? "pointer" : "not-allowed",
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </FormGroup>
            </span>
          ) : (
            <Typography className="No_Chat_meesage" align="center" mb={5}>
              You Are Blocked
            </Typography>
          )}
        </Box>

        {/* {showModel && (
          <DraggableDialog
            onClose={handleCloseConfirmation}
            onSubscribe={handleCloseConfirmation}
            message={`Are you sure you want to unblock?`}
            heading="Unblock Confirmation"
            ButtonText="Unblock"
            ButtonValue="Unblock"
            // open={confirmationOpen}
          />
        )} */}
      </Card>
    );
  };

  if (!chat_id || chat_id === "blank_page") {
    return <ChatPageBalnk />;
  } else {
    return <ChatPage />;
  }
};
export default ChatPageWrapper;
