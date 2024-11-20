// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "fakeApiKey",
  authDomain: "fakeAuthDomain",
  databaseURL: "https://fake-database-url.com",
  projectId: "fakeProjectId",
  storageBucket: "fakeStorageBucket",
  messagingSenderId: "fakeMessagingSenderId",
  appId: "fakeAppId",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };