importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyANAvb0x8pM8rc0zKru8fq0CNFiIOttqoc",
  authDomain: "international-schooling-app.firebaseapp.com",
  projectId: "international-schooling-app",
  storageBucket: "international-schooling-app.appspot.com",
  messagingSenderId: "718684029735",
  appId: "1:718684029735:web:b7969be0689423ccae1f02"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  const data = payload.data || {};
  const title = (payload.notification && payload.notification.title) || data.title || "School notice";
  const body = (payload.notification && payload.notification.body) || data.body || "";
  return self.registration.showNotification(title, {
    body: body,
    icon: "/static/theme2/images/favicon.ico",
    data: data
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
