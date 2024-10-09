// avatarUtils.js

import React from "react";
import Avatar from "@mui/joy/Avatar";
import { ThemeProvider } from "@mui/joy/styles";
import theme from "assets/theme";
import useMediaQuery from "@mui/material/useMediaQuery";

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
    case "Mobile_commant":
      return { width: 30, height: 30 };
    case "HomepageJobmobile":
      return { width: 22, height: 22, fontSize: "15px" };
    default:
      return { width: 44, height: 44 }; // Default size
  }
};

const createAvatarJoy = (imgUrl, firstName, lastName, type) => {
  const { width, height, fontSize } = getComponentSize(type);

  return (
    <ThemeProvider theme={theme}>
      <Avatar
        alt={firstName}
        sx={{
          bgcolor: imgUrl && imgUrl.includes("defult_pic.jpg") ? "#ff5722" : undefined,
          width,
          height,
          fontSize,
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
    </ThemeProvider>
  );
};

export default createAvatarJoy;
