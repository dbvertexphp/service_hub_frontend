import React, { useState, useEffect } from "react";
import { WebsiteApi } from "Api/WebsiteApi";
import { useForm } from "react-hook-form";

import Backbutton from "./Backbutton.js";
import { Typography, Card, TextField, Stack, Grid, Button, Snackbar, Box } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const bankDetails = () => {
  const [open, setOpen] = React.useState(false);
  const [isEditAllowed, setIsEditAllowed] = useState(true); // To control whether editing is allowed or not
  const [userData, setUserData] = useState({});
  const { register, handleSubmit, formState } = useForm();
  const [message, setMessage] = useState("You can not change your bank details again");
  const { isSubmitting } = formState;
  useEffect(() => {
    const fetchDatabankdetials = async () => {
      try {
        const response = await WebsiteApi.getBankDetails();
        if (response && response.status && response.bankDetails) {
          setName(response.bankDetails.name);
          setBankName(response.bankDetails.bankName);
          setAccountNumber(response.bankDetails.accountNumber);
          setIfscCode(response.bankDetails.ifscCode);
          setBranchName(response.bankDetails.branchName);
          setIsEditAllowed(false);
          if (response.bankDetails !== null) {
            setMessage("Only Admin can change bank details, please contact Admin.");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDatabankdetials(); // async function ko call karein
  }, []);

  const handleAccountNumberChange = (e) => {
    const maxLength = 15;
    const inputValue = e.target.value.slice(0, maxLength);
    setAccountNumber(inputValue);
  };

  const handleIfscCodeChange = (e) => {
    const maxLength = 14;
    const inputValue = e.target.value.slice(0, maxLength);
    setIfscCode(inputValue);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [name, setName] = useState();
  const [bankName, setBankName] = useState("");

  const [name_err, setNameErr] = useState("");
  const [bankName_err, setBankNameErr] = useState("");

  const [accountNumber, setAccountNumber] = useState("");
  const [accountNumber_err, setAccountNumberErr] = useState("");

  const [ifscCode, setIfscCode] = useState("");
  const [ifscCode_err, setIfscCodeErr] = useState("");

  const [branchName, setBranchName] = useState("");
  const [branchName_err, setBranchNameErr] = useState("");

  const [api_error, setapi_error] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);

  const validateaccountNumber = (accountNumber) => accountNumber.match(/^[0-9]{10}$/);

  const handleaccountNumberChange = (e) => {
    const maxLength = 15;
    const inputValue = e.target.value.slice(0, maxLength);
    setAccountNumber(inputValue);
  };

  const validateEmail = (email) => {
    // Simple email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const onSubmit = async (e) => {
    setNameErr("");
    setBankNameErr("");
    setAccountNumberErr("");
    setIfscCodeErr("");
    setBranchNameErr("");
    e.preventDefault();
    let validate = true;

    if (!name) {
      validate = false;
      setNameErr("Please enter your name.");
    }
    if (!bankName) {
      validate = false;
      setBankNameErr("Please enter your bank name.");
    }
    if (!/^[a-zA-Z0-9]{9,15}$/.test(ifscCode)) {
      validate = false;
      setIfscCodeErr("Please enter a valid IFSC code.");
    }
    if (!/^[0-9]{10,15}$/.test(accountNumber)) {
      validate = false;
      setAccountNumberErr("Please enter a valid account number.");
    }

    if (!branchName) {
      validate = false;
      setBranchNameErr("Please enter branch name .");
    }
    if (validate) {
      if (isAPICalling) {
        return; // Prevent the second API call
      }
      try {
        setIsAPICalling(true);
        const response = await WebsiteApi.bankdetailsUpload(
          name,
          bankName,
          accountNumber,
          ifscCode,
          branchName
        );
        if (response.status === true) {
          setOpen(true);
          setIsEditAllowed(false);
          setMessage("Only Admin can change bank details, please contact Admin.");
        } else {
          setapi_error(response.message);
        }
      } catch (api_error) {
        setapi_error(api_error.message);
      } finally {
        setIsAPICalling(false);
      }
    }
  };
  return (
    <div>
      <Card sx={{ marginBottom: "5vh" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={8} className="" sx={{ alignSelf: "center" }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
              <Typography className="Edit_profile_heading">Bank Details</Typography>
            </Stack>
            <form onSubmit={onSubmit} method="post" noValidate>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Name"
                  id="name"
                  value={name || ""}
                  disabled={!isEditAllowed}
                  type="text"
                  className="w-100"
                  onChange={(e) => setName(e.target.value)}
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
                        height: "50px",
                      },
                      "& fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                    },
                  }}
                />
              </Stack>
              <p className="input_err">{name_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  id="bankName"
                  value={bankName || ""}
                  disabled={!isEditAllowed}
                  type="text" // Change type to "tel" for accountNumber number input
                  className="w-100"
                  onChange={(e) => setBankName(e.target.value)}
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
                        height: "50px",
                      },
                      "& fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                    },
                  }}
                />
              </Stack>
              <p className="input_err">{bankName_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Bank  A/C Number"
                  id="accountNumber_Number"
                  value={accountNumber || ""}
                  disabled={!isEditAllowed}
                  type="number" // Change type to "tel" for accountNumber number input
                  className="w-100"
                  //onChange={(e) => setAccountNumber(e.target.value)}
                  onInput={handleAccountNumberChange}
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
                        height: "50px",
                      },
                      "& fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                    },
                  }}
                />
              </Stack>
              <p className="input_err">{accountNumber_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  id="accountNumber_Number"
                  value={ifscCode || ""}
                  disabled={!isEditAllowed}
                  type="text" // Change type to "tel" for accountNumber number input
                  className="w-100"
                  //onChange={(e) => setIfscCode(e.target.value)}
                  onInput={handleIfscCodeChange}
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
                        height: "50px",
                      },
                      "& fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                    },
                  }}
                />
              </Stack>
              <p className="input_err">{ifscCode_err}</p>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Branch Name"
                  id="bankName"
                  value={branchName || ""}
                  disabled={!isEditAllowed}
                  type="text" // Change type to "tel" for accountNumber number input
                  className="w-100"
                  onChange={(e) => setBranchName(e.target.value)}
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
                        height: "50px",
                      },
                      "& fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                      },
                    },
                  }}
                />
              </Stack>
              <p className="input_err">{branchName_err}</p>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignSelf: "center",
                  marginTop: "3vh",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="submit"
                  className="Edit_Profile_Buttton"
                  disabled={!isEditAllowed || isSubmitting}
                >
                  Submit
                </Button>
              </Stack>
            </form>
          </Grid>
        </Grid>
        <Box
          sx={{
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <Typography className="admin_message">{message}</Typography>
        </Box>

        <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
            Bank Details Submit Successfully!
          </Alert>
        </Snackbar>
      </Card>
    </div>
  );
};

export default bankDetails;
