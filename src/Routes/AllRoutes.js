import React, { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "Admin/components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "Admin/examples/Sidenav";
import Configurator from "Admin/examples/Configurator";
import "../App.css";
import "../Website.css";
import "../Website/css/Video.css";
import "../Website/css/Post.css";
import "video-react/dist/video-react.css";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import AdminRoutes from "Routes/AdminRoutes";
import WebsiteRoutes from "Routes/WebsiteRoutes";
import Home from "Website/page/home";
import SignIn from "Admin/layouts/authentication/sign-in";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route

  const pathname = window.location.pathname;
  const isWebsiteSection = pathname === "/" && pathname.includes("website");

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit" sx={{ display: "none" }}>
        settings
      </Icon>
    </MDBox>
  );

  function getRoutes(routes) {
    if (!routes) {
      return null;
    }
  }
  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <Routes>
        {WebsiteRoutes.map((route) => {
          if (route.type === "Home") {
            return <Route key={route.key} path={route.route} element={<SignIn />} />;
          } else if (route.type === "AuthRoutes") {
            return <Route key={route.key} path={route.route} element={route.component} />;
          } else if (route.type === "collapse") {
            return (
              <React.Fragment key={route.key}>
                <Route
                  path={route.route}
                  element={
                    <>
                      {layout === "dashboard" && (
                        <>
                          <Sidenav
                            color={sidenavColor}
                            brand={
                              (transparentSidenav && !darkMode) || whiteSidenav
                                ? brandDark
                                : brandWhite
                            }
                            brandName="Material Dashboard 2"
                            routes={AdminRoutes}
                            onMouseEnter={handleOnMouseEnter}
                            onMouseLeave={handleOnMouseLeave}
                          />
                          <Configurator />
                        </>
                      )}
                      {route.component}
                    </>
                  }
                />
              </React.Fragment>
            );
          } else if (route.type === "WebsiteRoutes") {
            return <Route key={route.key} path={route.route} element={<Home />} />;
          }
          return null; // Handle undefined case
        })}
        <Route path="/admin" element={<Navigate to="/admin" />} />
      </Routes>
    </ThemeProvider>
  );
}
