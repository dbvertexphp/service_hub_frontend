import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Skeleton from "@mui/joy/Skeleton";
import Stack from "@mui/joy/Stack";
import Switch from "@mui/joy/Switch";
import { ThemeProvider } from "@mui/joy/styles";
import theme from "assets/theme";
import IconButton from "@mui/joy/IconButton";
import BookmarkAdd from "@mui/icons-material/BookmarkAddOutlined";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ImageSkeleton() {
  const isBelow500px = useMediaQuery("(max-width:500px)");
  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={2}>
        <Box className="Reels_Slider" sx={{ paddingTop: "20px" }}>
          <AspectRatio
            ratio={`${isBelow500px ? "5/11" : "9/19"}`}
            style={{ filter: "brightness(70%)", borderRadius: "20px" }}
          >
            <Skeleton animation="wave">
              <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" />
            </Skeleton>
          </AspectRatio>

          <Box
            sx={{
              m: "auto",
              display: "flex",
              alignItems: "center",
              gap: 2,
              position: "absolute",
              bottom: "15px",
            }}
            className="fa"
          >
            <Skeleton variant="circular" width={48} height={48} />
            <div>
              <Skeleton variant="rectangular" width={200} height="1em" sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width={140} height="1em" />
            </div>
          </Box>
          <IconButton className="icon-styling like details_icon_css">
            <Skeleton animation="wave" width={30} height={30}>
              <FavoriteTwoToneIcon />
            </Skeleton>
          </IconButton>
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            className="icon-styling_commant like details_icon_css"
          >
            <Skeleton animation="wave" width={30} height={30}>
              <FavoriteTwoToneIcon />
            </Skeleton>
          </IconButton>
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            className="icon-styling_share like details_icon_css rounded-pill"
          >
            <Skeleton animation="wave" width={30} height={30}>
              <FavoriteTwoToneIcon />
            </Skeleton>
          </IconButton>
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            className="icon-styling_report like details_icon_css rounded-pill"
          >
            <Skeleton animation="wave" width={30} height={30}>
              <FavoriteTwoToneIcon />
            </Skeleton>
          </IconButton>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}
