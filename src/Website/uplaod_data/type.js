import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Video_icon from "../../assets/website_img/video_uplaod.svg";
import Reels_icon from "../../assets/website_img/reel_uplaod.svg";
import Timeline_icon from "../../assets/website_img/timeline_uplaod.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 10,
  p: 2,
};

UploadData.propTypes = {
  onClose: PropTypes.func,
};

export default function UploadData({ onClose }) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" className="uplaod_model_Heading">
              Uplaod
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2, display: "flex" }}>
              <Card sx={{ width: "100%" }}>
                <CardContent className="card-content">
                  <span>
                    <Link to="/website-video-uplaod">
                      <img
                        src={Video_icon}
                        alt="page"
                        style={{ cursor: "pointer" }}
                        className="Uplaod_icon_model"
                        onClick={handleClose}
                      />
                    </Link>
                    <Typography className="uplaod_model_text">Video</Typography>
                  </span>
                  <span>
                    <Link to="/website-reels-uplaod">
                      <img
                        src={Reels_icon}
                        alt="page"
                        style={{ cursor: "pointer" }}
                        className="Uplaod_icon_model"
                        onClick={handleClose}
                      />
                    </Link>
                    <Typography className="uplaod_model_text">Quicky</Typography>
                  </span>

                  <span>
                    <Link to="/website-post-uplaod">
                      <img
                        src={Timeline_icon}
                        alt="page"
                        style={{ cursor: "pointer" }}
                        className="Uplaod_icon_model"
                        onClick={handleClose}
                      />
                    </Link>
                    <Typography className="uplaod_model_text">Post</Typography>
                  </span>
                </CardContent>
              </Card>
            </Typography>
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <Button className="close_button rounded-pill" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
