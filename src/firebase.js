import { getStorage} from "firebase/storage";
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCroSFWt9BwtnUTDdiGkZPa_qkr0Mvro90",
  authDomain: "chat-5e479.firebaseapp.com",
  projectId: "chat-5e479",
  storageBucket: "chat-5e479.appspot.com",
  messagingSenderId: "945553491165",
  appId: "1:945553491165:web:32fc39756b571a453dc734"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore()
