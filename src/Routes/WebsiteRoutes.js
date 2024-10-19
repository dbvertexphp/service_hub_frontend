// <<<<<<< HEAD
import Home from "Website/page/home";
import LoginPage from "../Website/page/LoginPage";
import OtpVerfiy from "../Website/page/OtpVerfiy";
import ForgetPassword from "../Website/page/ForgetPassword";
import ForgetPasswordOtpVerfiy from "../Website/page/ForgetPasswordOtpVerfiy";
import SingupPage from "../Website/page/SingupPage";
import VideoList from "../Website/components/video_list";
import TimelineList from "../Website/components/timeline_list";
import TimelineComment from "../Website/components/timeline_comment";
import VideoComment from "../Website/components/video_comment";
import MyProfileView from "../Website/components/myprofileview";
import UserProfileView from "../Website/components/userprofileview";
import EditProfile from "../Website/components/edit_profile";
import BankDetails from "../Website/components/bankdetails";
import Calendra from "../Website/components/calendra";
import ReelsList from "../Website/components/reel_list";
import ReelsFillter from "../Website/components/reel_filter";
import JobsList from "../Website/components/job_list";
import UserApplidList from "../Website/components/userappliedlist";
import SubscriptionList from "../Website/components/subscriptionlist";
import UserList from "../Website/components/user_list";
import FriendList from "../Website/components/friend_list";
import Chat from "../Website/components/chat";
import ChatListHome from "../Website/components/chatlist";
import WebViewChat from "../Website/components/web_view_chat";
import HireList from "../Website/components/hirelist";
import Hire from "../Website/components/hire";
import MyAppliedJobList from "../Website/components/myapplidjob";
import MyJobList from "../Website/components/myjobslist";
import Review from "../Website/components/review";
import ContactUs from "../Website/components/contactus";
import ChangePassword from "../Website/components/changepassword";
import NotificatonList from "../Website/components/notificaton_list";
import Cookies from "js-cookie";
import Icon from "@mui/material/Icon";
import AboutUs from "../Website/components/website_about_us";
import PrivacyPolicy from "../Website/components/website_privacy_policy";
import TermsConditions from "../Website/components/website_terms_conditions";
import PostUplaod from "../Website/uplaod_data/post_uplaod";
import VideoUplaod from "../Website/uplaod_data/video_uplaod";
import ReelsUplaod from "../Website/uplaod_data/reels_uplaod";

////---------- Admin Files ----------///
import Dashboard from "Admin/layouts/dashboard";
import Tables from "Admin/layouts/tables";
import Supplier_Tables from "Admin/layouts/supplier_tables";
import Teacher_Course_Details from "Admin/layouts/teacher_course_details";
import SubCategoryList from "Admin/layouts/subCategoryList";
import Category_tables from "Admin/layouts/category_tables";
import OrderList from "Admin/layouts/order_list";
import Post_tables from "Admin/layouts/post_tables";
import Reels_tables from "Admin/layouts/reel_tables";
import Job_tables from "Admin/layouts/job_tables";
import Contact_tables from "Admin/layouts/contact_tables";
import Service_tables from "Admin/layouts/service_list";
import Banner_tables from "Admin/layouts/banner_list";
import Tools_tables from "Admin/layouts/tools_list";
import Update_Payments from "Admin/layouts/update_payments";
import Hire_tables from "Admin/layouts/hire_tables";
import Report_tables from "Admin/layouts/report_tables";
import Profile from "Admin/layouts/profile";
import Addcategory from "Admin/layouts/addcategory";
import AddBannerImage from "Admin/layouts/addBannerImage";
import AddService from "Admin/layouts/addService";
import AddTools from "Admin/layouts/addTools";
import Addprivacypolicy from "Admin/layouts/addPrvicayPolicy";
import Addaboutus from "Admin/layouts/addAboutUs";
import Addtermsconditions from "Admin/layouts/addTC";
import SignIn from "Admin/layouts/authentication/sign-in";
import Transaction_tables from "Admin/layouts/transaction_tables";
import User_Transaction_tables from "Admin/layouts/user_transaction_tables";
import Notification_tables from "Admin/layouts/components/notification";
import View_Count_tables from "Admin/layouts/components/view_count";
import TeacherPayStatus from "Admin/layouts/teacherPayStatus";
import OrderProductList from "Admin/layouts/order_product_list";

// import TestTable from "Admin/layouts/testTable";

import { MdLeaderboard } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { MdPerson } from "react-icons/md";
import Addsubcategory from "Admin/layouts/addsubcategory";

// Check if the user is authenticated by checking the presence of the token in cookies

const isAuthenticated = !!Cookies.get("Websitetoken");

const routes = [
  {
    type: "Home",
    name: "Home In",
    key: "home-in",
    route: "/",
    component: <Home />,
  },
  {
    type: "AuthRoutes",
    name: "Website Login",
    key: "website-login",
    route: "/website-login",
    component: <LoginPage />,
  },
  {
    type: "AuthRoutes",
    name: "Website Singup",
    key: "website-singup",
    route: "/website-singup",
    component: <SingupPage />,
  },
  {
    type: "AuthRoutes",
    name: "Website Otp Verfiy",
    key: "website-otp-verfiy",
    route: "/website-otp-verfiy",
    component: <OtpVerfiy />,
  },
  {
    type: "AuthRoutes",
    name: "Website Forget Password",
    key: "website-forget-password",
    route: "/website-forget-password",
    component: <ForgetPassword />,
  },
  {
    type: "AuthRoutes",
    name: "Website Forget Password Otp Verfiy",
    key: "website-forget-password-otp-verfiy",
    route: "/website-forget-password-otp-verfiy",
    component: <ForgetPasswordOtpVerfiy />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Video List",
    key: "website-video-list",
    route: "/website-video-list",
    component: <VideoList />,
  },

  {
    type: "WebsiteRoutes",
    name: "Website Video Comment",
    key: "website-video-comment",
    route: "/website-video-comment/:videoId",
    element: () => <VideoComment />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Reels List",
    key: "website-reels-list",
    route: "/website-reels-list/:share_Id",
    element: () => <ReelsList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Reels Filter List",
    key: "website-reels-filter-list",
    route: "/website-reels-filter-list/:share_Id",
    element: () => <ReelsFillter />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Timeline List",
    key: "website-timeline-list",
    route: "/website-timeline-list",
    component: <TimelineList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Timeline Comment",
    key: "website-timeline-comment",
    route: "/website-timeline-comment/:timelineId",
    element: () => <TimelineComment />,
  },

  {
    type: "WebsiteRoutes",
    name: "Website Job List",
    key: "website-job-list",
    route: "/website-job-list",
    component: <JobsList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website My Applied Job List",
    key: "website-my-applied-job-list",
    route: "/website-my-applied-job-list",
    component: <MyAppliedJobList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website My Job List",
    key: "website-my-job-list",
    route: "/website-my-job-list",
    component: <MyJobList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website User Applied Job",
    key: "website-user-applied-job",
    route: "/website-user-applied-job/:job_id",
    element: () => <UserApplidList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website My Profile view",
    key: "website-my-profile-view",
    route: "/website-my-profile-view",
    component: <MyProfileView />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Edit Profile",
    key: "website-edit-profile",
    route: "/website-edit-profile",
    component: <EditProfile />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Edit Bank Details",
    key: "website-edit-bank-details",
    route: "/website-edit-bank-details",
    component: <BankDetails />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website User profile view",
    key: "Website-user-profile-view",
    route: "/Website-user-profile-view/:user_id",
    element: () => <UserProfileView />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Calendra",
    key: "website-edit-calendra",
    route: "/website-edit-calendra",
    component: <Calendra />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Hire List",
    key: "website-hire-list",
    route: "/website-hire-list",
    component: <HireList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Hire",
    key: "website-hire",
    route: "/website-hire/:hireId",
    element: () => <Hire />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Subscription List",
    key: "website-subscription-list",
    route: "/website-subscription-list",
    component: <SubscriptionList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website User List",
    key: "website-user-list",
    route: "/website-user-list",
    component: <UserList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Friend List",
    key: "website-friend-list",
    route: "/website-friend-list",
    component: <FriendList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Review",
    key: "website-review",
    route: "/website-review/:review_id",
    element: () => <Review />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Contact Us",
    key: "website-contact-us",
    route: "/website-contact-us",
    element: () => <ContactUs />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Change Password",
    key: "website-change-password",
    route: "/website-change-password",
    element: () => <ChangePassword />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Notificaton List",
    key: "website-change-password",
    route: "/website-notificaton-list",
    element: () => <NotificatonList />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Chat",
    key: "website-chat",
    route: "/website-chat/:chat_id",
    element: () => <Chat />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Chat Mobile",
    key: "website-chat-mobile",
    route: "/website-chat-mobile/:chat_id",
    element: () => <ChatListHome />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Web View Chat",
    key: "website-web-view-chat",
    route: "/website-web-view-chat/:chat_id/:token",
    element: () => <WebViewChat />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website About Us",
    key: "website-about-us",
    route: "/website-about-us",
    element: () => <AboutUs />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Privacy Policy",
    key: "website-privacy-policy",
    route: "/website-privacy-policy",
    element: () => <PrivacyPolicy />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Terms Conditions",
    key: "website-terms-conditions",
    route: "/website-terms-conditions",
    element: () => <TermsConditions />,
  },

  // Upalode Routes
  {
    type: "WebsiteRoutes",
    name: "Website Post Uplaod",
    key: "website-post-uplaod",
    route: "/website-post-uplaod",
    element: () => <PostUplaod />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Video Uplaod",
    key: "website-video-uplaod",
    route: "/website-video-uplaod",
    element: () => <VideoUplaod />,
  },
  {
    type: "WebsiteRoutes",
    name: "Website Reels Uplaod",
    key: "website-reels-uplaod",
    route: "/website-reels-uplaod",
    element: () => <ReelsUplaod />,
  },

  // Admin Routes

  {
    type: "collapse",
    name: "Sign in",
    key: "sign-in",
    icon: <MdPerson />,
    route: "/admin",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <MdPerson />,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "User List",
    key: "tables",
    icon: <MdPerson />,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Supplier List",
    key: "supplier-tables",
    icon: <Icon fontSize="small">User</Icon>,
    route: "/supplier-tables",
    component: <Supplier_Tables />,
  },
  {
    type: "collapse",
    name: "User List",
    key: "teacher-course-details",
    icon: <Icon fontSize="small">User</Icon>,
    route: "/teacher-course-details/:teacher_id",
    component: <Teacher_Course_Details />,
  },

  {
    type: "collapse",
    name: "SubCategoryList",
    key: "sub-category-list",
    icon: <Icon fontSize="small">User</Icon>,
    route: "/sub-category-list/:category_id",
    component: <SubCategoryList />,
  },

  {
    type: "collapse",
    name: "Add Category",
    key: "add-category",
    icon: <FiPlus />,
    route: "/add-category",
    component: <Addcategory />,
  },
  {
    type: "collapse",
    name: "Add Sub Category",
    key: "add-sub-category",
    icon: <FiPlus />,
    route: "/add-sub-category",
    component: <Addsubcategory />,
  },
  {
    type: "collapse",
    name: "Category List",
    key: "category-list",
    icon: <MdLeaderboard />,
    route: "/category-list",
    component: <Category_tables />,
  },
  {
    type: "collapse",
    name: "Add Service",
    key: "add-service",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/add-service",
    component: <AddService />,
  },
  {
    type: "collapse",
    name: "Add Banner Image",
    key: "add-banner-image",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/add-banner-image",
    component: <AddBannerImage />,
  },
  {
    type: "collapse",
    name: "Add Tools",
    key: "add-tools",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/add-tools",
    component: <AddTools />,
  },

  {
    type: "collapse",
    name: "Post Timeline List",
    key: "post-list",
    icon: <MdLeaderboard />,
    route: "/post-list",
    component: <Post_tables />,
  },
  {
    type: "collapse",
    name: "Booking List",
    key: "booking-list",
    icon: <MdLeaderboard />,
    route: "/booking-list",
    component: <Transaction_tables />,
  },
  {
    type: "collapse",
    name: "User Transaction List",
    key: "user-transaction-list",
    icon: <MdLeaderboard />,
    route: "/user-transaction-list/:user_id",
    component: <User_Transaction_tables />,
  },
  {
    type: "collapse",
    name: "Notification List",
    key: "notification-list",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/Notification-list",
    component: <Notification_tables />,
  },
  {
    type: "collapse",
    name: "View Count List",
    key: "view-Count-list",
    icon: <MdLeaderboard />,
    route: "/view-count-list/:VideoId/:Type",
    component: <View_Count_tables />,
  },
  {
    type: "collapse",
    name: "Reels List",
    key: "reels-list",
    icon: <MdLeaderboard />,
    route: "/reels-list",
    component: <Reels_tables />,
  },
  {
    type: "collapse",
    name: "Job List",
    key: "job-list",
    icon: <MdLeaderboard />,
    route: "/job-list",
    component: <Job_tables />,
  },
  {
    type: "collapse",
    name: "Contact us List",
    key: "contact-list",
    icon: <MdLeaderboard />,
    route: "/contact-list",
    component: <Contact_tables />,
  },
  {
    type: "collapse",
    name: "Service List",
    key: "service-list",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/service-list",
    component: <Service_tables />,
  },
  {
    type: "collapse",
    name: "Banner List",
    key: "banner-list",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/banner-list",
    component: <Banner_tables />,
  },
  {
    type: "collapse",
    name: "Tools List",
    key: "tools-list",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/tools-list",
    component: <Tools_tables />,
  },
  {
    type: "collapse",
    name: "Order List",
    key: "order-list",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/order-list",
    component: <OrderList />,
  },
  {
    type: "collapse",
    name: "Order Product List",
    key: "order-product-list",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/order-product-list/:order_id",
    component: <OrderProductList />,
  },
  {
    type: "collapse",
    name: "Report List",
    key: "report-list",
    icon: <MdLeaderboard />,
    route: "/report-list",
    component: <Report_tables />,
  },
  {
    type: "collapse",
    name: "Hire List",
    key: "hire-list",
    icon: <MdLeaderboard />,
    route: "/hire-list",
    component: <Hire_tables />,
  },
  {
    type: "collapse",
    name: "Add Privacy Policy",
    key: "add-privacy-policy",
    icon: <FiPlus />,
    route: "/add-privacy-policy",
    component: <Addprivacypolicy />,
  },
  {
    type: "collapse",
    name: "Add About Us",
    key: "add-about-us",
    icon: <FiPlus />,
    route: "/add-about-us",
    component: <Addaboutus />,
  },
  {
    type: "collapse",
    name: "TeacherPayStatus",
    key: "teacher-pay-status",
    icon: <Icon fontSize="small">add</Icon>,
    route: "/teacher-pay-status/:teacher_id",
    component: <TeacherPayStatus />,
  },
  {
    type: "collapse",
    name: "Add Terms Conditions",
    key: "add-terms-conditions",
    icon: <FiPlus />,
    route: "/add-terms-conditions",
    component: <Addtermsconditions />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <MdPerson />,
    route: "/profile",
    component: <Profile />,
  },
];

export default routes;
