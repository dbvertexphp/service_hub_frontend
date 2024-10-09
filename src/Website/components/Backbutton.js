import Button from "@mui/material/Button";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function Backbutton(props) {
  const navigate = useNavigate();
  const reduxBackButtonReel = useSelector((state) => state.userActivity.BackButtonReel);

  const handleBack = () => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/"); // Path ko '/' ke hisaab se split karein
    const pathWithoutId = pathParts.filter((part) => !part.match(/^[0-9a-fA-F]{24}$/)).join("/");
    if (
      props.onClick === undefined &&
      (pathWithoutId == "/website-my-profile-view" ||
        pathWithoutId == "/Website-user-profile-view") &&
      reduxBackButtonReel == 1
    ) {
      navigate(1);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button onClick={handleBack} className="backbutton_btn" sx={{ justifyContent: "left" }}>
      <span className="back_btn_txt">
        <img alt="Back" style={{}} srcSet="/assets/icons/back_2.png" />{" "}
      </span>
    </Button>
  );
}

// Prop types validation
Backbutton.propTypes = {
  onClick: PropTypes.func,
};

export default Backbutton;
