import React, { useState, useEffect } from "react";
import { WebsiteApi } from "Api/WebsiteApi";
import { Api } from "Api/Api";
import { useForm } from "react-hook-form";
import Backbutton from "../components/Backbutton";
import theme from "assets/theme";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  TextField,
  Stack,
  Grid,
  Button,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Snackbar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

const EditProfile = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Post_On_Job");
  const [categorie, setCategorie] = useState("");
  const [categorieErr, setCategorieErr] = useState("");
  const [titleErr, setTitleErr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");
  const [apiError, setApiError] = useState("");
  const [isAPICalling, setIsAPICalling] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    try {
      const response = await Api.getAllCategory();
      if (response && Array.isArray(response)) {
        setCategories(response);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
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

  const onSubmit = async (e) => {
    setTitleErr("");
    setDescriptionErr("");
    setCategorieErr("");
    e.preventDefault();
    let validate = true;
    if (!title) {
      validate = false;
      setTitleErr("Please enter the title.");
    }

    if (!categorie) {
      validate = false;
      setCategorieErr("Please Select Category.");
    }

    if (!description) {
      validate = false;
      setDescriptionErr("Please enter the description.");
    }

    if (validate) {
      if (isAPICalling) {
        return; // Prevent the second API call
      }
      try {
        setIsAPICalling(true);
        let response;
        const category_id = categorie;
        if (type === "Post_On_Job") {
          response = await WebsiteApi.uploadPostJob(category_id, description, title);
        } else {
          response = await WebsiteApi.uploadPostTimeline(category_id, description, title);
        }

        if (response.status === true) {
          setTitle("");
          setDescription("");
          setCategorie("");
          setOpen(true);
          setTimeout(() => {
            if (type === "Post_On_Job") {
              navigate("/website-my-job-list");
            } else {
              navigate("/website-timeline-list");
            }
          }, 2000);
        } else {
          setApiError(response.description);
        }
      } catch (error) {
        setApiError(error.message);
      } finally {
        setIsAPICalling(false);
      }
    }
  };

  const handleChange = (event) => {
    setCategorie(event.target.value);
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
              <Typography className="Edit_profile_heading">Post</Typography>
            </Stack>
            <form onSubmit={onSubmit} method="post" noValidate>
              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <TextField
                  fullWidth
                  label="Title"
                  id="title"
                  value={title || ""}
                  type="text"
                  className="w-100"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Stack>
              <p className="input_err">{titleErr}</p>

              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <FormControl
                  sx={{
                    m: 1,
                    width: "-webkit-fill-available",
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
                        paddingTop: "20px",
                      },
                      "& fieldset": {
                        borderColor: "#356c42 !important",
                        borderRadius: "10px",
                        height: "50px",
                        paddingTop: "20px",
                      },
                    },
                  }}
                >
                  <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    value={categorie}
                    onChange={handleChange}
                    input={<OutlinedInput label="Interests" />}
                    sx={{ paddingTop: "15px" }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <p className="input_err mt-2">{categorieErr}</p>

              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ fontSize: "1rem" }}>
                    Type
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="Post_On_Job"
                    name="radio-buttons-group"
                    className="type_uplaod_post"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <FormControlLabel
                      value="Post_On_Job"
                      className="type_uplaod_post_color"
                      control={<Radio />}
                      label="Post On Job"
                    />
                    <FormControlLabel
                      value="Post_On_Timeline"
                      control={
                        <Radio
                          sx={{
                            color: "#2b6639",
                            "&.Mui-checked": {
                              color: "#2b6639",
                            },
                          }}
                        />
                      }
                      label="Post On Timeline"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <BaseTextareaAutosize
                  placeholder="Description"
                  fullWidth
                  minRows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  type="text"
                  className="w-100 rounded border-success Abount_us_filed"
                />
              </Stack>
              <p className="input_err">{descriptionErr}</p>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignSelf: "center",
                  marginTop: "3vh",
                  marginBottom: "3vh",
                  justifyContent: "center",
                }}
              >
                <Button type="submit" className="Edit_Profile_Buttton">
                  Submit
                </Button>
              </Stack>
            </form>
          </Grid>
        </Grid>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
            {type === "Post_On_Job" ? "Job Post Successfully!" : "Timeline Post Successfully!"}
          </Alert>
        </Snackbar>
      </Card>
    </div>
  );
};

export default EditProfile;
