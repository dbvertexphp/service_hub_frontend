import * as React from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Button from "@mui/joy/Button";
import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/joy/styles";

export default function DraggableDialog({
  onClose,
  onSubscribe,
  message,
  heading,
  ButtonText,
  ButtonValue,
}) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    onSubscribe("Cancel");
    onClose();
    setOpen(false);
  };

  const SubscribeUser = (ButtonValue) => {
    onSubscribe(ButtonValue);
    setOpen(false);
  };

  return (
    <ThemeProvider>
      <React.Fragment>
        <Modal open={open} onClose={handleClose}>
          <ModalDialog>
            <ModalClose onClick={handleClose} />
            <DialogTitle sx={{ marginTop: "20px" }}>{heading}</DialogTitle>
            <DialogContent>
              <p>{message}</p>
            </DialogContent>
            <DialogActions>
              <Button
                className="subcribe_button rounded-pill"
                onClick={() => SubscribeUser(ButtonValue)}
              >
                {ButtonText}
              </Button>
              <Button className="subcribe_button rounded-pill" autoFocus onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>
          </ModalDialog>
        </Modal>
      </React.Fragment>
    </ThemeProvider>
  );
}

DraggableDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubscribe: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  ButtonText: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  ButtonValue: PropTypes.string.isRequired,
};
