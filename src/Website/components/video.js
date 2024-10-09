import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import AspectRatio from "@mui/joy/AspectRatio";
import { ThemeProvider } from "@mui/joy/styles";
import theme from "assets/theme";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import { FaAngleLeft, FaAngleRight, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { getUserdataCookie, checkCookies } from "cookies";
import Grid from "@mui/joy/Grid";
import { WebsiteApi } from "Api/WebsiteApi";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarNumber } from "../../Actions/AuthActions";
import { setHomePageData } from "../../Actions/HomePageActions";
import { set_Play_Pause } from "../../Actions/UserActivity";
import useMediaQuery from "@mui/material/useMediaQuery";
import AuthModel from "./Authmodel";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export default function CarouselRatio() {
  const dispatch = useDispatch();
  const base_url = process.env.REACT_APP_BASE_URL;
  const [thumbnails, setThumbnails] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const reduxsPlayPauseStatus = useSelector((state) => state.userActivity.PlayPauseStatus);
  const videoRefs = useRef({});
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const isBelow500px = useMediaQuery("(max-width:500px)");
  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment

  const Item = styled(Sheet)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.level1 : "#fff",
    ...theme.typography["body-sm"],
    padding: theme.spacing(1),
    textAlign: "center",
    borderRadius: 4,
    color: theme.vars.palette.text.secondary,
  }));
  useEffect(() => {
    if (reduxsPlayPauseStatus !== "Video") {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          // Yahan pe video ka null check kiya gaya hai
          setPlayingVideoId(null);
          video.pause();
        }
      });
    }
  }, [reduxsPlayPauseStatus]);

  // const handlePlayClick = (videoId) => {
  //   const clickedVideo = videoRefs.current[videoId];

  //   if (clickedVideo) {
  //     // Pause the currently playing video if any
  //     if (playingVideoId !== null && playingVideoId !== videoId) {
  //       const currentVideo = videoRefs.current[playingVideoId];
  //       if (currentVideo) {
  //         dispatch(set_Play_Pause("Video"));
  //         currentVideo.pause();
  //       }
  //     }

  //     // Toggle play/pause for the clicked video
  //     if (clickedVideo.paused) {
  //       clickedVideo.play();
  //       dispatch(set_Play_Pause("Video"));
  //       setPlayingVideoId(videoId);
  //     } else {
  //       clickedVideo.pause();
  //       dispatch(set_Play_Pause("Video"));
  //       setPlayingVideoId(null);
  //     }
  //   }
  // };

  const handlePlayClick = (videoId) => {
    const clickedVideo = videoRefs.current[videoId];

    if (clickedVideo) {
      if (playingVideoId === videoId) {
        // If the video is already playing, pause it

        dispatch(set_Play_Pause("Video"));
        clickedVideo.pause();
        setPlayingVideoId(null);
      } else {
        // Pause the currently playing video if any
        if (playingVideoId !== null) {
          const currentVideo = videoRefs.current[playingVideoId];
          if (currentVideo) {
            dispatch(set_Play_Pause("Video"));
            currentVideo.pause();
          }
        }

        // Start playing the clicked video
        dispatch(set_Play_Pause("Video"));
        clickedVideo.play();
        setPlayingVideoId(videoId);
      }
    }
  };

  const handleButtonClickSidebarNumber = (sibarnumber) => {
    dispatch(setSidebarNumber(sibarnumber));
  };

  useEffect(() => {
    setThumbnails([]);
    fetchData();
  }, [reduxcategory_id]);

  const fetchData = async () => {
    try {
      const category_id = reduxcategory_id;
      const response = await WebsiteApi.HomePage(category_id);
      dispatch(setHomePageData(response));
      if (response && Array.isArray(response.videoList.data)) {
        setThumbnails(response.videoList.data);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const CheckAuth = async (event) => {
    if (checkCookies()) {
      handleButtonClickSidebarNumber(2);
      navigate("/website-video-list");
    } else {
      setActionType(event);
      setShowModel(true);
    }
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 4,
      slidesToSlide: 3, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 767, min: 350 },
      items: 3,
      slidesToSlide: 2, // optional, default to 1.
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item="true" xs={12} md={12}>
          <Card className="video_home_card" sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <>
                <Typography level="h3" className="video_home_card_hending">
                  Top Trending Video
                </Typography>
                <Typography level="h3" className="video_home_card_hending">
                  <span style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                    {checkCookies() ? (
                      <Link
                        to={`/website-video-list`}
                        onClick={(event) => event.stopPropagation()}
                        className="video_home_card_hending"
                      >
                        See All
                      </Link>
                    ) : (
                      <div
                        onClick={(event) => {
                          CheckAuth("Video_List");
                        }}
                        className="video_home_card_hending"
                      >
                        See All
                      </div>
                    )}
                  </span>
                </Typography>
              </>
            </Box>
            <Carousel
              responsive={responsive}
              autoPlay={false}
              swipeable={true}
              draggable={true}
              showDots={false}
              infinite={false}
              partialVisible={false}
              dotListClass="custom-dot-list-style"
            >
              {thumbnails.length === 0 ? (
                <Box
                  sx={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="error"
                    className="video_home_card_hending_Not_found"
                    sx={{ width: "max-content" }}
                  >
                    Video Not Found
                  </Typography>
                </Box>
              ) : (
                thumbnails.map((thumbnail, index) => (
                  <div className="slider_video" key={thumbnails._id}>
                    <Box key={thumbnail.id}>
                      <Card
                        size="lg"
                        key={thumbnail.id}
                        sx={{
                          flexGrow: 1,
                          minWidth: isBelow500px ? "92px" : "auto",
                          minHeight: isBelow500px ? "100px" : "150px",
                        }}
                        component="li"
                      >
                        <CardCover>
                          <video
                            ref={(video) => (videoRefs.current[thumbnail.id] = video)}
                            id={`video_${thumbnail.id}`}
                            poster={thumbnail.thumbnail_url}
                            alt={`Thumbnail ${index}`}
                            controls={playingVideoId === thumbnail.id}
                            autoPlay={false}
                            className="video-player"
                            onMouseEnter={() => handlePlayClick(thumbnail.id, true)} // Start playing on mouse enter
                            onMouseLeave={() => handlePlayClick(thumbnail.id, false)} // Pause on mouse leave
                          >
                            <source
                              src={thumbnail.video_url}
                              type="video/mp4"
                              alt={`Thumbnail ${index}`}
                            />
                          </video>
                        </CardCover>
                        <CardContent
                          sx={{
                            flexDirection: "column",
                            justifyContent: "center",
                            alignSelf: "center",
                            alignItems: "center",
                            height: "100%",
                            marginTop: "10px", // Add margin-top
                            paddingX: 2, // Add some horizontal padding for better readability
                          }}
                        >
                          <Typography
                            level="body-lg"
                            fontWeight="lg"
                            fontSize="30px"
                            textColor="#307655"
                            onClick={() => handlePlayClick(thumbnail.id)}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            {playingVideoId === thumbnail.id ? <FaPauseCircle /> : <FaPlayCircle />}
                          </Typography>
                        </CardContent>
                      </Card>
                      <Typography
                        className="Video_title"
                        sx={{
                          color: "black",
                          mb: 1,
                          maxWidth: "100%",
                          fontSize: isBelow500px ? "13px" : "1rem",
                        }}
                        noWrap
                      >
                        {thumbnail.title.slice(0, 20)} {/* Limit title to 20 characters */}
                      </Typography>
                    </Box>
                  </div>
                ))
              )}
            </Carousel>
          </Card>
        </Grid>
        {showModel && (
          <AuthModel
            message={actionType === "Video_List" ? "Sign in to View Video List." : ""}
            heading={actionType === "Video_List" ? "Video List" : ""}
            onClose={() => setShowModel(false)}
          />
        )}
      </Grid>
    </ThemeProvider>
  );
}
