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
import { useParams } from "react-router-dom";
import { WebsiteApi } from "Api/WebsiteApi";
import Backbutton from "./Backbutton.js";
import Chat_icon from "../../assets/website_img/chat_icon.svg";
import MuiAlert from "@mui/material/Alert";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import createAvatar from "../Utils/avatarUtils";
import { setChatId } from "../../Actions/ChatActions.js";
import { useSelector, useDispatch } from "react-redux";
import { getUserdataCookie, checkCookies } from "cookies";
import TextField from "@mui/material/TextField";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setProfileUrl } from "Actions/UserProfileActions";
const userCookieData = getUserdataCookie("Userdata");

export default function ClubList() {
  const [open, setOpen] = React.useState(false);
  const [clubList, setClubList] = useState([]);
  const clubBoxRef = useRef(null);
  const reduxNotification_Type = useSelector((state) => state.userActivity.Notification_Type);
  const [selectedFilter, setSelectedFilter] = useState(reduxNotification_Type);
  const [unSubscribeButton, setUnSubscribeButton] = useState(true);
  const [first_name, setFirst_name] = useState("");
  const [search, setSearch] = useState("");
  const [status_id, setStatus] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearch(event.target.value); // Update search state with input value
  };

  useEffect(() => {
    if (search !== "") {
      if (selectedFilter == "My_Club") {
        setUnSubscribeButton(true);
        setClubList([]);
        getMyClub();
      } else if (selectedFilter == "Club_Requests") {
        setUnSubscribeButton(false);
        setClubList([]);
        fetchClubRequests();
      } else if (selectedFilter == "Club_Add") {
        setUnSubscribeButton(true);
        setClubList([]);
        getMyFriendsAdd();
      }
    } else {
      if (selectedFilter == "My_Club") {
        setUnSubscribeButton(true);
        setClubList([]);
        getMyClub();
      } else if (selectedFilter == "Club_Requests") {
        setUnSubscribeButton(false);
        setClubList([]);
        fetchClubRequests();
      } else if (selectedFilter == "Club_Add") {
        setUnSubscribeButton(true);
        setClubList([]);
        getMyFriendsAdd();
      }
    }
  }, [search]);

  //   useEffect(() => {
  //     getMyClub();
  //   }, []);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChangeFilter = async (event) => {
    setSelectedFilter(event.target.value);
    if (event.target.value === "My_Club") {
      setClubList([]);
      setUnSubscribeButton(true);
      await getMyClub();
    } else if (event.target.value === "Club_Requests") {
      setClubList([]);
      setUnSubscribeButton(false);
      await fetchClubRequests();
    } else if (event.target.value === "Club_Add") {
      setClubList([]);
      setUnSubscribeButton(true);
      await getMyFriendsAdd();
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

  const getMyClub = async () => {
    try {
      const response = await WebsiteApi.getMyClub(search);
      if (response && response.status && response.friends) {
        const clubList = response.friends;
        setClubList(clubList);
      } else {
        // console.error("Invalid API response format:", response);
      }
    } catch (error) {
      //console.error("Error fetching data:", error);
    }
  };

  const getMyFriendsAdd = async () => {
    try {
      const response = await WebsiteApi.getMyFriendsAdd(search);
      if (response && response.status && response.friends) {
        const clubList = response.friends;

        setClubList(clubList);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchClubRequests = async () => {
    try {
      const response = await WebsiteApi.getClubRequests(search);
      if (response && response.status && response.friends) {
        const clubList = response.friends;
        // Clear the list before setting new data
        setClubList(clubList);
      } else {
        console.error("Invalid API response format:");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const acceptAndRemoveClubRequest = async (club_id, status, first_name, aleardy_club) => {
    if (aleardy_club == 1) {
      setStatus(`${first_name} club request was Accpet`);
    } else if (aleardy_club == 0) {
      setStatus(`${first_name} club request was Reject`);
    } else {
    }

    try {
      const sender_id = club_id;
      const type = "Friend_Request";
      const notificetionData = await WebsiteApi.getNotificationId(sender_id, type);
      const notificetion_id = notificetionData.notificetion_id;

      const response = await WebsiteApi.AcceptClubRequest(club_id, status, notificetion_id); // Update this API call
      if (response && response.status) {
        const updatedList = clubList.filter((club) => club._id !== club_id);
        setClubList(updatedList);
        setFirst_name(first_name);
        setOpen(true);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
      <Card className="Fix_height_without_sreachbar">
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
          <Typography className="Edit_Subscription_heading">My Club</Typography>
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
                  value="My_Club"
                  onClick={handleChangeFilter}
                  className={`Calendra_fillter_button_${
                    selectedFilter === "My_Club" ? "select" : "unselect"
                  }`}
                >
                  My Club
                </Button>
                <Button
                  value="Club_Add"
                  onClick={handleChangeFilter}
                  className={`Calendra_fillter_button_${
                    selectedFilter === "Club_Add" ? "select" : "unselect"
                  }`}
                >
                  Club Add
                </Button>
                <Button
                  value="Club_Requests"
                  onClick={handleChangeFilter}
                  className={`Calendra_fillter_button_${
                    selectedFilter === "Club_Requests" ? "select" : "unselect"
                  }`}
                >
                  Club Requests
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
                ref={clubBoxRef}
              >
                <Box sx={{ textAlign: "center", marginTop: "1%" }}>
                  <TextField
                    id="outlined-search"
                    label="Search Club"
                    type="search"
                    fullWidth
                    value={search}
                    onChange={handleSearchChange}
                    sx={{ cursor: "pointer" }}
                  />
                </Box>
                {clubList.length === 0 ? (
                  <Box sx={{ textAlign: "center", paddingTop: "10%" }}>
                    <Typography variant="body1" className="applied_user_name_title">
                      No Club Member List
                    </Typography>
                  </Box>
                ) : (
                  <React.Fragment>
                    {clubList.map((club) => (
                      <div key={club._id} className="list_box">
                        <CardHeader
                          avatar={
                            <Link
                              onClick={() => {
                                ProfileUrl(userCookieData._id);
                              }}
                            >
                              {createAvatar(
                                club.pic,
                                club.first_name,
                                club.last_name,
                                "notification_list"
                              )}
                            </Link>
                          }
                          sx={{ paddingBottom: "0px" }}
                          title={
                            <Link>
                              <Typography
                                variant="h3"
                                style={{
                                  width: "fit-content",
                                }}
                                onClick={() => {
                                  ProfileUrl(userCookieData._id);
                                }}
                                className="applied_user_name_title"
                              >
                                {`${club.first_name}`}
                              </Typography>
                            </Link>
                          }
                          action={
                            unSubscribeButton ? (
                              <div style={{ display: "flex" }}>
                                <img
                                  src={Chat_icon}
                                  alt="page"
                                  style={{ marginTop: "26px", cursor: "pointer" }}
                                  onClick={() => {
                                    CheckAuth("Chat", club._id);
                                  }}
                                />
                                <div
                                  className="my_club_remove"
                                  onClick={() =>
                                    acceptAndRemoveClubRequest(club._id, 0, club.first_name, 2)
                                  }
                                ></div>
                              </div>
                            ) : (
                              <div style={{ display: "flex" }}>
                                <div
                                  className="my_club_accept"
                                  onClick={() =>
                                    acceptAndRemoveClubRequest(club._id, 1, club.first_name, 1)
                                  }
                                >
                                  <IoIosCheckmarkCircleOutline />
                                </div>
                                <div
                                  className="my_club_remove"
                                  onClick={() =>
                                    acceptAndRemoveClubRequest(club._id, 0, club.first_name, 0)
                                  }
                                >
                                  <RxCrossCircled />
                                </div>
                              </div>
                            )
                          }
                        />
                      </div>
                    ))}
                  </React.Fragment>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
            {status_id}!
          </Alert>
        </Snackbar>
      </Card>
    </div>
  );
}
