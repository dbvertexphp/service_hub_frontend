import React, { useState, useEffect } from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import { ThemeProvider } from "@mui/joy/styles";
import { useSelector, useDispatch } from "react-redux";
import { setCategory_id } from "Actions/CategoryActions";
import PropTypes from "prop-types";

// StickyList component definition
function StickyList({ categoriess, selectedCategorys }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categories, setCategories] = useState(categoriess);
  const [fetchDatalimit, setfetchDataLimit] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(selectedCategorys);
  const dispatch = useDispatch();
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);

  useEffect(() => {
    setSelectedCategory(reduxcategory_id);
  }, [reduxcategory_id]);

  // Function to handle clicks anywhere on the screen
  const handleClickAnywhere = () => {
    setIsSheetOpen(false); // Close the Sheet when user clicks anywhere on the screen
  };

  const handleCategorybyReelsClick = (categoryId, category_name) => {
    if (category_name === "All") {
      setSelectedCategory(categoryId);
      const categoryIds = null;
      dispatch(setCategory_id(categoryIds));
    } else {
      setSelectedCategory(categoryId);
      dispatch(setCategory_id(categoryId));
    }
  };

  console.log(categories);
  console.log(selectedCategory);
  return (
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
            <ListSubheader sticky className={`category_button_unselect_reels_heanding`}>
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
                        onClick={() =>
                          handleCategorybyReelsClick(category._id, category.category_name)
                        }
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
  );
}

// PropTypes validation for StickyList component
StickyList.propTypes = {
  categoriess: PropTypes.array,
  selectedCategorys: PropTypes.string,
};

export default StickyList;
