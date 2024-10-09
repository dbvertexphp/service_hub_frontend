import React, { useState, useEffect } from "react";
import { WebsiteApi } from "Api/WebsiteApi";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Backbutton from "./Backbutton.js";
import {
  Typography,
  Card,
  TextField,
  Stack,
  Grid,
  Button,
  Snackbar,
  Box,
  OutlinedInput,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MuiAlert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const bankDetails = () => {
  const [open, setOpen] = React.useState(false);
  const [getspecialdata, setGetSpecialData] = useState([]);
  const { register, handleSubmit, formState } = useForm();
  const [selectedFilter, setSelectedFilter] = useState("Normal_Day");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const fetchDataSpecial_Day = async (user_id) => {
    try {
      const response = await WebsiteApi.GetSpecialEntries();
      if (
        response &&
        Array.isArray(response.specialEntries) &&
        response.specialEntries.length > 0
      ) {
        const dataWithSerialNumber = response.specialEntries.map((entry, index) => ({
          ...entry,
          serialNumber: index + 1,
        }));

        setGetSpecialData(dataWithSerialNumber);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeFillter = (event) => {
    setSelectedFilter(event.target.value);
    if (event.target.value == "Normal_Day") {
    } else if (event.target.value == "Special_Day") {
      fetchDataSpecial_Day();
    }
  };

  const [normaldaymon, setNormaldayMON] = useState("");
  const [normaldayeven, setNormaldayEVEN] = useState("");

  const [spicaldaytype, setSpicaldayType] = useState("");
  const [spicaldaydate, setSpicaldayDate] = useState("");
  const [spicaldaydateChange, setSpicaldayDateChange] = useState(new Date());
  const [spicaldayprice, setSpicaldayPrice] = useState("");

  const [spicaldaytypeerr, setSpicaldayTypeerr] = useState("");
  const [spicaldaydateerr, setSpicaldayDateerr] = useState("");
  const [spicaldaypriceerr, setSpicaldayPriceerr] = useState("");

  const [Commanerr, setCommanErr] = useState("");
  const [api_error, setapi_error] = useState("");

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

  useEffect(() => {
    const fetchDataNormalDay = async () => {
      try {
        const response = await WebsiteApi.GetNormalEntries();
        if (
          response &&
          Array.isArray(response.normalEntries) &&
          response.normalEntries.length > 0
        ) {
          response.normalEntries.forEach((entry) => {
            if (entry.time === "Noon-Mon") {
              setNormaldayMON(entry.price);
            }
            if (entry.time === "Noon-Even") {
              setNormaldayEVEN(entry.price);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataNormalDay(); // async function ko call karein
  }, []);

  const [serialCounter, setSerialCounter] = useState(1); // Initial counter value

  const Createcalendar = async (time, price, type, date) => {
    try {
      const response = await WebsiteApi.Createcalendar(time, price, type, date);

      if (response && response.status) {
        setOpen(true);
        if (date) {
          setGetSpecialData((prevData) => [
            ...prevData,
            { serialNumber: serialCounter, time: time, price: price, type: type, date: date },
          ]);
        }
      } else {
        // If response or response.status is undefined
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      // Handle errors during API call
      console.error("Error fetching data:", error);
    }
  };

  const onSubmitNormal = async (e) => {
    setCommanErr("");
    e.preventDefault();
    let validate = true;

    let time;
    let selectedPrice;

    if (normaldaymon && !normaldayeven) {
      Createcalendar("Noon-Mon", normaldaymon, "Normal", "");
    } else if (!normaldaymon && normaldayeven) {
      Createcalendar("Noon-Even", normaldayeven, "Normal", "");
    } else if (normaldaymon && normaldayeven) {
      Createcalendar("Noon-Mon", normaldaymon, "Normal", "");
      Createcalendar("Noon-Even", normaldayeven, "Normal", "");
    } else {
      validate = false;
      setCommanErr("Please Select A Field.");
    }
    if (validate) {
    }
  };
  const onSubmitSpical = async (e) => {
    setSpicaldayTypeerr("");
    setSpicaldayDateerr("");
    setSpicaldayPriceerr("");
    e.preventDefault();

    let validate = true;

    if (!spicaldaytype) {
      validate = false;
      setSpicaldayTypeerr("Please select time.");
    }
    if (!spicaldaydate) {
      validate = false;
      setSpicaldayDateerr("Please select date.");
    }
    if (!spicaldayprice) {
      validate = false;
      setSpicaldayPriceerr("Please enter price.");
    }

    // Check if all fields are valid before clearing validation messages
    if (validate) {
      // Format the date
      const dateObject = new Date(spicaldaydate);
      const day = dateObject.getDate().toString().padStart(2, "0");
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
      const year = dateObject.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;

      // Call your function with the formatted date
      Createcalendar(spicaldaytype, spicaldayprice, "Special", formattedDate);
      setSpicaldayType("");
      setSpicaldayDateChange(new Date());
      setSpicaldayPrice("");
    }
  };

  const handleChangeTime = (event) => {
    setSpicaldayType(event.target.value);
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  return (
    <div>
      <Card sx={{ height: "91vh" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
          <Typography className="Edit_profile_heading">Calendar</Typography>
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
                  value="Normal_Day"
                  onClick={handleChangeFillter}
                  className={`Calendra_fillter_button_${
                    selectedFilter === "Normal_Day" ? "select" : "unselect"
                  }`}
                >
                  Normal Day
                </Button>
                <Button
                  value="Special_Day"
                  onClick={handleChangeFillter}
                  className={`Calendra_fillter_button_${
                    selectedFilter === "Special_Day" ? "select" : "unselect"
                  }`}
                >
                  Special Day
                </Button>
              </div>
            </Grid>
          </Grid>
        </Stack>
        <Grid container spacing={2} sx={{ justifyContent: "center", marginTop: "20px" }}>
          <Grid item xs={8} className="" sx={{ alignSelf: "center" }}>
            {selectedFilter === "Normal_Day" && (
              <form
                onSubmit={onSubmitNormal || ""}
                method="post"
                noValidate
                style={{ marginBottom: "50px" }}
              >
                <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "2vh" }}>
                  <TextField
                    fullWidth
                    label="Enter Normal Day Morning  Price"
                    id="Normal_Day_Mon"
                    type="number"
                    value={normaldaymon || ""}
                    className="w-100"
                    onChange={(e) => setNormaldayMON(e.target.value)}
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
                </Stack>
                <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "2vh" }}>
                  <TextField
                    fullWidth
                    label="Enter Normal Day Evening  Price"
                    id="Normal_Day_Even"
                    value={normaldayeven}
                    type="number"
                    className="w-100"
                    onChange={(e) => setNormaldayEVEN(e.target.value)}
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
                </Stack>
                <p className="input_err" style={{ marginTop: "15px" }}>
                  {Commanerr}
                </p>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignSelf: "center",
                    marginTop: "3vh",
                    justifyContent: "center",
                  }}
                >
                  <Button type="submit" className="Edit_Profile_Buttton">
                    Submit
                  </Button>
                </Stack>
              </form>
            )}
            {selectedFilter === "Special_Day" && (
              <div>
                <form onSubmit={onSubmitSpical} method="post" noValidate>
                  <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "2vh" }}>
                    <TextField
                      fullWidth
                      label="Enter Special Day Price"
                      id="spicaldayprice"
                      value={spicaldayprice}
                      type="number"
                      className="w-100"
                      onChange={(e) => setSpicaldayPrice(e.target.value)}
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
                  </Stack>
                  <p className="input_err" style={{ marginTop: "15px" }}>
                    {spicaldaypriceerr}
                  </p>
                  <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                    <div style={{ position: "relative", width: "100%" }}>
                      <TextField
                        id="spicaldaydate"
                        value={spicaldaydate}
                        type="da"
                        className="w-100"
                        onFocus={() => setCalendarOpen(true)} // Open calendar on focus
                        readOnly // Make input read-only
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
                    <FormControl
                      sx={{ width: "100%", borderRadius: "10px", borderColor: "#356c42" }}
                    >
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
                      marginTop: "3vh",
                      justifyContent: "center",
                    }}
                  >
                    <Button type="submit" className="Edit_Profile_Buttton">
                      Submit
                    </Button>
                  </Stack>
                </form>
                <div
                  style={{
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography className="SPECIAL_DATE">SPECIAL DATE</Typography>
                  <div style={{ marginTop: "20px", marginBottom: "40px" }}>
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableBody sx={{ border: "none" }}>
                          {getspecialdata.map((row, index) => (
                            <TableRow key={row._id}>
                              <TableCell scope="row" className="SPECIAL_DATE_DATA">
                                {index + 1}
                              </TableCell>
                              <TableCell align="left" className="SPECIAL_DATE_DATA">
                                {row.date}
                              </TableCell>
                              <TableCell align="right" className="SPECIAL_DATE_DATA">
                                Rs{row.price}
                              </TableCell>
                              <TableCell align="right" className="SPECIAL_DATE_DATA">
                                {row.time}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </div>
            )}
          </Grid>
        </Grid>

        <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
            Calendar Successfully Update!
          </Alert>
        </Snackbar>
      </Card>
    </div>
  );
};

export default bankDetails;
