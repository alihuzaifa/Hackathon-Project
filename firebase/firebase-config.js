import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzbVvwgUCoVABN_26t_WLR4Xrq3CbyihM",
  authDomain: "admin-portel-for-coaching.firebaseapp.com",
  projectId: "admin-portel-for-coaching",
  storageBucket: "admin-portel-for-coaching.appspot.com",
  messagingSenderId: "383682195113",
  appId: "1:383682195113:web:e49cab7ecd63aabcd103b8",
  measurementId: "G-P4657KW0NB"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)
export { app, auth, db, storage }