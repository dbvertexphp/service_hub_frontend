import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector, useDispatch } from "react-redux";
import { set_ReelscategoryBoxClose } from "../../Actions/UserActivity";
import { WebsiteApi } from "Api/WebsiteApi";

function Reels_Slider({ src, Reels_Id }) {
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const [isMuted, setIsMuted] = useState(true); // Default state set to unmuted
  const isBelow500px = useMediaQuery("(max-width:500px)");

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Change this threshold as per your requirement
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  const handleClick = (e) => {
    dispatch(set_ReelscategoryBoxClose(false));
    e.preventDefault();
    const newState = !isMuted;
    setIsMuted(newState);
    // Mute/unmute all videos
    document.querySelectorAll("video").forEach((video) => {
      video.muted = newState;
    });
  };

  const handleVideoEnd = () => {
    // Yahan par aap jo kuch karna chahte hain woh kar sakte hain
    ViewCountAddReels(Reels_Id);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      // Play the video
      videoRef.current.play();
    }
  };

  const ViewCountAddReels = async (Reels_Id) => {
    try {
      const response = await WebsiteApi.ViewCountAddReels(Reels_Id);
      if (response) {
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <video
      ref={videoRef}
      className={"video_height"}
      muted={isMuted}
      onClick={handleClick}
      onEnded={() => handleVideoEnd()}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

Reels_Slider.propTypes = {
  src: PropTypes.string.isRequired,
  Reels_Id: PropTypes.string.isRequired,
};

export default Reels_Slider;
