// firebase-config.js

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "benditaoferta2.firebaseapp.com",
    projectId: "benditaoferta2",
    storageBucket: "benditaoferta2.appspot.com",
    messagingSenderId: "673869502703",
    appId: "1:673869502703:web:a99d57033809f2131b631a"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const postsRef = db.collection('posts');
const auth = firebase.auth(app);