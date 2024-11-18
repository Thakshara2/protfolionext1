import { initializeApp, type FirebaseApp } from "firebase/app";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyArDmejhz9Qo23OY9mkAzZS7KGiOaAMm30",
  authDomain: "paka-833c8.firebaseapp.com",
  projectId: "paka-833c8",
  storageBucket: "paka-833c8.appspot.com",
  messagingSenderId: "420327336003",
  appId: "1:420327336003:web:4c045d3ee0bb819c714cf6"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
export const storage: FirebaseStorage = getStorage(app); 