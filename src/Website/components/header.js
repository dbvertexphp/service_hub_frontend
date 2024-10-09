import React, { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import TiHome from "../../assets/website_img/home_icon.svg";
import HiUsers from "../../assets/website_img/my_club_icon.svg";
import CgBriefcase from "../../assets/website_img/job_icon.svg";
import Chat_icon from "../../assets/website_img/Union.svg";
import Plus_icon from "../../assets/website_img/Plus_uplaod_icon.svg";
import IoIosNotifications from "../../assets/website_img/notification_icon.svg";
import Logout_model from "../model_components/permission_model";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "Actions/AuthActions";
import Sidebar from "./sidebar";
import { getUserdataCookie, checkCookies, deleteCookie, setCookie } from "../../cookies";
import { setSidebarNumber } from "../../Actions/AuthActions";
import { WebsiteApi } from "Api/WebsiteApi";
import { useNavigate } from "react-router-dom";
import createAvatar from "../Utils/avatarUtils";
import AuthModel from "./Authmodel";
import SweetAlertComponent from "../Utils/authfile";
import UplaodeModel from "../uplaod_data/type";
import { BsArrowUpCircleFill } from "react-icons/bs";

const pages = ["Home", " My Club", "Jobs", "Notifications"];
const settings = ["Edit Profile", "Reset Password", "Bank Details", "Logout"];
const icons = [TiHome, HiUsers, CgBriefcase, IoIosNotifications];
const icons_mobile = [Chat_icon, IoIosNotifications];
const pages_mobile = ["Chat Page", "Notifications"];
function ResponsiveAppBar() {
  const base_url = process.env.REACT_APP_BASE_URL;
  const getUserdata = getUserdataCookie("Userdata");
  const getWebsiteToken = Cookies.get("Websitetoken");
  if (!getUserdata) {
    //console.error("Userdata cookie is undefined");
  }
  const [showLogOut, setLogOut] = useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [unreadNotification, setUnreadNotifications] = useState("");
  const [unreadNotificationstatus, setUnreadNotificationsStatus] = useState(false);
  const dispatch = useDispatch();
  const [auth, setAuth] = React.useState(checkCookies());
  const navigate = useNavigate();
  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment
  const [authChack, setAuthChack] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [uplaodemodel, setUplaodeModel] = useState(false);
  const reduxnotificationData = useSelector((state) => state.notificationReducer.notificationData);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 50) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTopBar = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setAuth(checkCookies());
  }, []);

  useEffect(() => {
    console.log("unreadNotificationstatus", unreadNotificationstatus);
  }, [unreadNotificationstatus]);

  useEffect(() => {
    const fetchDataUnreadNotificetion = async () => {
      try {
        const response = await WebsiteApi.getUnreadCount();

        if (response && response.status) {
          setUnreadNotifications(response.Count);
          setUnreadNotificationsStatus(false);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Create a broadcast channel and listen for messages
    const channel = new BroadcastChannel("notificationChannel");
    channel.addEventListener("message", handleMessageEvent);

    // Function to handle incoming messages
    function handleMessageEvent(event) {
      console.log("header call api");
      fetchDataUnreadNotificetion();
    }
    fetchDataUnreadNotificetion();

    return () => {
      // Clean up event listener
      channel.removeEventListener("message", handleMessageEvent);
    };
  }, [reduxnotificationData]);

  useEffect(() => {
    const updateProfilePic = async () => {
      try {
        const response = await WebsiteApi.getUsers();
        if (response && response.status) {
          const user = JSON.parse(Cookies.get("Userdata"));
          const updatedUser = { ...user, pic: response.user.pic };
          setCookie("Userdata", JSON.stringify(updatedUser));
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

    if (checkCookies()) {
      updateProfilePic();
    }
  }, []);

  const handleLogout = async () => {
    if (getWebsiteToken) {
      setLogOut(true);
    } else {
      setShowModel(true);
    }
  };

  const handleLogoutResponse = (response) => {
    handleLogoutApi(response);
    setLogOut(false);
  };

  const handleLogoutApi = async (response) => {
    if (response == "Logout") {
      try {
        const response = await WebsiteApi.logoutUser();
        if (response && response.status) {
          deleteCookie("Userdata");
          deleteCookie("Websitetoken");
          window.location.href = base_url;
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleButtonClickSidebarNumber = (sibarnumber) => {
    // Dispatch the setNumber action with the desired number
    dispatch(setSidebarNumber(sibarnumber));
  };

  const isBelow1200px = useMediaQuery("(max-width:1200px)");
  const isBelow600px = useMediaQuery("(max-width:600px)");
  const isBelow500px = useMediaQuery("(max-width:500px)");
  let avatarComponent = null; // ya const avatarComponent = null;

  const getPathForPage = (page) => {
    // Define the paths for each page here
    if (page === "Home") {
      navigate("/");
    } else if (page === " My Club") {
      if (checkCookies()) {
        navigate("/website-friend-list");
      } else {
        setActionType(page);
        setShowModel(true);
      }
    } else if (page === "Jobs") {
      if (checkCookies()) {
        navigate("/website-job-list");
      } else {
        setActionType(page);
        setShowModel(true);
      }
    } else if (page === "Chat Page") {
      if (checkCookies()) {
        dispatch(setSidebarNumber(18));
        navigate("/website-chat-mobile/blank_page_mobile");
      } else {
        setActionType(page);
        setShowModel(true);
      }
    } else if (page === "Notifications") {
      if (checkCookies()) {
        setUnreadNotificationsStatus(true);
        navigate("/website-notificaton-list");
      } else {
        // Set action type to "Notification" and show the model
        setActionType(page);
        setShowModel(true);
      }
    }
    return "/";
  };

  if (checkCookies()) {
    avatarComponent = createAvatar(
      getUserdata.pic,
      getUserdata.first_name,
      getUserdata.last_name,
      "headermobile"
    );
  }

  let avatarComponentDestop = null;

  if (checkCookies()) {
    avatarComponentDestop = createAvatar(
      getUserdata.pic,
      getUserdata.first_name,
      getUserdata.last_name,
      "headerdesktop"
    );
  }
  const isPageActive = (page) => {
    const pageUrls = {
      Home: "/",
      " My Club": "/website-friend-list",
      Jobs: "/website-job-list",
      "Chat Page": "/website-chat-mobile/blank_page_mobile",
      Notifications: "/website-notificaton-list",
    };

    return window.location.pathname === pageUrls[page];
  };

  function getPageURL(page) {
    switch (page) {
      case "Home":
        return "/";
      case " My Club":
        return "/website-friend-list";
      case "Jobs":
        return "/website-job-list";
      case "Notifications":
        return "/website-notificaton-list";
      default:
        return "/";
    }
  }

  const notificatonCounntremove = (page) => {
    if (page === "Notifications") {
      setUnreadNotificationsStatus(true);
    }
  };

  const handleMenuItemClick = (setting) => {
    switch (setting) {
      case "Reset Password":
        navigate("/website-change-password");
        break;
      case "Bank Details":
        navigate("/website-edit-bank-details");
        break;
      case "Logout":
        handleLogout();
        break;
      default:
        break;
    }
    handleCloseUserMenu();
  };

  const UplaodeModelOpen = () => {
    setUplaodeModel(true);
  };

  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        bgcolor: "#FFF",
        position: "fixed",
        width: "100%",
        zIndex: "1000",
        display: "-webkit-inline-box",
      }}
    >
      {isBelow1200px && (
        <Box sx={{ margin: "auto", marginLeft: "10px" }}>
          <Sidebar />
        </Box>
      )}
      <Grid container>
        <Grid item xs={2} md={3} sm={4} textAlign={"center"} alignSelf={"center"}>
          <Link to="/" onClick={() => handleButtonClickSidebarNumber(1)}>
            <img src="/assets/images/tobuu_logo.png" className="logo_img" />

            {!isBelow600px && (
              <img
                style={{ width: "82px", marginLeft: "10px", marginTop: "5px" }}
                src="/assets/images/tobuu_name.png"
              />
            )}
          </Link>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "flex", lg: "none" },
            }}
          >
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", lg: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: { xs: "flex", lg: "none" }, float: "right", marginTop: "6px" }}>
            {auth && (
              <span>
                {pages_mobile.map((page, index) => (
                  <Button
                    key={page} // Make sure 'page' is unique or use a stable identifier
                    sx={{
                      color: "white",
                      alignItems: "center",
                      paddingBottom: 0,
                      borderRadius: 0,
                      padding: "0px",
                      margin: "0px",
                    }}
                    onClick={() => getPathForPage(page)}
                  >
                    <div key={index}>
                      {index === 3 && unreadNotification !== "" && !unreadNotificationstatus ? (
                        <Badge
                          badgeContent={unreadNotification}
                          color="primary"
                          max={unreadNotification}
                        >
                          <img src={icons_mobile[index]} alt={page} />
                        </Badge>
                      ) : (
                        <img src={icons_mobile[index]} alt={page} />
                      )}
                    </div>
                  </Button>
                ))}
              </span>
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", lg: "flex" },
              justifyContent: "space-evenly",
            }}
          >
            {pages.map((page, index) =>
              auth ? (
                <Link to={getPageURL(page)} key={page}>
                  <Button
                    key={page}
                    sx={{
                      // Add 4px green border for active page
                      color: "white",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      paddingBottom: 0,
                      borderRadius: 0,
                    }}
                    onClick={() => notificatonCounntremove(page)}
                  >
                    <div key={index}>
                      {auth &&
                      index === 3 &&
                      unreadNotification !== "" &&
                      !unreadNotificationstatus ? (
                        <Badge
                          key={index}
                          badgeContent={unreadNotification}
                          color="primary"
                          max={unreadNotification}
                        >
                          <img src={icons[index]} alt={page} />
                        </Badge>
                      ) : (
                        // Auth check true nahi hai ya index 4 nahi hai to sirf image dikhao
                        <img key={index} src={icons[index]} alt={page} />
                      )}

                      <div
                        style={{
                          borderBottom: isPageActive(page) ? "4px solid green" : "4px solid white",
                        }}
                        className="header_icon_name"
                      >
                        {page}
                      </div>
                    </div>
                  </Button>
                </Link>
              ) : (
                <Button
                  key={page}
                  sx={{
                    // Add 4px green border for active page
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingBottom: 0,
                    borderRadius: 0,
                  }}
                  onClick={() => getPathForPage(page)}
                >
                  <div key={index}>
                    {auth &&
                    index === 3 &&
                    unreadNotification !== "" &&
                    !unreadNotificationstatus ? (
                      <Badge
                        key={index}
                        badgeContent={unreadNotification}
                        color="primary"
                        max={unreadNotification}
                      >
                        <img src={icons[index]} alt={page} />
                      </Badge>
                    ) : (
                      // Auth check true nahi hai ya index 4 nahi hai to sirf image dikhao
                      <img key={index} src={icons[index]} alt={page} />
                    )}

                    <div
                      style={{
                        borderBottom: isPageActive(page) ? "4px solid green" : "4px solid white",
                      }}
                      className="header_icon_name"
                    >
                      {page}
                    </div>
                  </div>
                </Button>
              )
            )}
          </Box>
        </Grid>
        <Grid item xs={2} textAlign={"center"} alignSelf={"center"}>
          <Box sx={{ flexGrow: 1, display: { xs: "none", lg: "flex" } }} justifyContent={"center"}>
            {auth ? (
              <span>
                <div className="uplaod_icon">
                  <img
                    src={Plus_icon}
                    alt="page"
                    style={{ cursor: "pointer", display: "none" }}
                    onClick={() => UplaodeModelOpen()}
                  />
                </div>
                <Tooltip title="User Profile">
                  <IconButton onClick={handleOpenUserMenu}>
                    {avatarComponentDestop}
                    <span className="user_name">
                      {`${getUserdata.first_name} ${getUserdata.last_name}`}
                    </span>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleMenuItemClick(setting)}
                      className="user_name"
                    >
                      {setting === "Edit Profile" ? (
                        <Link to="/website-edit-profile">
                          <Typography className="user_name" textAlign="center">
                            {setting}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography className="user_name" textAlign="center">
                          {setting}
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                </Menu>
              </span>
            ) : (
              <span>
                <Button variant="contained" className="login_button rounded-pill">
                  <Link to="/website-login" style={{ textDecoration: "none", color: "inherit" }}>
                    Sign in
                  </Link>
                </Button>
              </span>
            )}
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", lg: "none" } }} justifyContent={"center"}>
            {!auth && (
              <Link to="/website-login">
                <Button
                  variant="contained"
                  className="login_button rounded-pill"
                  sx={{ width: "max-content" }}
                >
                  Sign in
                </Button>
              </Link>
            )}

            <Tooltip title="User Profile">
              <IconButton sx={{ p: 0, pr: 3 }} onClick={handleOpenUserMenu}>
                {avatarComponent}
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
      <div
        style={{
          position: "fixed",
          bottom: isBelow500px ? "10px" : "20px",
          right: isBelow500px ? "10px" : "20px",
          display: isVisible ? "block" : "none", // Show button when isVisible is true
          zIndex: "999", // Ensure the button stays above other elements
        }}
      >
        <BsArrowUpCircleFill
          onClick={scrollToTopBar}
          style={{ fontSize: "2.5rem", cursor: "pointer", color: "#578a48 " }}
        />
      </div>

      {authChack && <SweetAlertComponent />}
      {uplaodemodel && <UplaodeModel onClose={() => setUplaodeModel(false)} />}
      {showLogOut && (
        <Logout_model
          onClose={() => setLogOut(false)}
          onSubscribe={handleLogoutResponse}
          message={"Are you sure you want to log out?"}
          heading={"Logout"}
          ButtonText={"Logout"}
          ButtonValue={"Logout"}
        />
      )}
      {showModel && (
        <AuthModel
          message={
            actionType === "Notifications"
              ? "Sign in to chack Notification."
              : actionType === " My Club"
              ? "Sign in to view My Club."
              : actionType === "Jobs"
              ? "Sign in to View Job List."
              : actionType === "Chat Page"
              ? "Sign in to View Job List."
              : ""
          }
          heading={
            actionType === "Notifications"
              ? "Notification"
              : actionType === " My Club"
              ? "My Club"
              : actionType === "Jobs"
              ? "Job List"
              : actionType === "Chat Page"
              ? "Job List"
              : ""
          }
          onClose={() => setShowModel(false)}
        />
      )}
    </AppBar>
  );
}

export default ResponsiveAppBar;
