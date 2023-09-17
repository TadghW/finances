import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVmdsc2NpdzSy3IvxBm1Fix7vvxlzIW7w",
  authDomain: "financeshub-fc899.firebaseapp.com",
  projectId: "financeshub-fc899",
  storageBucket: "financeshub-fc899.appspot.com",
  messagingSenderId: "679433400658",
  appId: "1:679433400658:web:c8d254e116102755f74a8b",
  measurementId: "G-C23SD75YN9"
};

export const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);

export default firebase;

