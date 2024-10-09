import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Drawer from "@mui/joy/Drawer";
import List from "@mui/joy/List";
import ListItemButton from "@mui/joy/ListItemButton";
import Typography from "@mui/joy/Typography";
import ModalClose from "@mui/joy/ModalClose";
import Menu from "@mui/icons-material/Menu";
import AuthModel from "./Authmodel";
import { ThemeProvider } from "@mui/joy/styles";
import theme from "assets/theme";
import { setSidebarNumber } from "../../Actions/AuthActions";
import { set_Notification_Type } from "Actions/UserActivity.js";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserdataCookie, checkCookies } from "cookies";
import { setCategory_id } from "Actions/CategoryActions";

export default function DrawerMobileNavigation() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarnumber = useSelector((state) => state.auth.sidebarnumber);
  const reduxsidebarindexNumber = useSelector((state) => state.userActivity.sidebarindexNumber);
  const [selectedIndex, setSelectedIndex] = React.useState(reduxsidebarindexNumber);
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);

  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment

  useEffect(() => {
    dispatch(setCategory_id(null));
  }, [reduxsidebarindexNumber]);

  const CheckAuth = async (event) => {
    if (checkCookies()) {
      if (event == "My_Profile") {
        handleListItemClick(event, 9);
        navigate("/website-my-profile-view");
      } else if (event == "Video_List") {
        handleListItemClick(event, 2);
        navigate("/website-video-list");
      } else if (event == "Reel_List") {
        handleListItemClick(event, 3);
        dispatch(setCategory_id(null));
        navigate("/website-reels-list/1");
      } else if (event == "Timeline_List") {
        handleListItemClick(event, 4);
        navigate("/website-timeline-list");
      } else if (event == "Job_List") {
        handleListItemClick(event, 6);
        navigate("/website-job-list");
      } else if (event == "Edit_Profile") {
        navigate("/website-edit-profile");
      } else if (event == "Applied_Job") {
        handleListItemClick(event, 7);
        navigate("/website-my-applied-job-list");
      } else if (event == "My_Job") {
        handleListItemClick(event, 8);
        navigate("/website-my-job-list");
      } else if (event == "Bank_Details") {
        navigate("/website-edit-bank-details");
      } else if (event == "Calendar") {
        handleListItemClick(event, 12);
        navigate("/website-edit-calendra");
      } else if (event == "Subscriber") {
        handleListItemClick(event, 11);
        navigate("/website-subscription-list");
      } else if (event == "Hire") {
        handleListItemClick(event, 14);
        navigate("/website-hire-list");
      } else if (event == "Change_password") {
        navigate("/website-change-password");
      } else if (event == "friend_request") {
        handleListItemClick(event, 5);
        navigate("/website-friend-list");
      } else if (event == "Chat_List") {
        handleListItemClick(event, 18);
        navigate("/website-chat-mobile/blank_page_mobile");
      }
    } else {
      setActionType(event);
      setShowModel(true);
    }
  };

  useEffect(() => {
    console.log(sidebarnumber);
    setSelectedIndex(sidebarnumber);
  }, [sidebarnumber]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    dispatch(setSidebarNumber(index));
  };
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <IconButton variant="outlined" color="neutral" onClick={() => setOpen(true)}>
          <Menu />
        </IconButton>
        <Drawer open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              ml: "auto",
              mt: 1,
              mr: 2,
            }}
          >
            <Typography
              component="label"
              htmlFor="close-icon"
              fontSize="sm"
              fontWeight="lg"
              sx={{ cursor: "pointer" }}
            ></Typography>
            <ModalClose id="close-icon" sx={{ position: "initial" }} />
          </Box>

          <List
            size="lg"
            component="nav"
            sx={{
              flex: "none",

              "& > div": { justifyContent: "left" },
            }}
          >
            <Link to="/">
              <ListItemButton
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 1 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 1 ? "#578a48" : "inherit",
                }}
              >
                Home
              </ListItemButton>
            </Link>

            <ListItemButton
              selected={selectedIndex === 2}
              onClick={(event) => {
                CheckAuth("Video_List");
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 2 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 2 ? "#578a48" : "inherit",
              }}
            >
              Video
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 3}
              onClick={(event) => {
                CheckAuth("Reel_List");
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 3 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 3 ? "#578a48" : "inherit",
              }}
            >
              Quicky
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 4}
              onClick={(event) => {
                CheckAuth("Timeline_List");
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 4 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 4 ? "#578a48" : "inherit",
              }}
            >
              Post
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 5}
              onClick={(event) => {
                CheckAuth("friend_request"); // Add the CheckAuth function here
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 5 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 5 ? "#578a48" : "inherit",
              }}
            >
              My Club
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 6}
              onClick={(event) => {
                CheckAuth("Job_List");
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 6 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 6 ? "#578a48" : "inherit",
              }}
            >
              All Job
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 7}
              onClick={(event) => {
                CheckAuth("Applied_Job"); // Add the CheckAuth function here
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 7 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 7 ? "#578a48" : "inherit",
              }}
            >
              Applied Job
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 8}
              onClick={(event) => {
                CheckAuth("My_Job"); // Add the CheckAuth function here
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 8 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 8 ? "#578a48" : "inherit",
              }}
            >
              My Job
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 18}
              onClick={(event) => {
                CheckAuth("Chat_List"); // Add the CheckAuth function here
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 18 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 18 ? "#578a48" : "inherit",
              }}
            >
              Chat
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 9}
              onClick={(event) => {
                CheckAuth("My_Profile"); // Add the CheckAuth function here
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 9 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 9 ? "#578a48" : "inherit",
              }}
            >
              My Profile
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 11}
              onClick={(event) => {
                CheckAuth("Subscriber"); // Add the CheckAuth function here
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 11 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 11 ? "#578a48" : "inherit",
              }}
            >
              Subscriber
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 12}
              onClick={(event) => {
                CheckAuth("Calendar"); // Add the CheckAuth function here
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 12 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 12 ? "#578a48" : "inherit",
              }}
            >
              Calendar
            </ListItemButton>

            <ListItemButton
              selected={selectedIndex === 14}
              onClick={(event) => {
                CheckAuth("Hire"); // Add the CheckAuth function here
              }}
              className="Sidebar_optine"
              sx={{
                borderLeft: selectedIndex === 14 ? "8px solid #578a48 " : "none",
                color: selectedIndex === 14 ? "#578a48" : "inherit",
              }}
            >
              Hire
            </ListItemButton>

            <Link to="/website-contact-us">
              <ListItemButton
                selected={selectedIndex === 16}
                onClick={(event) => handleListItemClick(event, 16)}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 16 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 16 ? "#578a48" : "inherit",
                }}
              >
                Contact Us
              </ListItemButton>
            </Link>

            <Link to="/website-privacy-policy">
              <ListItemButton
                selected={selectedIndex === 13}
                onClick={(event) => {
                  handleListItemClick(event, 13);
                }}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 13 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 13 ? "#578a48" : "inherit",
                }}
              >
                Privacy Policy
              </ListItemButton>
            </Link>

            <Link to="/website-terms-conditions">
              <ListItemButton
                selected={selectedIndex === 17}
                onClick={(event) => {
                  handleListItemClick(event, 17);
                }}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 17 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 17 ? "#578a48" : "inherit",
                }}
              >
                Terms & Conditions
              </ListItemButton>
            </Link>

            <Link to="/website-about-us">
              <ListItemButton
                selected={selectedIndex === 15}
                onClick={(event) => handleListItemClick(event, 15)}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 15 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 15 ? "#578a48" : "inherit",
                }}
              >
                About App
              </ListItemButton>
            </Link>
          </List>
          {showModel && (
            <AuthModel
              message={
                actionType === "My_Profile"
                  ? "Sign in to make your Profile."
                  : actionType === "Edit_Profile"
                  ? "Sign in to make your Profile."
                  : actionType === "Applied_Job"
                  ? "Sign in to view applied jobs"
                  : actionType === "My_Job"
                  ? "Sign in to view my jobs"
                  : actionType === "Bank_Details"
                  ? "Sign in to view bank details"
                  : actionType === "Calendar"
                  ? "Sign in to view calendar"
                  : actionType === "Subscriber"
                  ? "Sign in to view Subscriber List"
                  : actionType === "Hire"
                  ? "Sign in to view Hire List"
                  : actionType === "Change_password"
                  ? "Sign in to Change Password"
                  : actionType === "friend_request"
                  ? "Sign in to view My Club"
                  : actionType === "Video_List"
                  ? "Sign in to View Video List."
                  : actionType === "Reel_List"
                  ? "Sign in to View Quicky List."
                  : actionType === "Timeline_List"
                  ? "Sign in to View Post List."
                  : actionType === "Job_List"
                  ? "Sign in to View Job List."
                  : actionType === "Chat_List"
                  ? "Sign in to View Chat List."
                  : ""
              }
              heading={
                actionType === "My_Profile"
                  ? "Make your My Profile.?"
                  : actionType === "Edit_Profile"
                  ? "Edit My Profile."
                  : actionType === "Applied_Job"
                  ? "Applied Jobs."
                  : actionType === "My_Job"
                  ? "My Jobs."
                  : actionType === "Bank_Details"
                  ? "Bank Details"
                  : actionType === "Calendar"
                  ? "Calendar"
                  : actionType === "Subscriber"
                  ? "Subscriber List"
                  : actionType === "Hire"
                  ? "Hire List"
                  : actionType === "Change_password"
                  ? "Change Password"
                  : actionType === "friend_request"
                  ? "My Club"
                  : actionType === "Video_List"
                  ? "Video List"
                  : actionType === "Reel_List"
                  ? "Quicky List"
                  : actionType === "Timeline_List"
                  ? "Post List"
                  : actionType === "Job_List"
                  ? "Job List"
                  : actionType === "Chat_List"
                  ? "Chat List"
                  : ""
              }
              onClose={() => setShowModel(false)}
            />
          )}
        </Drawer>
      </ThemeProvider>
    </React.Fragment>
  );
}
