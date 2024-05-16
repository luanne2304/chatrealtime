// Import the functions you need from the SDKs you need
const { initializeApp } =require("firebase/app");
const {getAuth, GoogleAuthProvider} =require("firebase/auth")
const {getStorage} =require('firebase/storage')

const firebaseConfig = {
  apiKey: "AIzaSyB9DXMhq_zmGkdvxM2hvW8RB3ASID1wqq4",
  authDomain: "recuitwebsite-76dec.firebaseapp.com",
  projectId: "recuitwebsite-76dec",
  storageBucket: "recuitwebsite-76dec.appspot.com",
  messagingSenderId: "91066045086",
  appId: "1:91066045086:web:1552f35decb8387276e18f",
  measurementId: "G-7E6ZCFX83R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider= new GoogleAuthProvider()
const storage = getStorage(app)

module.exports = {auth, provider,storage}
