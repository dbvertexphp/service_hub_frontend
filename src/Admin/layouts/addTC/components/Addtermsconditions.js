import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "@mui/material/Button";
import MDBox from "Admin/components/MDBox";
import MDSnackbar from "Admin/components/MDSnackbar";
import { Api } from "Api/Api";
import { useNavigate } from "react-router-dom";

function AddUserForm() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [successSB, setSuccessSB] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Terms Conditions content when the component mounts
    const token = localStorage.getItem("token");
    Api.getTermsConditions(token)
      .then((response) => {
        if (response.status) {
          setContent(response.content);
        } else {
          console.error("Error fetching Terms Conditions:", response.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching Terms Conditions:", error);
      });
  }, []); // The empty dependency array ensures that this effect runs only once

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Add Terms Conditions"
      content="Add Terms Conditions Successfully"
      dateTime="0 Sec ago"
      open={successSB}
      onClose={() => {
        //navigate("/category-list");
      }}
      close={() => {
        //navigate("/category-list");
      }}
      bgWhite
    />
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate fields
    const newErrors = {};
    if (content.trim() === "") {
      newErrors.content = "Terms Conditions is required";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const token = localStorage.getItem("token");
      Api.addTermsConditions(content, token)
        .then((response) => {
          if (response.errors) {
            setErrors(response.errors);
          }
          if (response.status) {
            openSuccessSB();
          } else {
            setErrors(response.errors);
          }
        })
        .catch((error) => {
          setErrors(error);
        });
    }
  };

  const quillStyle = {
    height: "300px",
    marginBottom: "56px",
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <ReactQuill
            style={quillStyle}
            value={content}
            onChange={(value) => setContent(value)}
            suppressWarnings={true}
            fullWidth
          />
          {errors.content && <div style={{ color: "red", fontSize: "15px" }}>{errors.content}</div>}
        </div>

        <MDBox p={2} style={{ textAlign: "center", color: "white" }} lineHeight={0}>
          <Button variant="contained" color="primary" type="submit">
            Add Terms Conditions
          </Button>
        </MDBox>
        {renderSuccessSB}
      </form>
    </div>
  );
}

export default AddUserForm;
