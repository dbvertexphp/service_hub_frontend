import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import { ThemeProvider } from "@mui/joy/styles";
import theme from "assets/theme";
import Grid from "@mui/joy/Grid";
import Button from "@mui/joy/Button";
import { WebsiteApi } from "Api/WebsiteApi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCategory_id } from "Actions/CategoryActions";
import CategorySkeleton from "../Skeleton/category_skeleton";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function CarouselRatio() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState({});
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const isBelow500px = useMediaQuery("(max-width:500px)");

  useEffect(() => {
    if (reduxcategory_id == null) {
      setSelectedCategory("65af9a14e94ee43b04eef868");
    } else {
      setSelectedCategory(reduxcategory_id);
    }
  }, [reduxcategory_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await WebsiteApi.GetAllCategories();
        if (response && Array.isArray(response)) {
          setCategories(response);
          if (reduxcategory_id == null || reduxcategory_id == "") {
            setSelectedCategory(response[0]._id);
          }
        } else {
          console.error("Invalid API response format:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);

      // Check if the user is at the end of the container
      setShowLeftButton(container.scrollLeft > 0);

      // Check if the user is at the beginning of the container
      setShowRightButton(container.scrollLeft + container.clientWidth < container.scrollWidth);
    }
  };

  const handleCategoryClick = (categoryId, category_name) => {
    if (category_name === "All") {
      setSelectedCategory(categoryId);
      const categoryIds = null;
      dispatch(setCategory_id(categoryIds));
    } else {
      setSelectedCategory(categoryId);
      dispatch(setCategory_id(categoryId));
    }
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 5,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 767, min: 350 },
      items: 4,
      slidesToSlide: 2, // optional, default to 1.
    },
  };
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Grid item="true" container>
          <Grid item="true" xs={12} md={12}>
            {/* Categories */}
            <Box>
              <Carousel
                responsive={responsive}
                autoPlay={false}
                swipeable={true}
                draggable={true}
                showDots={false}
                infinite={false}
                partialVisible={false}
                dotListClass="custom-dot-list-style"
                className="Carousel_slider_job"
              >
                {categories.map((category, index) => (
                  <React.Fragment key={category._id}>
                    {loading ? (
                      <div key={category._id}>
                        <CategorySkeleton />
                      </div>
                    ) : (
                      <Button
                        key={category._id}
                        className={`category_button_${
                          selectedCategory === category._id ? "select" : "unselect"
                        }`}
                        style={{
                          margin: "8px",
                          minWidth: "max-content",
                          marginLeft: index === 0 ? "20px" : "8px",
                          marginRight: index === categories.length - 1 ? "20px" : "8px",
                        }}
                        onClick={() => handleCategoryClick(category._id, category.category_name)}
                      >
                        {category.category_name}
                      </Button>
                    )}
                  </React.Fragment>
                ))}
              </Carousel>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </React.Fragment>
  );
}
