import React, { useState, useEffect, useRef } from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarNumber } from "../../Actions/AuthActions";
import AuthModel from "./Authmodel";
import { getUserdataCookie, checkCookies } from "cookies";
import { useNavigate } from "react-router-dom";
import { setCategory_id } from "Actions/CategoryActions";
import { Typography } from "@mui/material";
import { setSearch_data } from "Actions/SreachDataActions";

function JobSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarnumber = useSelector((state) => state.auth.sidebarnumber);
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const reduxsidebarindexNumber = useSelector((state) => state.userActivity.sidebarindexNumber);
  const [selectedIndex, setSelectedIndex] = React.useState(reduxsidebarindexNumber);

  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment

  const CheckAuth = async (event) => {
    if (checkCookies()) {
      if (event == "My_Profile") {
        handleListItemClick(event, 9);
        navigate("/website-my-profile-view");
      } else if (event == "Video_List") {
        handleListItemClick(event, 2);
        navigate("/website-video-list");
      } else if (event == "Reel_List") {
        dispatch(setCategory_id(null));
        handleListItemClick(event, 3);
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
      }
    } else {
      setActionType(event);
      setShowModel(true);
    }
  };

  useEffect(() => {
    const value = "";
    //dispatch(setSearch_data(value));
    setSelectedIndex(sidebarnumber);
  }, [sidebarnumber]);

  useEffect(() => {
    setSelectedIndex(reduxsidebarindexNumber);
    dispatch(setCategory_id(null));
  }, [reduxsidebarindexNumber]);

  const CategoryNull = async (event) => {
    dispatch(setCategory_id(null));
    // dispatch(setSearch_data(""));
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    dispatch(setSidebarNumber(index));
  };

  const reelsId = "1";

  // function handleClick(event) {
  // if (!checkCookies()) {
  //   event.preventDefault();
  //   // Optionally, show a message to the user if cookies are not present
  //   window.location.href = "/website-login";
  //   console.log("Cookies are not present. Please log in first.");
  // }
  // }
  return (
    <div
      className="latest_jab_div latest_jab_div_Fixed"
      style={{ overflow: "scroll", height: "91vh" }}
    >
      <List
        component="nav"
        aria-label="secondary mailbox folder"
        sx={{ width: "100%", maxWidth: "auto", bgcolor: "background.paper" }}
      >
        <Link to="/" style={{ display: "none" }}>
          <ListItemButton
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
            className="Sidebar_optine"
            sx={{
              borderLeft: selectedIndex === 0 ? "8px solid #578a48 " : "none",
              color: selectedIndex === 0 ? "#578a48" : "inherit",
            }}
          >
            <ListItemText primary="Homess" />
          </ListItemButton>
        </Link>

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
            <ListItemText primary="Home" />
          </ListItemButton>
        </Link>

        {checkCookies() ? (
          <span>
            <Link to={`/website-video-list`}>
              <ListItemButton
                selected={selectedIndex === 2}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 2 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 2 ? "#578a48" : "inherit",
                }}
              >
                <ListItemText primary="Video" />
              </ListItemButton>
            </Link>

            <Link to={`/website-reels-list/1`}>
              <ListItemButton
                selected={selectedIndex === 3}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 3 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 3 ? "#578a48" : "inherit",
                }}
                onClick={(event) => {
                  CategoryNull("Reel_List");
                }}
              >
                <ListItemText primary=" Quicky" />
              </ListItemButton>
            </Link>

            <Link to={`/website-timeline-list`}>
              <ListItemButton
                selected={selectedIndex === 4}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 4 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 4 ? "#578a48" : "inherit",
                }}
              >
                <ListItemText primary="Post" />
              </ListItemButton>
            </Link>

            <Link to={`/website-friend-list`}>
              <ListItemButton
                selected={selectedIndex === 5}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 5 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 5 ? "#578a48" : "inherit",
                }}
              >
                <ListItemText primary="My Club" />
              </ListItemButton>
            </Link>

            <Link to={`/website-job-list`}>
              <ListItemButton
                selected={selectedIndex === 6}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 6 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 6 ? "#578a48" : "inherit",
                }}
              >
                <ListItemText primary="All Job" />
              </ListItemButton>
            </Link>

            <Link to={`/website-my-applied-job-list`}>
              <ListItemButton
                selected={selectedIndex === 7}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 7 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 7 ? "#578a48" : "inherit",
                }}
              >
                <ListItemText primary="Applied Job" />
              </ListItemButton>
            </Link>

            <Link to={`/website-my-job-list`}>
              <ListItemButton
                selected={selectedIndex === 8}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 8 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 8 ? "#578a48" : "inherit",
                }}
              >
                <ListItemText primary="My Job" />
              </ListItemButton>
            </Link>
          </span>
        ) : (
          <span>
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
              <ListItemText primary="Video" />
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
              <ListItemText primary=" Quicky" />
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
              <ListItemText primary="Post" />
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
              <ListItemText primary="My Club" />
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
              <ListItemText primary="All Job" />
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
              <ListItemText primary="Applied Job" />
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
              <ListItemText primary="My Job" />
            </ListItemButton>
          </span>
        )}
      </List>
      <List
        component="nav"
        aria-label="secondary mailbox folder"
        sx={{ width: "100%", maxWidth: "auto", bgcolor: "background.paper" }}
      >
        {checkCookies() ? (
          <span>
            <Link to={`/website-my-profile-view`}>
              <ListItemButton
                selected={selectedIndex === 9}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 9 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 9 ? "#578a48" : "inherit",
                }}
              >
                <ListItemText primary="My Profile" />
              </ListItemButton>
            </Link>

            <Link to={`/website-subscription-list`}>
              <ListItemButton
                selected={selectedIndex === 11}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 11 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 11 ? "#578a48" : "inherit",
                }}
              >
                <ListItemText primary=" Subscriber" />
              </ListItemButton>
            </Link>

            <Link to={`/website-edit-calendra`}>
              <ListItemButton
                selected={selectedIndex === 12}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 12 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 12 ? "#578a48" : "inherit",
                }}
              >
                <ListItemText primary="Calendar" />
              </ListItemButton>
            </Link>

            <Link to={`/website-hire-list`}>
              <ListItemButton
                selected={selectedIndex === 14}
                className="Sidebar_optine"
                sx={{
                  borderLeft: selectedIndex === 14 ? "8px solid #578a48 " : "none",
                  color: selectedIndex === 14 ? "#578a48" : "inherit",
                }}
              >
                <ListItemText primary="Hire" />
              </ListItemButton>
            </Link>
          </span>
        ) : (
          <span>
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
              <ListItemText primary="My Profile" />
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
              <ListItemText primary=" Subscriber" />
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
              <ListItemText primary="Calendar" />
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
              <ListItemText primary="Hire" />
            </ListItemButton>
          </span>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "0px", lineHeight: "1.5" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
              marginLeft: "14px",
            }}
          >
            <span className="dot">&#8226;</span>
            <Link to="/website-contact-us">
              <Typography className="SideBar_Comapny_details">Contact Us</Typography>
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
              marginLeft: "14px",
            }}
          >
            <span className="dot">&#8226;</span>
            <Link to="/website-about-us">
              <Typography className="SideBar_Comapny_details">About Us</Typography>
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
              marginLeft: "14px",
            }}
          >
            <span className="dot">&#8226;</span>
            <Link to="/website-terms-conditions">
              <Typography className="SideBar_Comapny_details">Terms Conditions</Typography>
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
              marginLeft: "14px",
            }}
          >
            <span className="dot">&#8226;</span>
            <Link to="/website-privacy-policy">
              <Typography className="SideBar_Comapny_details">Privacy Policy</Typography>
            </Link>
          </div>
        </div>
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
              : ""
          }
          onClose={() => setShowModel(false)}
        />
      )}
    </div>
  );
}

export default JobSidebar;
