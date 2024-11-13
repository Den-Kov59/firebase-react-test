/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "test-app-cbb2d.firebaseapp.com",
  projectId: "test-app-cbb2d",
  storageBucket: "test-app-cbb2d.firebasestorage.app",
  messagingSenderId: "110679803978",
  appId: "1:110679803978:web:69f5c38b379a7255b5beb3"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Add a listener to handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // You can customize this to any icon of your choice
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});