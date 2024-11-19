// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7wJBl4hIvohHXJtWeYfeUC1z709l1F64",
  authDomain: "taslflow.firebaseapp.com",
  databaseURL: "https://taslflow-default-rtdb.firebaseio.com",
  projectId: "taslflow",
  storageBucket: "taslflow.firebasestorage.app",
  messagingSenderId: "531249183179",
  appId: "1:531249183179:web:7ffaf3e5e122c34799de4e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };