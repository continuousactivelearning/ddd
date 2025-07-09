
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"; 

const firebaseConfig = {

  apiKey: "AIzaSyAn6I6dfWDvX6S8Ju59MBtxbBDdjpwJP7o",

  authDomain: "peerevaluation-dd8d8.firebaseapp.com",

  projectId: "peerevaluation-dd8d8",

  storageBucket: "peerevaluation-dd8d8.firebasestorage.app",

  messagingSenderId: "651851550941",

  appId: "1:651851550941:web:957c2cc3498a5104130b34"

};




const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(); 
export default app;
