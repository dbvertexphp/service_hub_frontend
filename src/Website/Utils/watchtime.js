import React, { useEffect, useState } from "react";
import { getUserdataCookie, checkCookies } from "../../cookies";
import { WebsiteApi } from "../../Api/WebsiteApi"; // Assuming you have an API module for making requests
const watchtime = () => {
  const [timer, setTimer] = useState(0); // State to track the timer
  const [isActive, setIsActive] = useState(false); // State to track user activity

  // Function to reset the timer
  const resetTimer = () => {
    setTimer(0);
    setIsActive(false);
  };

  useEffect(() => {
    let interval;
    const activityTimeout = 15; // Timeout in seconds for user activity

    const handleActivity = () => {
      setIsActive(true); // Set isActive to true when user performs any activity
    };

    const handleInactive = () => {
      setIsActive(false); // Set isActive to true when user performs any activity
    };

    if (timer >= 15) {
      if (checkCookies()) {
        const response = WebsiteApi.updateUserWatchTime(timer);
      }
      resetTimer(); // Reset the timer
    }
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keydown", handleActivity);
    document.addEventListener("click", handleActivity);
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000); // Increment timer every second
    }

    const timeoutId = setTimeout(handleInactive, activityTimeout * 1000);

    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keydown", handleActivity);
      document.removeEventListener("click", handleActivity);
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [isActive, timer]);

  return <div></div>;
};

export default watchtime;
