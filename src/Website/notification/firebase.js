// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { WebsiteApi } from "Api/WebsiteApi";

// var firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// initializeApp(firebaseConfig);

// const messaging = getMessaging();
// let isWebsiteNotificationCalled = false;

// export const RequestForToken = async () => {
//   return getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY })
//     .then((token) => {
//       if (token && !isWebsiteNotificationCalled) {
//         const websiteNotification = async (token) => {
//           try {
//             const response = await WebsiteApi.websiteNotificationToken(token);
//           } catch (error) {
//             //console.error("Error saving message:", error);
//           }
//         };

//         // Call websiteNotification function with the obtained token
//         websiteNotification(token);

//         isWebsiteNotificationCalled = true; // Mark as called

//         //console.log("Current token for client: ", token);
//         // Perform any other necessary action with the token
//       } else {
//         // Show permission request UI
//         // console.log("");
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { WebsiteApi } from "Api/WebsiteApi";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID,
};

initializeApp(firebaseConfig);

const messaging = getMessaging();
let isWebsiteNotificationCalled = false;

export const RequestForToken = async () => {
  try {
    // Check notification permission
    const permission = Notification.permission;
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
      if (token && !isWebsiteNotificationCalled) {
        await WebsiteApi.websiteNotificationToken(token);
        isWebsiteNotificationCalled = true; // Mark as called
        // console.log("Current token for client: ", token);
      }
    } else if (permission === "default") {
      // Permission not granted, ask the user
      const permissionResult = await Notification.requestPermission();
      if (permissionResult === "granted") {
        const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
        if (token && !isWebsiteNotificationCalled) {
          await WebsiteApi.websiteNotificationToken(token);
          isWebsiteNotificationCalled = true; // Mark as called
          // console.log("Current token for client: ", token);
        }
      } else {
        console.log("User denied notification permission.");
      }
    } else {
      console.log("Notification permission is denied.");
    }
  } catch (err) {
    console.error("Error requesting token: ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
