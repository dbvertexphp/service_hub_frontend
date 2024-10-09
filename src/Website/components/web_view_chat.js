// Import necessary libraries and components
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import useMediaQuery from "@mui/material/useMediaQuery";
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
import { OutlinedInput } from "@mui/material";
const base_url = process.env.REACT_APP_BASE_URL;
import axios from "axios";
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

const ChatMsg = ({ avatar, messages, side, first_name, last_name, datetime, readBy }) => {
  const formattedDatetime = convertTo12HourFormat(datetime);
  return (
    <Grid
      container
      className="justify-content-center"
      spacing={1}
      justify={side === "right" ? "flex-end" : "flex-start"}
    >
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
                      backgroundColor: "#f0f0f0",
                      background: "#F1F1F1",
                    }
                  : {
                      marginRight: "36px",
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
  const [onlineStatus, setOnlineStatus] = useState("Offline");
  const [anchorEl, setAnchorEl] = useState(null);
  const { chat_id } = useParams();
  const { token } = useParams();
  const [blockButton, setBlockButton] = useState(userData.blockStatus._id !== userData._id);
  const placement = "bottom-end";
  const [userCookieData, setUserCookieData] = useState({});

  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    userCookieData.ChatStatus = true;
    socket.emit("setup", userCookieData, userData._id);
  }, [userCookieData]);
  const getUsers = async () => {
    try {
      const response = await axios.get(`${base_url}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      setUserCookieData(response.data.user);
    } catch (error) {
      throw error;
    }
  };

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
      // const response = await WebsiteApi.blockUser(chatId, userId, status);
      const response = await axios.post(
        `${base_url}/api/chat/blockUser`,
        {
          chatId,
          userId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );

      const updatedStatus = status === 1 ? "Yes" : "No";

      // Update the state based on the updatedStatus
      setBlockButton(updatedStatus === "No");
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  useEffect(() => {
    console.log(userCookieData);
    // Listen for "user online" event to update online status

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
  return (
    <Grid>
      <Card>
        <Box>
          <CardHeader
            action={
              <IconButton aria-label="settings" onClick={handleClickDelete}>
                {isFormGroupVisible && <MoreVertIcon />}
              </IconButton>
            }
            avatar={<div>{avatarComponent}</div>}
            title={
              <Typography variant="h6" className="video_card_user_name_title">
                {`${userData.first_name} ${userData.last_name}`}
              </Typography>
            }
            // subheader={
            //   <Typography
            //     elevation={8}
            //     variant="subtitle1"
            //     className={`video_card_user_name_subheader_chat_online rounded-pill ${
            //       onlineStatus === "Online" ? "online" : "offline"
            //     }`}
            //   ></Typography>
            // }
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
  const { token } = useParams();
  const [onlineStatus, setOnlineStatus] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [latestMessage, setLatestMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [autoFocuss, setAutoFocus] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputProps = useRef(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [block_StatusSocket, setBlock_StatusSocket] = useState({});
  const placement = "bottom-end";
  const isBelow500px = useMediaQuery("(max-width:500px)");

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
        //const response = await WebsiteApi.allMessages(chat_id);
        const response = await axios.get(`${base_url}/api/message/${chat_id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        });

        if (response && response.status) {
          setChatData(response.data);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    socket.emit("join chat", chat_id);
  }, [chat_id]);

  const fetchData = async () => {
    //const response = await WebsiteApi.allMessages(chat_id);
    const response = await axios.get(`${base_url}/api/message/${chat_id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming getWebsiteToken() retrieves the token
        "Content-Type": "application/json",
      },
    });

    if (response && response.status) {
      setChatData(response.data);
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
    // eslint-disable-next-line
  }, [chatData, scrollRef]);

  useEffect(() => {
    socket.on("block Status", ({ status, userId }) => {
      setBlock_StatusSocket({ status, userId });
    });
  }, [chat_id]);

  useEffect(() => {
    const messageReceivedHandler = (message) => {
      const { content, datetime, sender } = message.response;

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

      setChatData((prevChatData) => {
        // Update the existing messages array with the new message
        const updatedChatData = {
          ...prevChatData,
          messages: [...prevChatData.messages, newMessage],
        };
        return updatedChatData;
      });
      // Handle the received message as needed
    };
    socket.on("message received", messageReceivedHandler);

    return () => {
      socket.off("message received", messageReceivedHandler);
      socket.off("user online");
    };
  }, []);

  useEffect(() => {
    if (autoFocuss) {
      // Focus the input field when autoFocuss is true
      const inputField = document.getElementById("custom-css-outlined-input");
      if (inputField) {
        inputField.focus();
      }
    }
  }, [autoFocuss]);

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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    const inputField = document.getElementById("inputField");
    if (inputField) {
      console.log(inputField);
      inputField.focus();
    }
    try {
      // Send the message to the server
      //const response = await WebsiteApi.sendMessageAPI(newMessage, chat_id);
      const content = newMessage;
      const chatId = chat_id;
      const response_data = await axios.post(
        `${base_url}/api/message`,
        {
          content,
          chatId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );

      if (response_data.data) {
        const response = { response: response_data.data };
        socket.emit("new message", response);

        console.log(response.response);

        socket.emit("message read", response.response);

        const updatedMessage = {
          ...response_data.data,
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
        setAutoFocus(true);
      } else {
        console.error("Error saving message:", response_data);
      }
    } catch (error) {
      console.error("Error saving message:", error);
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

  return (
    <Card
      sx={{
        overflow: "hidden",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <CssBaseline />
      <Header userData={header_user_data} />
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          pt: 3,
          px: 2,
          overflowY: "auto",
        }}
      >
        {/* Chat Messages Container */}
        {chatMessages.length > 0 && (
          <Grid container>
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

        {/* Typing Animation */}
        {isTyping && (
          <Grid container>
            <div>
              <Lottie
                options={defaultOptions}
                height={30}
                width={70}
                style={{ marginBottom: 10, marginLeft: 0 }}
              />
            </div>
          </Grid>
        )}

        {/* No Messages Found */}
        {!isTyping && chatMessages.length === 0 && (
          <div style={{ margin: "auto", marginTop: "139px" }}>
            <Typography variant="body1" align="center" mt={5} className="No_Chat_meesage">
              {chatData.status ? "No Messages Found" : "No Chat Found"}
            </Typography>
          </div>
        )}
      </Box>

      {/* Input Box */}

      {isFormGroupVisible ? (
        <span></span>
      ) : (
        <Typography className="No_Chat_meesage" align="center" mb={5}>
          You Are Blocked
        </Typography>
      )}
    </Card>
  );
};

export default ChatPage;
