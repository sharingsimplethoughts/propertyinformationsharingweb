
// importScripts('https://www.gstatic.com/firebasejs/7.10.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.10.0/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');


firebase.initializeApp({
  
    'messagingSenderId': "hjkh",
   

  });


  const messaging = firebase.messaging();   
  console.log(messaging, "messaging");

