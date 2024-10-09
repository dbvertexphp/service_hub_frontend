import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { getUserdataCookie, checkCookies, deleteCookie, setCookie } from "../../cookies";
const base_url = process.env.REACT_APP_BASE_URL;

const SweetAlertComponent = () => {
  useEffect(() => {
    const showAlert = async () => {
      await Swal.fire({
        title: "Session Expired",
        text: "Admin has deactivated you please contact admin",
        icon: "warning",
        background: "#fff",
        backdrop: `
          rgb(0 0 0 / 88%)
          left top
          no-repeat
        `,
        willClose: () => {
          Okdone();
        },
      });
    };

    showAlert();
  }, []);

  const Okdone = () => {
    deleteCookie("Userdata");
    deleteCookie("Websitetoken");
    window.location.href = base_url;
  };

  return null;
};

export default SweetAlertComponent;
