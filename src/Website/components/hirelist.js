import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Cookies from "js-cookie";
import { WebsiteApi } from "Api/WebsiteApi";
import Backbutton from "./Backbutton.js";
import Chat_icon from "../../assets/website_img/chat_icon.svg";
import Hooray from "../../assets/website_img/Hoorry.svg";
import Job_model from "../model_components/permission_model";
import MuiAlert from "@mui/material/Alert";
import { setProfileUrl } from "Actions/UserProfileActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserdataCookie, checkCookies } from "cookies.js";
import { setChatId } from "../../Actions/ChatActions.js";

export default function SubscriptionList() {
  const [open, setOpen] = React.useState(false);
  const [Succesopen, setSuccesOpen] = React.useState(false);
  const [showJob_model, setJob_model] = useState(false);
  const [Hired_id, setHired_id] = useState(null);
  const [work_status, setWork_Status] = useState("");
  const [actionType, setActionType] = useState("");
  const [subscriberlist, setsubscribersList] = useState([]);
  const subscriberBoxRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState("Hired");
  const [unsubscriberbutton, setUnSubscriberButton] = useState(true);
  const [totalamount, setTotalAmount] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [review_user_id, setReview_User_id] = useState("");
  const getWebsiteToken = Cookies.get("Websitetoken");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userCookieData = getUserdataCookie("Userdata");

  useEffect(() => {
    getHireList();
  }, []);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseSucces = () => {
    setSuccesOpen(false);
  };

  const handleChangeFillter = (event) => {
    setSelectedFilter(event.target.value);
    setsubscribersList([]); // Reset the list before fetching new data

    if (event.target.value === "Hired") {
      setUnSubscriberButton(true);
      getHireList();
    } else if (event.target.value === "My_Work") {
      setUnSubscriberButton(false);
      fetchgetHireByMe();
    }
  };

  const getHireList = async () => {
    try {
      const response = await WebsiteApi.getHireList();

      if (response && response.Status && Array.isArray(response.hire_list)) {
        const subscribersList = response.hire_list;
        setTotalAmount(response.total_amount);
        setsubscribersList(subscribersList);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchgetHireByMe = async () => {
    try {
      const response = await WebsiteApi.getHireByMe();

      if (response && response.Status && Array.isArray(response.hire_list)) {
        setTotalAmount(response.total_amount);
        const subscribersList = response.hire_list;
        setsubscribersList(subscribersList);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleJob = (Hired_id, status, name, hire_user_data) => {
    if (getWebsiteToken) {
      setReview_User_id(`/website-review/${hire_user_data}?subscriberId=${Hired_id}`);
      setActionType("Complete Work");
      setJob_model(true);
      setHired_id(Hired_id);
      setWork_Status(status);
      setFirst_name(name);
    }
  };
  const handleJobResponse = (response) => {
    updateHireStatus(Hired_id, response, work_status);
    setJob_model(false);
  };

  const updateHireStatus = async (_id, response, work_status) => {
    if (response === "Complete Work") {
      try {
        const response = await WebsiteApi.updateHireStatus(_id, work_status);

        if (response && response.status) {
          // Update the state with the new status
          const updatedSubscribers = subscriberlist.map((subscriber) =>
            subscriber._id === _id
              ? {
                  ...subscriber,
                  work_status: { ...subscriber.work_status, status_code: work_status },
                }
              : subscriber
          );

          setsubscribersList(updatedSubscribers);
          setSuccesOpen(true);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
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

  const CheckAuth = async (event, userId) => {
    if (checkCookies()) {
      if (event === "Chat") {
        const chatId = await dispatch(setChatId(userId));
        navigate(`/website-chat/${chatId}`);
      }
    }
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25) !important;",
    borderRadius: "50px",
    border: "1px solid #f3f3f3",
    padding: theme.spacing(1),
    marginBottom: "20px",
    marginTop: "20px",
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  return (
    <div>
      <Card className="Fix_height_without_sreachbar">
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
          <Typography className="Edit_Subscription_heading">Hire</Typography>
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
                  value="Hired"
                  onClick={handleChangeFillter}
                  className={`Calendra_fillter_button_${
                    selectedFilter === "Hired" ? "select" : "unselect"
                  }`}
                >
                  Hired
                </Button>
                <Button
                  value="My_Work"
                  onClick={handleChangeFillter}
                  className={`Calendra_fillter_button_${
                    selectedFilter === "My_Work" ? "select" : "unselect"
                  }`}
                >
                  My Work
                </Button>
              </div>
            </Grid>
          </Grid>
        </Stack>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={10} className="">
            <Box sx={{ paddingBottom: "10px", paddingTop: "30px", maxHeight: "auto" }}>
              <Box
                sx={{
                  paddingBottom: "10px",
                  minHeight: "auto",
                  overflow: "auto",
                }}
                ref={subscriberBoxRef}
              >
                {subscriberlist.length === 0 ? (
                  <Box sx={{ textAlign: "center", paddingTop: "10%" }}>
                    <Typography variant="body1" className="applied_user_name_title">
                      No Hire List
                    </Typography>
                  </Box>
                ) : (
                  <div>
                    {unsubscriberbutton ? (
                      <div>
                        <Typography className="Total_Amount">
                          Total Paid Amount - Rs.{totalamount}
                        </Typography>
                      </div>
                    ) : (
                      <div>
                        <Typography className="Total_Amount">
                          Total Get Amount - Rs.{totalamount}
                        </Typography>
                      </div>
                    )}
                    {subscriberlist.map((subscriber) => (
                      <div key={subscriber.hire_user_data._id} className="list_box">
                        <CardHeader
                          avatar={
                            <div
                              // onClick={() => {
                              //   ProfileUrl(subscriber.hire_user_data._id);
                              // }}
                              style={{ cursor: "pointer" }}
                            >
                              <Link
                                to={
                                  userCookieData._id === subscriber.hire_user_data._id
                                    ? `/website-my-profile-view`
                                    : `/Website-user-profile-view/${subscriber.hire_user_data._id}`
                                }
                              >
                                <Avatar
                                  sx={{
                                    bgcolor:
                                      subscriber.hire_user_data.pic &&
                                      subscriber.hire_user_data.pic.includes("defult_pic.jpg")
                                        ? deepOrange[500]
                                        : undefined,
                                    width: 40,
                                    height: 40,
                                  }}
                                  aria-label="recipe"
                                >
                                  {subscriber.hire_user_data.pic &&
                                  !subscriber.hire_user_data.pic.includes("defult_pic.jpg") ? (
                                    <img
                                      alt={`Avatar for ${subscriber.hire_user_data.first_name}`}
                                      src={subscriber.hire_user_data.pic}
                                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                                    />
                                  ) : (
                                    `${subscriber.hire_user_data.first_name.charAt(
                                      0
                                    )}${subscriber.hire_user_data.last_name.charAt(0)}`
                                  )}
                                </Avatar>
                              </Link>
                            </div>
                          }
                          sx={{ paddingBottom: "0px" }}
                          title={
                            <div style={{ cursor: "pointer" }}>
                              <Link
                                to={
                                  userCookieData._id === subscriber.hire_user_data._id
                                    ? `/website-my-profile-view`
                                    : `/Website-user-profile-view/${subscriber.hire_user_data._id}`
                                }
                              >
                                <Typography variant="h3" className="applied_user_name_title">
                                  {`${subscriber.hire_user_data.first_name} ${subscriber.hire_user_data.last_name}`}
                                </Typography>
                              </Link>
                            </div>
                          }
                          subheader={
                            <div>
                              <Typography className="payment_message_hire">
                                Paid to admin {subscriber.amount}/-
                              </Typography>
                              {subscriber.work_status.status_code !== "1" && (
                                <Typography className="payment_message_hire_complete">
                                  Completed
                                </Typography>
                              )}
                            </div>
                          }
                          action={
                            unsubscriberbutton ? (
                              <div>
                                <Typography className="Hire_date">
                                  Date - {subscriber.datetime}
                                </Typography>
                                <img
                                  src={Chat_icon}
                                  alt="page"
                                  style={{ marginTop: "26px", cursor: "pointer" }}
                                  onClick={() => {
                                    CheckAuth("Chat", subscriber.hire_user_data._id);
                                  }}
                                />
                                {subscriber.work_status.status_code === "2" ? (
                                  <Link
                                    to={`/website-review/${subscriber.hire_user_data._id}?subscriberId=${subscriber._id}`}
                                  >
                                    <Button
                                      variant="contained"
                                      sx={{ marginLeft: "auto", marginTop: "16px" }}
                                      className="Hired_fillter_button_select rounded-pill"
                                    >
                                      Review
                                    </Button>
                                  </Link>
                                ) : subscriber.work_status.status_code === "3" ? (
                                  <Button className="Reviewed_button" disabled>
                                    Reviewed
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    sx={{ marginLeft: "auto", marginTop: "16px" }}
                                    className="Hired_fillter_button_select rounded-pill"
                                    onClick={() =>
                                      handleJob(
                                        subscriber._id,
                                        "2",
                                        subscriber.hire_user_data.first_name,
                                        subscriber.hire_user_data._id
                                      )
                                    }
                                  >
                                    Complete
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <div>
                                <Typography className="Hire_date">
                                  Date - {subscriber.datetime}
                                </Typography>
                                <div style={{ textAlign: "right" }}>
                                  <img
                                    src={Chat_icon}
                                    alt="page"
                                    style={{ marginTop: "10px", cursor: "pointer" }}
                                    onClick={() => {
                                      CheckAuth("Chat", subscriber.hire_user_data._id);
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Dialog
          open={Succesopen}
          onClose={handleCloseSucces}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="Admin_payment_model_card"
        >
          <DialogTitle id="alert-dialog-title" className="Admin_payment_model">
            Hooray
          </DialogTitle>

          <DialogContent sx={{ paddingLeft: "50px", paddingRight: "50px" }}>
            <div style={{ textAlign: "center" }}>
              <img src={Hooray} alt="page" />
            </div>

            <DialogContentText
              id="alert-dialog-description"
              className="Admin_payment_model_content"
            >
              Job Completed Successfully.
              <br />
              Now you can give a review and rating to the Freelancer.
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ alignSelf: "center" }}>
            <div>
              <Link to={review_user_id}>
                <Button onClick={handleCloseSucces} className="admin_payment_model_button">
                  Review
                </Button>
              </Link>
              <Button
                onClick={handleCloseSucces}
                autoFocus
                className="admin_payment_model_button_ok"
              >
                Ok
              </Button>
            </div>
          </DialogActions>
        </Dialog>

        {showJob_model && (
          <Job_model
            onClose={() => setJob_model(false)}
            onSubscribe={handleJobResponse}
            message={"Do you want to complete the work?"}
            heading={"Complete Work"}
            ButtonText={actionType}
            ButtonValue={actionType}
          />
        )}
      </Card>
    </div>
  );
}
