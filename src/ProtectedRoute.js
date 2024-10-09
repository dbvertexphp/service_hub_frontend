import React from "react";
import { Route, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
ProtectedRoute.propTypes = {
  element: PropTypes.element, // Add propTypes for the 'element' prop
};

function ProtectedRoute({ element }) {
  const isAuthenticated = localStorage.getItem("token") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return element;
}

export default ProtectedRoute; // Yahaan par export kar rahe hain
