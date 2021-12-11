// Initialize Firebase Web App Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmTeQdQwvCmO-ADvgOS-ku3ciWATYyj00",
    authDomain: "espasyo-web-testing.firebaseapp.com",
    projectId: "espasyo-web-testing",
    storageBucket: "espasyo-web-testing.appspot.com",
    messagingSenderId: "766216641228",
    appId: "1:766216641228:web:ed7fd89183d00911574069"
};
//initialize firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.firestore();
