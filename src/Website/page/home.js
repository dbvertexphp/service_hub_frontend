import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { WebsiteApi } from "Api/WebsiteApi.js";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "Website/components/header";
import Sidebar from "Website/components/sidebar";
import DesktopSidebar from "Website/components/desktopsidebar";
import JobSidebar from "Website/components/Jobsidebar";
import Chatlisthome from "Website/components/chatlisthome";
import Chatlist from "Website/components/chatlist";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import SreachData from "Website/components/sreachdata";
import Category from "Website/components/category";
import HomeVideo from "Website/components/video";
import HomeReels from "Website/components/reel";
import VideoList from "Website/components/video_list";
import TimelineList from "Website/components/timeline_list";
import TimelineComment from "Website/components/timeline_comment";
import VideoComment from "Website/components/video_comment";
import JobsList from "Website/components/job_list";
import MyAppliedJobList from "Website/components/myapplidjob";
import MyJobList from "Website/components/myjobslist";
import UserApplidList from "Website/components/userappliedlist";
import SubscriptionList from "Website/components/subscriptionlist";
import UserList from "Website/components/user_list";
import FriendList from "Website/components/friend_list";
import HireList from "Website/components/hirelist";
import ReelsList from "Website/components/reel_list";
import ReelsFilter from "Website/components/reel_filter";
import Letestjob from "Website/components/letestjobhome";
import MyProfileView from "Website/components/myprofileview";
import UserProfileView from "Website/components/userprofileview";
import EditProfile from "Website/components/edit_profile";
import BankDetails from "Website/components/bankdetails";
import Calendra from "Website/components/calendra";
import Hire from "Website/components/hire";
import Chat from "Website/components/chat";
import WebViewChat from "Website/components/web_view_chat";
import Review from "Website/components/review";
import ContactUs from "Website/components/contactus";
import ChangePassword from "Website/components/changepassword";
import NotificatonList from "Website/components/notificaton_list";
import ChatListHome from "Website/components/chatlist";
import { TimelineHome } from "Website/components/timeline";
import Notification from "Website/notification/Notification";
import AboutUs from "Website/components/website_about_us";
import PrivacyPolicy from "Website/components/website_privacy_policy";
import TermsConditions from "Website/components/website_terms_conditions";
import { useSelector, useDispatch } from "react-redux";
import { set_SidebarIndexNumber } from "Actions/UserActivity";
import PostUplaod from "Website/uplaod_data/post_uplaod";
import VideoUplaod from "Website/uplaod_data/video_uplaod";
import ReelsUplaod from "Website/uplaod_data/reels_uplaod";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { checkCookies, getUserdataCookie } from "cookies";
import LoadingBar from "react-top-loading-bar";
import { setchatlist_data } from "Actions/chatlistAction";
const base_url = process.env.REACT_APP_BASE_URL;
import io from "socket.io-client";
const socket = io(base_url);

const Home = () => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  const ref = useRef();
  const userCookieData = getUserdataCookie("Userdata");

  const isHome = pathname === "/";
  const isVideoList = pathname === "/website-video-list";
  const isTimelineList = pathname === "/website-timeline-list";
  const isTimelineCommentPath = pathname.startsWith("/website-timeline-comment/");
  const isVideoCommentPath = pathname.startsWith("/website-video-comment/");
  const isJobList = pathname === "/website-job-list";
  const isUserProfileView = pathname.startsWith("/Website-user-profile-view/");
  const isUserAppliedList = pathname.startsWith("/website-user-applied-job/");
  const isChatPath = pathname.startsWith("/website-chat/");
  const isChatPathMobile = pathname == "/website-chat-mobile/blank_page_mobile";
  const isHire = pathname.startsWith("/website-hire/");
  const isReview = pathname.startsWith("/website-review/");
  const isMyProfileView = pathname === "/website-my-profile-view";
  const isEditProfile = pathname === "/website-edit-profile";
  const isBankDetails = pathname === "/website-edit-bank-details";
  const isSubscriptionList = pathname === "/website-subscription-list";
  const isUserList = pathname === "/website-user-list";
  const isFriendList = pathname === "/website-friend-list";
  const isHireList = pathname === "/website-hire-list";
  const isMyAppliedJobList = pathname === "/website-my-applied-job-list";
  const isMyJobList = pathname === "/website-my-job-list";
  const isCalendra = pathname === "/website-edit-calendra";
  const isContactUs = pathname === "/website-contact-us";
  const isChangePassword = pathname === "/website-change-password";
  const isNotificatonList = pathname === "/website-notificaton-list";
  const isChatListHome = pathname.startsWith("/website-chat-mobile/");
  const isReelsListPath = pathname.startsWith("/website-reels-list/");
  const isReelsFilterPath = pathname.startsWith("/website-reels-filter-list/");
  const isAboutUs = pathname === "/website-about-us";
  const isPrivacyPolicy = pathname === "/website-privacy-policy";
  const isTermsConditions = pathname === "/website-terms-conditions";
  const isWebViewChat = pathname.startsWith("/website-web-view-chat/");
  const isPostUplaod = pathname === "/website-post-uplaod";
  const isVideoUplaod = pathname === "/website-video-uplaod";
  const isReelsUplaod = pathname === "/website-reels-uplaod";

  const reelsId = isReelsListPath ? pathname.split("/")[2] : null;
  const reelsfilterId = isReelsFilterPath ? pathname.split("/")[2] : null;
  const isBelow500px = useMediaQuery("(max-width:500px)");
  const isBelow992px = useMediaQuery("(max-width:992px)");
  const isUp992px = useMediaQuery("(min-width:992px)");
  const isBelow578px = useMediaQuery("(max-width: 578px)");
  const isBelow1200px = useMediaQuery("(max-width:1200px)");

  useEffect(() => {
    socket.on("offline_room", async (data) => {
      try {
        const chatlist_data = await dispatch(
          setchatlist_data(data.OfflineId, data.userId, data.myId)
        );
      } catch (error) {
        console.error("Error while fetching chatlist data:", error);
      }
    });
    return () => {
      socket.off("offline_room");
    };
  }, []);

  useEffect(() => {
    if (checkCookies()) {
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split("/"); // Path ko '/' ke hisaab se split karein
      const pathWithoutId = pathParts.filter((part) => !part.match(/^[0-9a-fA-F]{24}$/)).join("/");
      if (
        pathWithoutId != "/website-chat" ||
        pathWithoutId != "website-chat-mobile/blank_page_mobile"
      ) {
        userCookieData.ChatStatus = false;
        socket.emit("setup", userCookieData);
      }
    }
    ref.current.complete();

    if (!(isHome || isWebViewChat)) {
      if (!checkCookies()) {
        // const newTab = window.open("/website-login");
        // if (newTab) {
        //   newTab.focus(); // Focusing on the newly opened tab
        // }
        // else {
        //   console.log("Popup blocked. Please allow popups for this website."); // Handling popup blocked scenario
        // }
        window.location.href = "/website-login";
      }
    }
  });

  useEffect(() => {
    let SidebarIndexNumbe = 0; // Define SidebarIndexNumbe variable here

    if (isHome) {
      SidebarIndexNumbe = 1;
    } else if (isVideoList || isVideoCommentPath) {
      SidebarIndexNumbe = 2;
    } else if (isReelsListPath || isReelsFilterPath) {
      SidebarIndexNumbe = 3;
    } else if (isTimelineList || isTimelineCommentPath) {
      SidebarIndexNumbe = 4;
    } else if (isFriendList) {
      SidebarIndexNumbe = 5;
    } else if (isJobList) {
      SidebarIndexNumbe = 6;
    } else if (isMyAppliedJobList) {
      SidebarIndexNumbe = 7;
    } else if (isMyJobList) {
      SidebarIndexNumbe = 8;
    } else if (isMyProfileView) {
      SidebarIndexNumbe = 9;
    } else if (isEditProfile) {
      SidebarIndexNumbe = 10;
    } else if (isSubscriptionList) {
      SidebarIndexNumbe = 11;
    } else if (isCalendra) {
      SidebarIndexNumbe = 12;
    } else if (isPrivacyPolicy) {
      SidebarIndexNumbe = 13;
    } else if (isHireList) {
      SidebarIndexNumbe = 14;
    } else if (isAboutUs) {
      SidebarIndexNumbe = 15;
    } else if (isContactUs) {
      SidebarIndexNumbe = 16;
    } else if (isTermsConditions) {
      SidebarIndexNumbe = 17;
    } else if (isChatPath || isChatPathMobile) {
      SidebarIndexNumbe = 18;
    } else if (isChatPath) {
      SidebarIndexNumbe = 0;
    }

    dispatch(set_SidebarIndexNumber(SidebarIndexNumbe)); // Dispatch the updated SidebarIndexNumbe value
  }, [
    isVideoList,
    isVideoCommentPath,
    isHome,
    isChatPath,
    isReelsListPath,
    isReelsFilterPath,
    isTimelineList,
    isTimelineCommentPath,
    isVideoCommentPath,
    isFriendList,
    isJobList,
    isMyAppliedJobList,
    isMyJobList,
    isMyProfileView,
    isEditProfile,
    isSubscriptionList,
    isCalendra,
    isPrivacyPolicy,
    isHireList,
    isAboutUs,
    isContactUs,
    dispatch,
  ]);

  const userId = isUserProfileView ? pathname.split("/")[2] : null;

  let marginTopReels = ""; // Default marginTop

  if ((isReelsListPath || isReelsFilterPath || isWebViewChat) && isBelow500px) {
    marginTopReels = "0px";
  } else if (isWebViewChat && !isBelow500px) {
    marginTopReels = "60px";
  } else if (isBelow992px) {
    marginTopReels = "70px";
  } else if (isUp992px) {
    marginTopReels = "77px";
  }

  return (
    <>
      {((isReelsListPath || isReelsFilterPath) && isBelow500px) || isWebViewChat ? null : (
        <Header />
      )}
      <LoadingBar color="#f11946" ref={ref} shadow={true} height={3} />
      {checkCookies() && <Notification />}

      <span
        className={`${
          (isReelsListPath || isReelsFilterPath) && isBelow500px ? "main_continer_home" : ""
        }`}
        style={{
          paddingRight: isWebViewChat ? "0px" : "0px",
          paddingRight: isBelow578px ? "16px" : "0px",
        }}
      >
        <Grid
          container
          className={`Mobile_dashbord ${
            (isReelsListPath || isReelsFilterPath) && isBelow500px ? "reels-list-container" : ""
          }`}
          justifyContent="center"
          spacing={isReelsListPath || isReelsFilterPath ? 0 : 0}
          sx={{
            marginTop: isReelsListPath || isReelsFilterPath ? "0px" : "0px",
            paddingTop: isReelsListPath || isReelsFilterPath ? "0px" : "0px",
          }}
        >
          {!isAboutUs && !isPrivacyPolicy && !isTermsConditions && !isWebViewChat && (
            <Grid
              item
              xs={2}
              sx={{
                display: { xs: "none", xl: "block" },
                marginTop: isWebViewChat ? "35px" : "77px",
                paddingLeft: "32px",
              }}
              className={`main-content ${
                isReelsListPath || isReelsFilterPath ? "reels-list-container" : ""
              }`}
            >
              <DesktopSidebar />
            </Grid>
          )}
          {!isBelow1200px && (
            <Grid
              item
              xs={
                isReelsListPath || isReelsFilterPath || isMyProfileView || isUserProfileView
                  ? 6
                  : isAboutUs || isPrivacyPolicy || isTermsConditions || isWebViewChat
                  ? 12
                  : 6
              }
              sx={{
                display: { xs: "none", xl: "block" },
                overflowY: "scroll",
                overflowX: "hidden",
                paddingLeft: "80px",
                paddingRight: "40px",
              }}
              marginTop={isWebViewChat ? "35px" : "77px"}
            >
              <React.Fragment>
                {!isTimelineCommentPath &&
                  !isMyProfileView &&
                  !isEditProfile &&
                  !isUserProfileView &&
                  !isBankDetails &&
                  !isCalendra &&
                  !isHire &&
                  !isSubscriptionList &&
                  !isUserList &&
                  !isHireList &&
                  !isVideoCommentPath &&
                  !isReview &&
                  !isChatPath &&
                  !isContactUs &&
                  !isChangePassword &&
                  !isNotificatonList &&
                  !isChatListHome &&
                  !isFriendList &&
                  !isAboutUs &&
                  !isPrivacyPolicy &&
                  !isTermsConditions &&
                  !isWebViewChat &&
                  !isReelsListPath &&
                  !isReelsFilterPath &&
                  !isPostUplaod &&
                  !isVideoUplaod &&
                  !isReelsUplaod && (
                    <div>
                      <SreachData />
                      <Category />
                    </div>
                  )}
                {(isReelsListPath || isReelsFilterPath) && <SreachData />}

                {pathname === "/website-video-list" && <VideoList />}
                {isReelsListPath && <ReelsList reelsId={reelsId} />}
                {isReelsFilterPath && <ReelsFilter reelsId={reelsfilterId} />}
                {pathname === "/website-timeline-list" && <TimelineList />}
                {isTimelineCommentPath && <TimelineComment />}
                {isVideoCommentPath && <VideoComment />}
                {pathname === "/website-job-list" && <JobsList />}
                {isMyProfileView && <MyProfileView />}
                {pathname === "/website-edit-profile" && <EditProfile />}
                {pathname === "/website-my-job-list" && <MyJobList />}
                {isBankDetails && <BankDetails />}
                {isUserProfileView && <UserProfileView user_id={userId} />}
                {isMyAppliedJobList && <MyAppliedJobList />}
                {isUserAppliedList && <UserApplidList />}
                {isCalendra && <Calendra />}
                {isHire && <Hire />}
                {isChatPath && <Chat />}
                {isHireList && <HireList />}
                {isSubscriptionList && <SubscriptionList />}
                {isUserList && <UserList />}
                {isReview && <Review />}
                {isContactUs && <ContactUs />}
                {isChangePassword && <ChangePassword />}
                {isNotificatonList && <NotificatonList />}
                {isChatListHome && <ChatListHome />}
                {isFriendList && <FriendList />}
                {isAboutUs && <AboutUs />}
                {isPrivacyPolicy && <PrivacyPolicy />}
                {isTermsConditions && <TermsConditions />}
                {isWebViewChat && <WebViewChat />}
                {isPostUplaod && <PostUplaod />}
                {isVideoUplaod && <VideoUplaod />}
                {isReelsUplaod && <ReelsUplaod />}
                {pathname === "/" && (
                  <>
                    <HomeVideo />
                    <HomeReels />
                    <Letestjob />
                    <TimelineHome />
                  </>
                )}
              </React.Fragment>
            </Grid>
          )}
          {!isAboutUs && !isPrivacyPolicy && !isTermsConditions && !isWebViewChat && (
            <Grid
              item
              xs={2}
              sx={{
                display: { xs: "none", xl: "block" },
                marginTop: isWebViewChat ? "35px" : "77px",
                paddingLeft: "32px",
              }}
            >
              <div className="latest_jab_div_Fixed">
                {isChatPath && <Chatlist />}
                {!isChatPath && <JobSidebar />}
                <br />
                {!isChatPath && <Chatlisthome />}
              </div>
            </Grid>
          )}
          {isBelow1200px && (
            <Grid
              container
              item
              xs={12}
              sx={{ display: { xs: "block", xl: "none" }, marginTop: marginTopReels }}
              className={isWebViewChat ? "isWebViewChatClassName" : "isWebViewChatClassNameNot"}
            >
              <React.Fragment>
                {!isTimelineCommentPath &&
                  !isMyProfileView &&
                  !isEditProfile &&
                  !isUserProfileView &&
                  !isBankDetails &&
                  !isCalendra &&
                  !isHire &&
                  !isSubscriptionList &&
                  !isUserList &&
                  !isHireList &&
                  !isVideoCommentPath &&
                  !isReview &&
                  !isChatPath &&
                  !isContactUs &&
                  !isChangePassword &&
                  !isNotificatonList &&
                  !isChatListHome &&
                  !isFriendList &&
                  !isAboutUs &&
                  !isPrivacyPolicy &&
                  !isTermsConditions &&
                  !isWebViewChat &&
                  !isReelsListPath &&
                  !isReelsFilterPath &&
                  !isPostUplaod &&
                  !isVideoUplaod &&
                  !isReelsUplaod && (
                    <>
                      <SreachData />
                      <Category />
                    </>
                  )}
                {pathname === "/website-video-list" && <VideoList />}
                {isReelsListPath && <ReelsList reelsId={reelsId} />}
                {isReelsFilterPath && <ReelsFilter reelsId={reelsfilterId} />}
                {pathname === "/website-timeline-list" && <TimelineList />}
                {isTimelineCommentPath && <TimelineComment />}
                {isVideoCommentPath && <VideoComment />}
                {pathname === "/website-job-list" && <JobsList />}
                {isMyProfileView && <MyProfileView />}
                {isBankDetails && <BankDetails />}
                {pathname === "/website-my-job-list" && <MyJobList />}
                {pathname === "/website-edit-profile" && <EditProfile />}
                {isUserProfileView && <UserProfileView user_id={userId} />}
                {isMyAppliedJobList && <MyAppliedJobList />}
                {pathname === "/website-user-applied-job/:job_id" && <UserApplidList />}
                {isCalendra && <Calendra />}
                {isHire && <Hire />}
                {isHireList && <HireList />}
                {isSubscriptionList && <SubscriptionList />}
                {isUserList && <UserList />}
                {isReview && <Review />}
                {isContactUs && <ContactUs />}
                {isChatPath && <Chat />}
                {isChangePassword && <ChangePassword />}
                {isNotificatonList && <NotificatonList />}
                {isChatListHome && <ChatListHome />}
                {isFriendList && <FriendList />}
                {isAboutUs && <AboutUs />}
                {isPrivacyPolicy && <PrivacyPolicy />}
                {isTermsConditions && <TermsConditions />}
                {isWebViewChat && <WebViewChat />}
                {isPostUplaod && <PostUplaod />}
                {isVideoUplaod && <VideoUplaod />}
                {isReelsUplaod && <ReelsUplaod />}
                {pathname === "/" && (
                  <>
                    <HomeVideo />
                    <HomeReels />
                    <Letestjob />
                    <TimelineHome />
                  </>
                )}
              </React.Fragment>
            </Grid>
          )}
        </Grid>
      </span>
    </>
  );
};

export default Home;
