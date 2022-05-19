import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCztU-BTBW-mxwe6oeKN0UYy_yZzQw6gwE",
    authDomain: "auksjonsside.firebaseapp.com",
    projectId: "auksjonsside",
    storageBucket: "auksjonsside.appspot.com",
    messagingSenderId: "338912984506",
    appId: "1:338912984506:web:ef223d6a4e0276ad06b183",
    measurementId: "G-XGP85TRYV9"
}

const firebase = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore()

export { firebase, auth, db }