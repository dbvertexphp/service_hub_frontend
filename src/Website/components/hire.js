import React, { useState, useEffect } from "react";
import { WebsiteApi } from "Api/WebsiteApi";
import { Typography, Card, TextField, Stack, Grid, Button, OutlinedInput } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Hooray from "../../assets/website_img/Hoorry.svg";
import Select from "@mui/material/Select";
import { useParams, Link } from "react-router-dom";
import Backbutton from "./Backbutton.js";
import checkoutHandler from "../payment/payment";
import { getUserdataCookie } from "cookies.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const HireFind = () => {
  const [open, setOpen] = React.useState(false);
  const [buttonprice, setButtonPrice] = useState("");
  const [buttonpriceonly, setButtonPriceOnly] = useState("");
  const [calendarid, setCalendarId] = useState("");
  const [buttonadmin, setButtonAdmin] = useState(true);
  const [spicaldaytype, setSpicaldayType] = useState("");
  const [spicaldaydate, setSpicaldayDate] = useState("");
  const [spicaldaytypeerr, setSpicaldayTypeerr] = useState("");
  const [spicaldaydateerr, setSpicaldayDateerr] = useState("");
  const { hireId } = useParams();
  const userCookieData = getUserdataCookie("Userdata");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [spicaldaydateChange, setSpicaldayDateChange] = useState(new Date());

  useEffect(() => {
    const dateObject = new Date(spicaldaydateChange);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const monthIndex = dateObject.getMonth();
    const monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const month = monthNames[monthIndex];
    const year = dateObject.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;
    setSpicaldayDate(formattedDate); // Output: 03/09/2024
  }, [spicaldaydateChange]);

  const FindPriceByDateTime = async (spicaldaydate, spicaldaytype, hireId) => {
    try {
      const response = await WebsiteApi.FindPriceByDateTime(spicaldaydate, spicaldaytype, hireId);

      if (response && response.status !== undefined) {
        if (response.status === true) {
          setButtonAdmin(true);
          setButtonPrice(`Amount Pay :- ${response.data.price}`);
          setButtonPriceOnly(response.data.price);
          setCalendarId(response.data._id);
        } else {
          setButtonAdmin(false);
          setButtonPrice("Not Available");
        }
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeDate = (e) => {
    setSpicaldayDate(e.target.value);
  };

  const handleChangeTime = (event) => {
    setSpicaldayType(event.target.value);
  };

  const onSubmitFind = async (e) => {
    e.preventDefault();
    setSpicaldayTypeerr("");
    setSpicaldayDateerr("");

    let validate = true;

    if (!spicaldaytype) {
      validate = false;
      setSpicaldayTypeerr("Please select time.");
    }
    if (!spicaldaydate) {
      validate = false;
      setSpicaldayDateerr("Please select date.");
    }

    if (validate) {
      const dateObject = new Date(spicaldaydate);
      const day = dateObject.getDate().toString().padStart(2, "0");
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObject.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      FindPriceByDateTime(formattedDate, spicaldaytype, hireId);
    }
  };

  const handleClickOpen = async (hireId, buttonpriceonly, calendarid) => {
    try {
      const response = await WebsiteApi.createHire(hireId, buttonpriceonly, calendarid);
      if (response.status) {
        setOpen(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRezoropayOpen = async () => {
    const userId = userCookieData._id;
    checkoutHandler(buttonpriceonly, hireId, calendarid, userId, handleClickOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Card sx={{ marginBottom: "5vh" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
          <Typography className="Edit_profile_heading">Calendar</Typography>
        </Stack>
        <Grid container spacing={2} sx={{ justifyContent: "center", marginTop: "20px" }}>
          <Grid item xs={8} className="" sx={{ alignSelf: "center" }}>
            <div>
              <form id="bankDetailsForm" onSubmit={onSubmitFind} method="post" noValidate>
                <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                  <div style={{ position: "relative", width: "100%" }}>
                    <TextField
                      fullWidth
                      id="spicaldaydate"
                      value={spicaldaydate}
                      type="da"
                      className="w-100"
                      readOnly
                      onFocus={() => setCalendarOpen(true)}
                      onChange={handleChangeDate}
                      sx={{
                        "& label.Mui-focused": {
                          color: "#356c42",
                        },
                        "& .MuiInput-underline:after": {
                          borderBottomColor: "#356c42",
                        },
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "#356c42 !important",
                            borderRadius: "10px",
                            height: "60px",
                          },
                          "& fieldset": {
                            borderColor: "#356c42 !important",
                            borderRadius: "10px",
                            height: "60px",
                          },
                        },
                      }}
                    />
                    {calendarOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 5px)",
                          left: 0,
                          zIndex: 999,
                        }}
                      >
                        <Calendar
                          defaultActiveStartDate={new Date()}
                          onChange={(date) => {
                            setSpicaldayDateChange(date);
                            setCalendarOpen(false);
                          }}
                          value={spicaldaydate}
                          minDate={new Date()}
                          formatLongDate={(locale, date) =>
                            `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
                              .getDate()
                              .toString()
                              .padStart(2, "0")}/${date.getFullYear()}`
                          }
                        />
                      </div>
                    )}
                  </div>
                </Stack>
                <p className="input_err" style={{ marginTop: "15px" }}>
                  {spicaldaydateerr}
                </p>
                <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                  <FormControl sx={{ width: "100%", borderRadius: "10px", borderColor: "#356c42" }}>
                    <InputLabel id="spicaldaytype_leble">Select Time</InputLabel>
                    <Select
                      fullWidth
                      labelId="spicaldaytype_leble"
                      id="spicaldaytype"
                      value={spicaldaytype}
                      onChange={handleChangeTime}
                      input={<OutlinedInput label="Select Time" />}
                    >
                      <MenuItem value="">
                        <em></em>
                      </MenuItem>
                      <MenuItem value={"Noon-Mon"}>Noon-Mon</MenuItem>
                      <MenuItem value={"Noon-Even"}>Noon-Even</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <p className="input_err" style={{ marginTop: "15px" }}>
                  {spicaldaytypeerr}
                </p>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignSelf: "center",
                    marginTop: "1vh",
                    marginBottom: "2vh",
                    justifyContent: "center",
                  }}
                >
                  <Button type="submit" className="Edit_Profile_Buttton mt-3">
                    SEARCH
                  </Button>
                </Stack>
              </form>
              {buttonprice && (
                <div>
                  <Stack sx={{ alignItems: "center" }}>
                    <Typography className="Edit_profile_heading mb-3">{buttonprice}</Typography>
                  </Stack>
                  {buttonadmin && (
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ alignSelf: "center", justifyContent: "center" }}
                      onClick={() => handleRezoropayOpen()}
                    >
                      <Button className="Edit_Profile_Buttton mb-3">Pay To Admin</Button>
                    </Stack>
                  )}
                </div>
              )}
            </div>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
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
              Paid to ADMIN Successfully
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ alignSelf: "center" }}>
            <Link to="/website-hire-list">
              <Button onClick={handleClose} className="admin_payment_model_button">
                Go Hire page
              </Button>
            </Link>
            <Button onClick={handleClose} autoFocus className="admin_payment_model_button_ok">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
};

export default HireFind;
