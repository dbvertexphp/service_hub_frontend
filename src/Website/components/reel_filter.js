import React, { useState, useEffect } from "react";
import ReelCard from "Website/components/reel_card";
import { debounce } from "lodash";
import { WebsiteApi } from "Api/WebsiteApi";
import ReelsSkeleton from "../Skeleton/reels_skeleton";
import Backbutton from "./Backbutton.js";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { CiFilter } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";
import useMediaQuery from "@mui/material/useMediaQuery";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import { ThemeProvider } from "@mui/joy/styles";
import { useSelector, useDispatch } from "react-redux";
import { setCategory_id } from "Actions/CategoryActions";
import { setReelData } from "Actions/ReelsActions";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import { setSearch_data } from "Actions/SreachDataActions";

export default function ReelsList({ reelsId }) {
  const [reelslist, setReelsList] = useState({ data: [] });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [margintop, setMarginTop] = useState(false);
  const [reelsListdata, setReelsListdata] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [reelsIdnumber, setReelsId] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [handleArrowClickArrow, setHandleArrowClick] = useState("");
  const [handleArrowClickArrowNumber, setHandleArrowClickNumber] = useState(0);
  const [DefultIndexNumber, setDefultIndexNumber] = useState(1);
  const [reelscategory, setReelsCategory] = useState(false);
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const reduxsearch_data = useSelector((state) => state.searchReducer.search_data);
  //  const reduxreelData = useSelector((state) => state.reelsReducer.reelData);
  const reduxboxclosestatus = useSelector((state) => state.userActivity.boxclosestatus);
  const reduxcomments_box_status = useSelector((state) => state.userActivity.comments_box_status);
  const isBelow500px = useMediaQuery("(max-width:500px)");
  const dispatch = useDispatch();
  const [scrollHandled, setScrollHandled] = useState(false);
  const { share_Id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSheetOpen(reduxboxclosestatus);
  }, [reduxboxclosestatus]); // I

  useEffect(() => {}, [reduxsearch_data]); // I

  useEffect(() => {
    fetchData();
  }, [reduxsearch_data]);

  const handleCarouselIndexChange = (index) => {
    //setReelsId((prevReelsId) => prevReelsId + 1); // Increment by 2
  };

  const fetchData = async () => {
    try {
      setApiLoading(true);

      let response;
      response = await WebsiteApi.getPaginatedReelWebsiteFillter(
        reduxcategory_id,
        reelsIdnumber,
        share_Id,
        reduxsearch_data
      );

      if (response && response.status && Array.isArray(response.data)) {
        setReelsList({ data: response.data });
        setHasMore(response.hasMore);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setApiLoading(false);
    }
  };

  const handleCategory = () => {
    if (!margintop) {
      setMarginTop(true);
    } else {
      setMarginTop(false);
    }

    if (!reelscategory) {
      setReelsCategory(true);
    } else {
      setReelsCategory(false);
    }
  };

  const handleClickAnywhere = () => {
    setIsSheetOpen(false); // Close the Sheet when user clicks anywhere on the screen
  };

  const handleCategorybyReelsClick = (categoryId, category_name) => {
    if (reduxsearch_data != "") {
      const value = "";
      dispatch(setSearch_data(value));
    }
    setMarginTop(false);
    setReelsCategory(false);
    setHasMore(true);
    setReelsList({ data: [] });
    setReelsId(1);
    setDefultIndexNumber(0);
    const event = { deltaY: 0 };
    handleScroll(event);

    if (category_name === "All") {
      setSelectedCategory(categoryId);
      const categoryIds = null;
      dispatch(setCategory_id(categoryIds));
    } else {
      dispatch(setCategory_id(categoryId));
    }
    navigate(`/website-reels-list/1`);
  };

  useEffect(() => {
    const fetchDataCategory = async () => {
      try {
        const response = await WebsiteApi.GetAllCategories();
        if (response && Array.isArray(response)) {
          setCategories(response);
          if (reduxcategory_id == null || reduxcategory_id != "") {
            setSelectedCategory(response[0]._id);
          } else {
            setSelectedCategory(response[0]._id);
          }
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataCategory();
  }, []);

  const handleArrowClickInternal = (direction) => {
    if (direction === "up") {
      const handleArrowNumberUpdate = handleArrowClickArrowNumber + 1;
      setHandleArrowClickNumber(handleArrowNumberUpdate);
      setHandleArrowClick(`up_${handleArrowNumberUpdate}`);
    } else {
      const handleArrowNumberUpdate = handleArrowClickArrowNumber - 1;
      setHandleArrowClickNumber(handleArrowNumberUpdate);
      setHandleArrowClick(`down_${handleArrowNumberUpdate}`);
    }
  };

  const handleScroll = debounce((event) => {
    if (!reduxcomments_box_status) {
      if (!scrollHandled) {
        setScrollHandled(true);
        if (event.deltaY > 0) {
          handleArrowClickInternal("down");
        } else {
          handleArrowClickInternal("up");
        }
        // Reset the flag after a short delay to allow future scrolls
        setTimeout(() => {
          setScrollHandled(false);
        }, 200); // Adjust the delay as per your requirement
      }
    }
  }, 200);

  const handleMouseEnter = () => {
    console.log("handleMouseEnter");
    document.body.style.overflow = "hidden"; // Disable scroll on the entire screen
  };

  const handleMouseLeave = () => {
    console.log("handleMouseLeave");
    document.body.style.overflow = ""; // Enable scroll on the entire screen
  };

  return (
    <Grid
      container
      className="mobile_coanitner_reels"
      justifyContent="center"
      style={{ maxWidth: "100%", margin: "auto" }}
    >
      <Grid
        item
        xxl={6}
        xl={8}
        lg={6}
        md={8}
        sm={10}
        onWheel={handleScroll}
        sx={{ width: "100%" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {loading ? (
          <div>
            <ReelsSkeleton />
          </div>
        ) : (
          <div className={`${isBelow500px ? "video-container_mobile" : "video-container"}`}>
            <div className="backbutton_reels" onClick={() => handleMouseLeave()}>
              <div className="back_button_css">
                <Backbutton />
              </div>

              <IconButton
                aria-label="like"
                onClick={() => handleCategory()}
                className={`icon-styling_fillter like details_icon_css ${
                  margintop && "fillter_margin"
                }`}
              >
                <CiFilter />
                <RiArrowDropDownLine />
              </IconButton>
              {reelscategory && (
                <div aria-label="like" className="icon-styling_fillter_box like details_icon_css">
                  <ThemeProvider>
                    {/* Add click event listener to handle clicks anywhere on the screen */}
                    <div onClick={handleClickAnywhere}>
                      <Sheet
                        open={isSheetOpen} // Open the Sheet based on state
                        onClose={() => setIsSheetOpen(false)} // Close the Sheet when onClose event is triggered
                        variant="outlined"
                        sx={{
                          width: "auto",
                          maxHeight: 300,
                          overflow: "auto",
                          borderRadius: "sm",
                        }}
                      >
                        <List>
                          <ListSubheader
                            sticky
                            className={`category_button_unselect_reels_heanding`}
                          >
                            Category
                          </ListSubheader>

                          {selectedCategory && (
                            <ListItem nested>
                              <List>
                                {categories.map((category, index) => (
                                  <ListItem key={index}>
                                    <ListItemButton
                                      className={`category_button_${
                                        selectedCategory === category._id ? "select" : "unselect"
                                      }_reels`}
                                      onClick={() => {
                                        if (selectedCategory === category._id && share_Id == 1) {
                                          return;
                                        }
                                        handleCategorybyReelsClick(
                                          category._id,
                                          category.category_name
                                        );
                                      }}
                                    >
                                      {category.category_name}
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                              </List>
                            </ListItem>
                          )}
                        </List>
                      </Sheet>
                    </div>
                  </ThemeProvider>
                </div>
              )}
            </div>
            <ReelCard
              reels={reelslist}
              window={window}
              handleArrowClickArrow={handleArrowClickArrow}
              onIndexChange={handleCarouselIndexChange}
              DefultIndexNumber={DefultIndexNumber} // Pass the callback function here
            />
          </div>
        )}
      </Grid>
    </Grid>
  );
}

ReelsList.propTypes = {
  reelsId: PropTypes.string,
};
