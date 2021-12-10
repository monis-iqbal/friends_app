import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, getDocs, query,where } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAkcYRZ2IBuR1ksBrRJ8vdDpqoTcaGGcik",
  authDomain: "friends-53dfc.firebaseapp.com",
  projectId: "friends-53dfc",
  storageBucket: "friends-53dfc.appspot.com",
  messagingSenderId: "356004502531",
  appId: "1:356004502531:web:b80abccf429b175f14c236",
  measurementId: "${config.measurementId}"
});

const auth = getAuth();
const db = getFirestore(firebaseApp);
// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

// Create a storage reference from our storage service
const storageRef = ref(storage);



export {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    storage,
    storageRef,
   

    db,
    doc,
    setDoc,
    getDoc,
    addDoc,
    collection,
    getDocs,
    query,
    where
};