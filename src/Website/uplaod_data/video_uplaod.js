import React, { useState, useEffect } from "react";
import { WebsiteApi } from "Api/WebsiteApi";
import { Api } from "Api/Api";
import { useForm } from "react-hook-form";
import Backbutton from "../components/Backbutton";
import theme from "assets/theme";
import { useNavigate } from "react-router-dom";
import Uplaod_icon from "../../assets/website_img/uploadicon.svg";
import { RxCross2 } from "react-icons/rx";
import HashLoader from "react-spinners/HashLoader";
import Modal from "@mui/material/Modal";
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
  Box,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "transparent",
  border: "2px solid transparent",
  boxShadow: 0,
  p: 4,
  width: "fit-content",
};

const UplaodeVideo = () => {
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
  const [uplaodS3Url, setUplaodS3Url] = useState({});
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [thumbnailErr, setThumbnailErr] = useState("");
  const [videoErr, setVideoErr] = useState("");

  useEffect(() => {
    getAllCategories();
    UplaodS3Url();
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
  const UplaodS3Url = async () => {
    try {
      const response = await WebsiteApi.getVideoUploadUrlS3();
      if (response.message) {
        setUplaodS3Url(response.message);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

  const thumbnailUploadUrlFun = () => {
    const getthumbnailUploadUrlS3 = uplaodS3Url.thumbnailget_url.url;
    let contentType;
    if (thumbnailFile.type === "image/jpeg" || thumbnailFile.type === "image/jpg") {
      contentType = "image/jpeg";
    } else if (thumbnailFile.type === "image/png") {
      contentType = "image/png";
    } else {
      // Default content type, if content type does not match
      contentType = "application/octet-stream";
    }

    return fetch(getthumbnailUploadUrlS3, {
      method: "PUT",
      body: thumbnailFile,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.status;
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error; // Rethrow the error to be caught by the caller
      });
  };

  const videoUploadUrlFun = () => {
    const getVideoUploadUrlS3 = uplaodS3Url.videoget_url.url;
    let contentType;
    if (videoFile.type === "video/mp4") {
      contentType = "video/mp4";
    }
    return fetch(getVideoUploadUrlS3, {
      method: "PUT",
      body: videoFile,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.status;
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error; // Rethrow the error to be caught by the caller
      });
  };

  const onSubmit = async (e) => {
    setTitleErr("");
    setDescriptionErr("");
    setCategorieErr("");
    setThumbnailErr("");
    setVideoErr("");
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
    if (!thumbnail) {
      validate = false;
      setThumbnailErr("Please Select Thumbnail.");
    }
    if (!video) {
      validate = false;
      setVideoErr("Please Select Video.");
    }

    if (validate) {
      try {
        setIsAPICalling(true);
        const uplaodeThumImage = await thumbnailUploadUrlFun();
        const uplaodeVideofile = await videoUploadUrlFun();

        if (uplaodeThumImage == 200 && uplaodeVideofile == 200) {
          const category_id = categorie;
          const thumbnail_key = uplaodS3Url.thumbnailget_url.key;
          const video_key = uplaodS3Url.videoget_url.key;
          response = await WebsiteApi.uploadVideos(
            category_id,
            description,
            title,
            video_key,
            thumbnail_key
          );

          if (response.status == 201) {
            setTitle("");
            setDescription("");
            setCategorie("");
            setOpen(true);
          } else {
            setApiError(response.description);
          }
        }
      } catch (error) {
        setApiError(error.message);
      } finally {
        setIsAPICalling(false);
        navigate("/website-my-profile-view");
      }
    }
  };

  const handleChange = (event) => {
    setCategorie(event.target.value);
  };

  const commonStyles = {
    bgcolor: "background.paper",
    width: "-webkit-fill-available",
    height: "5rem",
    borderRadius: "10px",
    border: "1px solid #2b6639",
    overflow: "hidden",
    textAlign: "-webkit-center",
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnail(URL.createObjectURL(file));
      setThumbnailFile(file);
      setThumbnailErr("");
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setVideo(URL.createObjectURL(file));
      setVideoFile(file);
      setVideoErr("");
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Card sx={{ marginBottom: "5vh" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={8} className="" sx={{ alignSelf: "center" }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: "center", marginTop: "1vh" }}>
              <Typography className="Edit_profile_heading">Video</Typography>
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

              <Stack direction="row" sx={{ alignSelf: "center", marginTop: "3vh" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ ...commonStyles, position: "relative" }}>
                      {!thumbnail && (
                        <label htmlFor="thumbnailInput">
                          <img
                            src={Uplaod_icon}
                            alt="page"
                            style={{ cursor: "pointer", paddingTop: "8px" }}
                            className="Uplaod_icon_model"
                          />
                          <br />
                          <typography className="Uplaod_icon_model_text">
                            Upload Thumbnail
                          </typography>
                          <input
                            type="file"
                            id="thumbnailInput"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleThumbnailUpload}
                          />
                        </label>
                      )}
                      {thumbnail && (
                        <div style={{ position: "relative" }}>
                          <Typography
                            sx={{
                              position: "absolute",
                              top: "-3px",
                              right: "6px",
                              cursor: "pointer",
                              color: "red",
                            }}
                            onClick={removeThumbnail}
                          >
                            <RxCross2 />
                          </Typography>
                          <img
                            src={thumbnail}
                            alt="Thumbnail"
                            style={{ width: "100%", height: "9vh" }}
                          />
                        </div>
                      )}
                    </Box>
                    <p className="input_err">{thumbnailErr}</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ ...commonStyles, position: "relative" }}>
                      {!video && (
                        <label htmlFor="videoInput">
                          <img
                            src={Uplaod_icon}
                            alt="page"
                            style={{ cursor: "pointer", paddingTop: "8px" }}
                            className="Uplaod_icon_model"
                          />
                          <br />
                          <typography className="Uplaod_icon_model_text">Upload Video</typography>
                          <input
                            type="file"
                            id="videoInput"
                            accept="video/*"
                            style={{ display: "none" }}
                            onChange={handleVideoUpload}
                          />
                        </label>
                      )}
                      {video && (
                        <div style={{ position: "relative" }}>
                          <Typography
                            component="span" // Added component="span" to ensure proper styling
                            sx={{
                              position: "absolute",
                              top: "-3px", // Adjusted top position for better alignment
                              right: "6px", // Adjusted right position for better alignment
                              cursor: "pointer",
                              color: "red",
                              zIndex: 1, // Added zIndex to ensure the icon is clickable
                            }}
                            onClick={removeVideo}
                          >
                            <RxCross2 />
                          </Typography>
                          <video autoPlay muted style={{ width: "100%", height: "9vh" }}>
                            <source src={video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </Box>
                    <p className="input_err">{videoErr}</p>
                  </Grid>
                </Grid>
              </Stack>
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
        <Snackbar open={open} autoHideDuration={2000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
            {"Video Post Successfully!"}
          </Alert>
        </Snackbar>
      </Card>
      <div>
        <Modal
          open={isAPICalling}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <HashLoader color="#fff" loading={isAPICalling} speedMultiplier={1} cssOverride={{}} />
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default UplaodeVideo;
