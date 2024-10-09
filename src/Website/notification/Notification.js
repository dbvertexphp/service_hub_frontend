import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { RequestForToken, onMessageListener } from "./firebase";
import { setNotificationData } from "Actions/NotificationActions";
import { useSelector, useDispatch } from "react-redux";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const dispatch = useDispatch();
  const randomNumber = Math.floor(Math.random() * 10000);

  const notify = () => toast(<ToastDisplay />);
  function ToastDisplay() {
    return (
      <div>
        <p>
          <b>{notification?.title}</b>
        </p>
        <p>{notification?.body}</p>
      </div>
    );
  }

  useEffect(() => {
    if (notification?.title) {
      notify();
    }
  }, [notification]);

  RequestForToken();

  onMessageListener()
    .then((payload) => {
      dispatch(setNotificationData(randomNumber));
      setNotification({ title: payload?.notification?.title, body: payload?.notification?.body });
    })
    .catch((err) => console.log("failed: ", err));

  return <Toaster />;
};

export default Notification;
