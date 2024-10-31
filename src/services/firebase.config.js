import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDj2_l3HBJBqV1AFPYBtHdNdpge0TVLVo",
  authDomain: "mymegaminds-1effe.firebaseapp.com",
  projectId: "mymegaminds-1effe",
  storageBucket: "mymegaminds-1effe.appspot.com",
  messagingSenderId: "464869267466",
  appId: "1:464869267466:web:de2db737239b78bad667f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);