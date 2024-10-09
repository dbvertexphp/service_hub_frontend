import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import { ThemeProvider } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import theme from "assets/theme";
import { FaAngleLeft, FaAngleRight, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import Grid from "@mui/joy/Grid";
import { WebsiteApi } from "Api/WebsiteApi";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarNumber } from "../../Actions/AuthActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getUserdataCookie, checkCookies } from "cookies";
import AuthModel from "./Authmodel";
import { useNavigate } from "react-router-dom";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import { set_Play_Pause } from "../../Actions/UserActivity";

export default function CarouselRatio() {
  const dispatch = useDispatch();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const base_url = process.env.REACT_APP_BASE_URL;
  const [thumbnails, setThumbnails] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRefs = useRef({});
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const reduxHomePageData = useSelector((state) => state.homepageReducer.HomePageData);
  const reduxsPlayPauseStatus = useSelector((state) => state.userActivity.PlayPauseStatus);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [showModel, setShowModel] = useState(false);
  const [actionType, setActionType] = useState(""); // Like or Comment

  const isBelow500px = useMediaQuery("(max-width:500px)");
  const isBelow992px = useMediaQuery("(max-width:992px)");
  const isBelow1200px = useMediaQuery("(max-width:1200px)");
  const isBelow1300px = useMediaQuery("(max-width:1300px)");
  const isBelow1400px = useMediaQuery("(max-width:1400px)");
  const isBelow1500px = useMediaQuery("(max-width:1500px)");
  const isBelow1600px = useMediaQuery("(max-width:1600px)");
  const isUp1600px = useMediaQuery("(min-width:1600px)");
  const Item = styled(Sheet)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.level1 : "#fff",
    ...theme.typography["body-sm"],
    padding: theme.spacing(1),
    textAlign: "center",
    borderRadius: 4,
    color: theme.vars.palette.text.secondary,
  }));

  useEffect(() => {
    if (reduxsPlayPauseStatus !== "Reel") {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          setPlayingVideoId(null);
          video.pause();
        }
      });
    }
  }, [reduxsPlayPauseStatus]);

  const handlePlayClick = (videoId) => {
    const clickedVideo = videoRefs.current[videoId];

    if (clickedVideo) {
      if (playingVideoId === videoId) {
        // If the video is already playing, pause it
        dispatch(set_Play_Pause("Reel"));
        clickedVideo.pause();
        setPlayingVideoId(null);
      } else {
        // Pause the currently playing video if any
        if (playingVideoId !== null) {
          const currentVideo = videoRefs.current[playingVideoId];
          if (currentVideo) {
            dispatch(set_Play_Pause("Reel"));
            currentVideo.pause();
          }
        }

        // Start playing the clicked video
        dispatch(set_Play_Pause("Reel"));
        clickedVideo.play();
        setPlayingVideoId(videoId);
      }
    }
  };

  useEffect(() => {
    if (reduxHomePageData && reduxHomePageData.reelsList && reduxHomePageData.reelsList.data) {
      setThumbnails(reduxHomePageData.reelsList.data);
    } else {
      setThumbnails([]);
    }
  }, [reduxHomePageData]);

  const handleButtonClickSidebarNumber = (sibarnumber) => {
    // Dispatch the setNumber action with the desired number
    dispatch(setSidebarNumber(sibarnumber));
  };

  const CheckAuth = async (event) => {
    if (checkCookies()) {
      handleButtonClickSidebarNumber(3);
      navigate("/website-reels-list/1");
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
  let ReelsWidth = "";
  let ReelsHight = "";
  if (isBelow500px) {
    ReelsWidth = "92px";
    ReelsHight = "150px";
  } //else if (isBelow992px) {
  // ReelsWidth = "149px";
  // ReelsHight = "300px";
  //}
  else if (isBelow1200px) {
    ReelsWidth = "137px";
    ReelsHight = "345px";
  } else if (isBelow1300px) {
    ReelsWidth = "110px";
    ReelsHight = "160px";
  } else if (isBelow1400px) {
    ReelsWidth = "118px";
    ReelsHight = "172px";
  } else if (isBelow1500px) {
    ReelsWidth = "125px";
    ReelsHight = "190px";
  } else if (isBelow1600px) {
    ReelsWidth = "137px";
    ReelsHight = "215px";
  } else if (isUp1600px) {
    ReelsWidth = "149px";
    ReelsHight = "300px";
  }

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Grid item="true" container>
          <Grid item="true" xs={12} md={12}>
            <Card className="video_home_card" sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <>
                  <Typography level="h3" className="video_home_card_hending">
                    Top Trending Quicky
                  </Typography>
                  <span style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                    <Typography level="h3" className="video_home_card_hending">
                      {checkCookies() ? (
                        <Link
                          to={`/website-reels-list/1`}
                          onClick={(event) => event.stopPropagation()}
                          className="video_home_card_hending"
                        >
                          See All
                        </Link>
                      ) : (
                        <div
                          onClick={(event) => {
                            CheckAuth("Reel_List");
                          }}
                          className="video_home_card_hending"
                        >
                          See All
                        </div>
                      )}
                    </Typography>
                  </span>
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
                  <Box sx={{ flexGrow: 1, alignSelf: "center" }}>
                    <Box>
                      <Typography
                        variant="body1"
                        color="error"
                        className="video_home_card_hending_Not_found"
                        sx={{ width: "max-content" }}
                      >
                        Quicky Not Found
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  thumbnails.map((thumbnail, index) => (
                    <Box className="slider_reels" key={thumbnail.id}>
                      <Card
                        orientation="horizontal"
                        size="sm"
                        key={thumbnail.id}
                        sx={{
                          flexGrow: 1,
                          minWidth: ReelsWidth,
                          minHeight: ReelsHight,
                        }}
                        component="li"
                      >
                        <CardCover>
                          <video
                            ref={(video) => (videoRefs.current[thumbnail.id] = video)}
                            id={`video_${thumbnail.id}`}
                            alt={`Thumbnail ${index}`}
                            controls={playingVideoId === thumbnail.id}
                            autoPlay={false}
                            className="video-player"
                            onMouseEnter={() => handlePlayClick(thumbnail.id, true)} // Start playing on mouse enter
                            onMouseLeave={() => handlePlayClick(thumbnail.id, false)} // Pause on mouse leave
                          >
                            <source
                              src={thumbnail.reel_url}
                              type="video/mp4"
                              alt={`Thumbnail ${index}`}
                            />
                          </video>
                        </CardCover>
                        <CardContent
                          sx={{
                            display: "flex",
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
                  ))
                )}
              </Carousel>
            </Card>
          </Grid>
          {showModel && (
            <AuthModel
              message={actionType === "Reel_List" ? "Sign in to View Quicky List." : ""}
              heading={actionType === "Reel_List" ? "Quicky List" : ""}
              onClose={() => setShowModel(false)}
            />
          )}
        </Grid>
      </ThemeProvider>
    </React.Fragment>
  );
}
