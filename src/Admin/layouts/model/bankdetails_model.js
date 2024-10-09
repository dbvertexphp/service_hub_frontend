import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";

ScrollDialog.propTypes = {
  descriptionsModelShow: PropTypes.bool,
  handleClose: PropTypes.bool,
  DescriptionsData: PropTypes.string,
};

export default function ScrollDialog({ descriptionsModelShow, handleClose, DescriptionsData }) {
  const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  console.log(DescriptionsData);

  return (
    <React.Fragment>
      <Dialog
        open={descriptionsModelShow}
        handleClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title" className="scroll-dialog-title-admin">
          Bank Details
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {DescriptionsData ? (
              <div>
                <div style={{ display: "flex" }}>
                  <Typography>Name - </Typography>{" "}
                  <Typography className="admin_bank_details">
                    {" "}
                    &nbsp;{DescriptionsData.name}
                  </Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <Typography>Bank Name - </Typography>{" "}
                  <Typography className="admin_bank_details">
                    {" "}
                    &nbsp;{DescriptionsData.bankName}
                  </Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <Typography>Account Number - </Typography>{" "}
                  <Typography className="admin_bank_details">
                    {" "}
                    &nbsp;{DescriptionsData.accountNumber}
                  </Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <Typography>IFSC Code - </Typography>{" "}
                  <Typography className="admin_bank_details">
                    {" "}
                    &nbsp;{DescriptionsData.ifscCode}
                  </Typography>
                </div>
                <div style={{ display: "flex" }}>
                  <Typography>Branch Name - </Typography>{" "}
                  <Typography className="admin_bank_details">
                    {" "}
                    &nbsp;{DescriptionsData.branchName}
                  </Typography>
                </div>
              </div>
            ) : (
              <Typography>No details found</Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
