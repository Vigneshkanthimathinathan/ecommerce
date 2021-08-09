import firebase from "firebase/app"
import "firebase/auth"


var firebaseConfig = {
    apiKey: "AIzaSyBezfx8m8nTfakqokIvfWuozp1M2tgM6hc",
    authDomain: "ecommerce-f3fba.firebaseapp.com",
    projectId: "ecommerce-f3fba",
    storageBucket: "ecommerce-f3fba.appspot.com",
    messagingSenderId: "685989587608",
    appId: "1:685989587608:web:2d4f35d4321637dd45beed"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();
  export var provider = new firebase.auth.GoogleAuthProvider();