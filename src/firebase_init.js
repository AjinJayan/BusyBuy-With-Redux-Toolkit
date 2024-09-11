// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6qxeygGTO4PST1RP7w0YdXgZ4Cx7khLs",
    authDomain: "busybuy-a663d.firebaseapp.com",
    projectId: "busybuy-a663d",
    storageBucket: "busybuy-a663d.appspot.com",
    messagingSenderId: "1048227170534",
    appId: "1:1048227170534:web:4406a3a28b7f6ee1781327"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)