// avatarUtils.js

import React from "react";
import Avatar from "@mui/material/Avatar";

const getComponentSize = (type) => {
  switch (type) {
    case "chatheader":
      return { width: 44, height: 44 };
    case "headermobile":
      return { width: 30, height: 30 };
    case "headerdesktop":
      return { width: 35, height: 35 };
    case "notificaton_list":
      return { width: 40, height: 40 };
    case "notification_list_mobile":
      return { width: 40, height: 40, fontSize: "20px" };
    case "Mobile_commant":
      return { width: 30, height: 30 };
    default:
      return { width: 44, height: 44 }; // Default size
  }
};

const createAvatar = (imgUrl, firstName, lastName, type) => {
  const { width, height } = getComponentSize(type);
  return (
    <Avatar
      alt={firstName}
      sx={{
        bgcolor: imgUrl && imgUrl.includes("defult_pic.jpg") ? "#ff5722" : undefined,
        width,
        height,
      }}
      className="chat_user_img"
    >
      {!imgUrl || imgUrl.includes("defult_pic.jpg") ? (
        `${firstName.charAt(0)}${lastName.charAt(0)}`
      ) : (
        <img
          alt={`Avatar for ${firstName}`}
          src={imgUrl}
          style={{ width, height, borderRadius: "50%" }}
        />
      )}
    </Avatar>
  );
};

export default createAvatar;
