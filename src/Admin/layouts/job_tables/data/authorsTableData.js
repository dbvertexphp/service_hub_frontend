import React, { useState, useEffect } from "react";
import MDBox from "Admin/components/MDBox";
import MDTypography from "Admin/components/MDTypography";
import MDAvatar from "Admin/components/MDAvatar";
import MDBadge from "Admin/components/MDBadge";
import { Api } from "Api/Api";
import profile_logo from "assets/images/notifitions_icon.png";

export default function data() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Api.getAllReels();
        if (response && Array.isArray(response)) {
          // Assuming the response is an array of category objects
          const data = response;

          // Modify the data here to match the new structure
          const modifiedData = data.map((post) => {
            const { _id, View_count, description,datetime } = post;

            // Format the date
            // const formattedDate = new Date(createdAt).toLocaleDateString("en-GB");

            return { _id, View_count, description,datetime };
          });

          setUserData(modifiedData);
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData(); // Call the async function immediately
  }, []);

  return {
    columns: [
      { Header: "Title", accessor: "author", width: "45%", align: "left" },
      { Header: "Description", accessor: "created", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: userData.map((video) => ({
      author: (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDAvatar
            src={profile_logo}
            name={video.category_name}
            size="sm"
            className="profile_list"
          />
          <MDBox ml={2} lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
              {video.description}
            </MDTypography>
          </MDBox>
        </MDBox>
      ),
      status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
      created: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {video.datetime}
        </MDTypography>
      ),
      action: (
        <MDTypography component="a" href="/" variant="caption" color="text" fontWeight="medium">
          Delete
        </MDTypography>
      ),
    })),
  };
}
