import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  getDatabase,
  onChildAdded,
  ref,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLPkVZ25PQ4jCQ-dxcuJHFeExOy_mUp50",
  authDomain: "blogee-hsk.firebaseapp.com",
  projectId: "blogee-hsk",
  storageBucket: "blogee-hsk.appspot.com",
  messagingSenderId: "233698368195",
  appId: "1:233698368195:web:6e2ec8ec6a90b489656076",
  measurementId: "G-N0XBG3KG6Q",
  databaseURL: "https://blogee-hsk-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rdb = getDatabase(app);
const storage = getStorage(app);

let currentUser = "";
let currentUserId = "";
let currentUserImg = "";

function load(img, profileImg, username, useremail) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.emailVerified) {
      } else {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/";
    }

    if (user !== null) {
      let displayName = user.displayName;
      let email = user.email;
      let photoURL = user.photoURL;
      let id = user.uid;
      currentUserId = id;
      currentUser = displayName;
      currentUserImg = photoURL;

      try {
        img.setAttribute("src", photoURL);
        profileImg.setAttribute("src", photoURL);
        username.innerHTML = displayName;
        useremail.innerHTML = email;
      } catch (error) {
        // console.error(error);
      }
    }
  });
}

function logout(btn) {
  btn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        load();
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

export {
  ref,
  rdb,
  load,
  logout,
  auth,
  onChildAdded,
  db,
  storage,
  currentUserId,
  currentUser,
  currentUserImg,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  deleteUser,
  signOut,
};
