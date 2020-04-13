importScripts('https://www.gstatic.com/firebasejs/7.5.2/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.5.2/firebase-messaging.js')
const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
}

firebase.initializeApp(config)

const messaging = firebase.messaging()
