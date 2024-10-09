importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyApp12b-h4sY_PLG7EeeYVSmav3TQx2mVI",
  authDomain: "tobuu-d4578.firebaseapp.com",
  projectId: "tobuu-d4578",
  storageBucket: "tobuu-d4578.appspot.com",
  messagingSenderId: "727314761090",
  appId: "1:727314761090:web:02097a5f9582889e933b9b",
  measurementId: "G-MQLDCFZ0RQ",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();
const channel = new BroadcastChannel("notificationChannel");

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  channel.postMessage({ type: "notificationReceived", payload: payload });
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    image: payload.data.image, // Add image if available
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click event
self.addEventListener("notificationclick", function (event) {
  const notification = event.notification;
  const url = notification.data.url; // Extract dynamic URL from notification data payload

  // Redirect to the specified URL
  event.waitUntil(clients.openWindow(url));
});
