// cookiesUtils.js
import Cookies from "js-cookie";

export const setCookie = (key, value, options = {}) => {
  const defaultOptions = {
    expires: 10,
    // ... other options
  };

  const mergedOptions = { ...defaultOptions, ...options };
  Cookies.set(key, value, mergedOptions);
};

export const getCookie = (key) => {
  return Cookies.get(key);
};

export const getUserdataCookie = (key) => {
  const cookieValue = Cookies.get(key);
  if (cookieValue) {
    try {
      return JSON.parse(cookieValue);
    } catch (error) {
      console.error(`Error parsing cookie '${key}':`, error);
    }
  }
  return null;
};

export const checkCookies = () => {
  const websiteToken = Cookies.get("Websitetoken");
  return !!websiteToken; // Returns true if the cookie exists, false otherwise
};

export const deleteCookie = (key) => {
  Cookies.remove(key);
};
