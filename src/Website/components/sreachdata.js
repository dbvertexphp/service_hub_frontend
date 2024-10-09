import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { WebsiteApi } from "Api/WebsiteApi";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearch_data } from "Actions/SreachDataActions";
import { setProfileUrl } from "Actions/UserProfileActions";
import { RxCross2 } from "react-icons/rx";
import AuthModel from "./Authmodel";
import Cookies from "js-cookie";
import { setCategory_id } from "Actions/CategoryActions";
import ListSubheader from "@mui/material/ListSubheader";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function SreachData() {
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState(false);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const reduxsearch_data = useSelector((state) => state.searchReducer.search_data);
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const [actionType, setActionType] = useState("");
  const [showModel, setShowModel] = useState(false);
  const getWebsiteToken = Cookies.get("Websitetoken");
  const [sreachtype, setSreachType] = useState("User");

  const handleChangeSreachtype = (event) => {
    setSreachType(event.target.value);
  };

  useEffect(() => {
    if (reduxsearch_data == "") {
      setSearchValue(false);
      setSearchResults([]);
      setValue(null); // Clear the input value
      setInputValue(""); // Clear the input value in Autocomplete component
    } else {
      setSearchValue(true);
      setInputValue(reduxsearch_data);
    }
  }, [reduxsearch_data]);

  //   const currentPath = window.location.pathname;
  //   const pathParts = currentPath.split("/"); // Path ko '/' ke hisaab se split karein
  //   useEffect(() => {
  //     if (pathParts[1] == "website-video-list") {
  //       setSreachType("Video");
  //     } else if (pathParts[1] == "website-reels-filter-list") {
  //       setSreachType("Quicky");
  //     } else if (pathParts[1] == "website-timeline-list") {
  //       setSreachType("Post");
  //     } else if (pathParts[1] == "website-job-list") {
  //       setSreachType("Job");
  //     }
  //   }, [pathParts]);
  const handleSearchNull = () => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    if (pathParts[1] == "website-reels-filter-list") {
      navigate(`/website-reels-list/1`);
    }
    setSearchValue(false);
    setSearchResults([]);
    setValue(null); // Clear the input value
    setInputValue(""); // Clear the input value in Autocomplete component
    const value = "";
    dispatch(setSearch_data(value));
    return;
  };

  const handleSearch = async (event, value) => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/"); // Path ko '/' ke hisaab se split karein
    if (getWebsiteToken) {
      setSearchValue(true);
      // if (pathParts[1] != "website-reels-filter-list") {
      //   dispatch(setSearch_data(value));
      // }

      if (reduxcategory_id != null) {
        const categoryIds = null;
        dispatch(setCategory_id(categoryIds));
      }
      try {
        if (!value.trim()) {
          const inputValue = "";
          dispatch(setSearch_data(inputValue));
          setSearchValue(false);
          setSearchResults([]);
          return;
        }

        let response;
        if (sreachtype == "User") {
          response = await WebsiteApi.searchUsers(value);
        } else if (sreachtype == "Video") {
          response = await WebsiteApi.searchVideos(value);
        } else if (sreachtype == "Quicky") {
          response = await WebsiteApi.searchReels(value);
        } else if (sreachtype == "Post") {
          response = await WebsiteApi.searchPostsOnTimeline(value);
        } else if (sreachtype == "Job") {
          response = await WebsiteApi.searchJobPosts(value);
        }
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setActionType("Search");
      setShowModel(true);
    }
  };

  const ProfileUrl = async (userId) => {
    const profileUrl = await dispatch(setProfileUrl(userId));
    if (profileUrl) {
      navigate(profileUrl);
    } else {
      console.error("Failed to get profile URL.");
    }
  };

  const handleOptionSelect = (event, selectedOption, clicks) => {
    // Extract the necessary information from the selected option
    if (!selectedOption) {
      return;
    }
    const { label, _id, share_Id, title } = selectedOption;
    if (_id !== "See_All") {
      if (title == undefined) {
        dispatch(setSearch_data(inputValue));
      } else {
        dispatch(setSearch_data(title));
      }
    }

    if (sreachtype == "User" && (event.key === "Enter" || clicks == "sreach_icon")) {
      navigate(`/website-user-list`);
      return; // Exit the function after navigating
    } else if (sreachtype == "Video" && (event.key === "Enter" || clicks == "sreach_icon")) {
      navigate(`/website-video-list`);
      return; // Exit the function after navigating
    } else if (sreachtype == "Quicky" && (event.key === "Enter" || clicks == "sreach_icon")) {
      navigate(`/website-reels-filter-list/1`);
      return; // Exit the function after navigating
    } else if (sreachtype == "Post" && (event.key === "Enter" || clicks == "sreach_icon")) {
      navigate(`/website-timeline-list`);
      return; // Exit the function after navigating
    } else if (sreachtype == "Job" && (event.key === "Enter" || clicks == "sreach_icon")) {
      navigate(`/website-job-list`);
      return; // Exit the function after navigating
    }
    // Navigate based on the label value
    switch (label) {
      case "User List":
        ProfileUrl(_id);
        break;
      case "Video List":
        navigate(`/website-video-comment/${_id}`);
        break;
      case "Quicky List":
        navigate(`/website-reels-filter-list/${share_Id}`);
        break;
      case "Timeline List":
        navigate(`/website-timeline-comment/${_id}`);
        break;
      case "Job List":
        navigate(`/website-job-list`);
        break;
      default:
        // Handle default case or do nothing
        break;
    }
  };

  const groupByStyles = {
    height: "40vh", // Set the height to 10vh for the groupBy div
    overflowY: "auto", // Add overflow scroll
  };

  return (
    <Grid container mt={1}>
      <Grid item xs={12} md={12} sx={{ padding: "8px" }}>
        <Paper sx={{ display: "flex" }} className="sreach_bar_paper">
          <Autocomplete
            freeSolo
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              if (event.key === "Enter") {
                handleOptionSelect(event, inputValue, "enter");
              } else {
                handleOptionSelect(event, newValue, "click");
              }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            noOptionsText="No Option Found"
            id="controllable-states-demo"
            options={searchResults}
            groupBy={(option) => option?.label || ""}
            getOptionLabel={(option) => option?.title || value}
            getOptionSelected={(option, value) => option._id === value._id}
            sx={{ width: "100%", cursor: "pointer" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search ..."
                onChange={(event) => handleSearch(event, event.target.value)}
                InputProps={{
                  ...params.InputProps,
                  onFocus: () => setIsFocused(true),
                  onBlur: () => setIsFocused(false),
                  style: {
                    paddingRight: "10px",
                    height: "45px",
                    background: "white",
                    cursor: "pointer",
                  },
                  className: `${isFocused ? "TextField_Focus" : ""}`,
                  endAdornment: (
                    <span style={{ display: "flex" }}>
                      <IconButton type="button" aria-label="search">
                        {searchValue && (
                          <span style={{ marginRight: "10px" }} onClick={() => handleSearchNull()}>
                            <RxCross2 />
                          </span>
                        )}
                      </IconButton>
                      <IconButton type="button" aria-label="search">
                        <span
                          onClick={(event) => handleOptionSelect(event, inputValue, "sreach_icon")}
                        >
                          <SearchIcon />
                        </span>
                      </IconButton>
                    </span>
                  ),
                }}
              />
            )}
          />
          <FormControl sx={{ ml: 1, minWidth: 120 }}>
            <InputLabel id="demo-select-small-label">Type</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={sreachtype || ""}
              label="Type"
              onChange={handleChangeSreachtype}
              sx={{ height: "45px", cursor: "pointer", background: "white" }}
            >
              <MenuItem value={"User"}>User</MenuItem>
              <MenuItem value={"Video"}>Video</MenuItem>
              <MenuItem value={"Quicky"}>Quicky</MenuItem>
              <MenuItem value={"Post"}>Post</MenuItem>
              <MenuItem value={"Job"}>Job</MenuItem>
            </Select>
          </FormControl>
        </Paper>
        {showModel && (
          <AuthModel
            message={actionType === "Search" ? "Sign in to search user." : ""}
            heading={actionType === "Search" ? "Search user?" : ""}
            onClose={() => setShowModel(false)}
          />
        )}
      </Grid>
    </Grid>
  );
}
