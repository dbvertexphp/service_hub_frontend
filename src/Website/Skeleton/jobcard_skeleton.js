import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Skeleton from "@mui/joy/Skeleton";
import Typography from "@mui/joy/Typography";
import { ThemeProvider } from "@mui/joy/styles";
import theme from "assets/theme";

export default function AnimationSkeleton() {
  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={2} useFlexGap>
        <Card
          variant="outlined"
          className="Video_list_card"
          sx={{ maxWidth: "-webkit-fill-available", marginTop: "20px" }}
        >
          <CardContent orientation="horizontal">
            <Skeleton animation="wave" variant="circular" width={48} height={48} />
            <div>
              <Skeleton animation="wave" variant="text" sx={{ width: 120 }} />
              <Skeleton animation="wave" variant="text" level="body-sm" sx={{ width: 200 }} />
            </div>
          </CardContent>

          <Typography sx={{ overflow: "hidden" }}>
            <Skeleton animation="wave">
              Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing
              industries.Lorem ipsum is placeholder text commonly used in the graphic, print, and
              publishing industries.
            </Skeleton>
          </Typography>
        </Card>
      </Stack>
    </ThemeProvider>
  );
}
