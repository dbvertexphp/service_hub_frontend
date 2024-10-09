import React, { useState, useEffect } from "react";
import { WebsiteApi } from "Api/WebsiteApi";
import Backbutton from "./Backbutton.js";
import { Typography, Card, Grid } from "@mui/material";

const TermsConditions = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await WebsiteApi.getTermsConditions();

        if (response && response.status && response.content) {
          setContent(response.content);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div>
      <Card sx={{ marginBottom: "5vh" }}>
        <div className="back_button_css">
          <Backbutton />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} className="px-3">
            <Typography className="Edit_profile_heading" sx={{ textAlign: "center" }}>
              Terms & Conditions
            </Typography>
            <div
              className="px-4 py-3 website_details custom-list"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default TermsConditions;
