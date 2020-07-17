import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCaf30yoRuJZqqRMWz_QYKohgWszNcww5U",
    authDomain: "texter-4c0a7.firebaseapp.com",
    databaseURL: "https://texter-4c0a7.firebaseio.com",
    projectId: "texter-4c0a7",
    storageBucket: "texter-4c0a7.appspot.com",
    messagingSenderId: "130023177728",
    appId: "1:130023177728:web:ec9fc6f57c3fc5892fe2e5",
    measurementId: "G-Y1K2Z0GJ84"
}

firebase.initializeApp(config)

export const auth = firebase.auth
export const db = firebase.database()
