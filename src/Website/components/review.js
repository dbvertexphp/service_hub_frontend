import React, { useState, useEffect } from "react";
import { WebsiteApi } from "Api/WebsiteApi";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
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
  Rating,
} from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

const AddReview = () => {
  const [open, setOpen] = React.useState(false);
  const [review_number, setReviewNumber] = useState();
  const [description, setDescription] = useState("");
  const [review_number_err, setReviewNumberErr] = useState("");
  const [description_err, setDescriptionErr] = useState("");
  const [api_error, setapi_error] = useState("");
  const { review_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [subscriberId, setSubscriberId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("subscriberId");
    if (id) {
      setSubscriberId(id);
    }
  }, [location]);

  console.log(subscriberId);

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const onSubmit = async (e) => {
    setReviewNumberErr("");
    setDescriptionErr("");
    e.preventDefault();
    let validate = true;
    if (!description) {
      validate = false;
      setDescriptionErr("Please enter description.");
    }
    if (validate) {
      try {
        const response = await WebsiteApi.addReview(
          review_id,
          review_number,
          description,
          subscriberId
        );
        if (response.status === true) {
          setOpen(true);
          setTimeout(() => {
            navigate("/website-hire-list");
          }, 2000);
        } else {
          setapi_error(response.message);
        }
      } catch (api_error) {
        setapi_error(api_error.message);
      }
    }
  };

  const StyledRating = styled(Rating)({
    "& .MuiRating-decimal": {
      color: "rgb(250, 175, 0)",
      fontSize: "3.5rem",
      lineHeight: "0px",
    },
  });

  return (
    <div>
      <Card sx={{ marginBottom: "5vh" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
          <Typography className="Edit_Subscription_heading">Review</Typography>
        </Stack>
        <Grid container spacing={2} sx={{ justifyContent: "center", marginTop: "20px" }}>
          <Grid item xs={8} className="" sx={{ alignSelf: "center" }}>
            <Typography className="Review_heading">
              Share your experience <br />
              with us
            </Typography>
            <Box sx={{ textAlign: "center" }}>
              <StyledRating
                name="customized-10"
                max={5}
                precision={0.5}
                value={review_number}
                onChange={(e) => setReviewNumber(e.target.value)}
              />
            </Box>
            <Box>
              <form onSubmit={onSubmit} method="post" noValidate>
                <BaseTextareaAutosize
                  Textarea={<OutlinedInput label="About Us" />}
                  placeholder="Review"
                  fullWidth
                  label="fullWidth"
                  id="fullWidth"
                  minRows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  className="w-100 rounded border-success Abount_us_filed"
                  sx={{
                    border: "1px solid gray",
                    borderRadius: "10px",
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
                  }}
                />
                <p className="input_err">{description_err}</p>
                <div style={{ margin: "30px 0px", textAlign: "center" }}>
                  <Button type="submit" className="admin_payment_model_button">
                    Review
                  </Button>
                  <Link to="/website-hire-list">
                    <Button autoFocus className="admin_payment_model_button_ok">
                      Cancle
                    </Button>
                  </Link>
                </div>
              </form>
            </Box>
          </Grid>
        </Grid>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
            Review Successfully Sent!
          </Alert>
        </Snackbar>
      </Card>
    </div>
  );
};

export default AddReview;
