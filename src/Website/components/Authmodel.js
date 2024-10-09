import React, { useState } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Button from "@mui/joy/Button";
import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/joy/styles";
import { Link } from "react-router-dom";

export default function AuthModel({ message, heading, onClose }) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false); // Close the modal
    onClose(); // Call the onClose function
  };

  return (
    <ThemeProvider>
      <div>
        <Modal open={open} onClose={handleClose}>
          <ModalDialog>
            <ModalClose />
            <DialogTitle sx={{ marginTop: "20px" }}>{heading}</DialogTitle>
            <DialogContent>
              <p>{message}</p>
              <Link to="/website-login" style={{ textDecoration: "none", color: "inherit" }}>
                <Button className="subcribe_button rounded-pill">Sign in</Button>
              </Link>
            </DialogContent>
          </ModalDialog>
        </Modal>
      </div>
    </ThemeProvider>
  );
}

AuthModel.propTypes = {
  message: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
