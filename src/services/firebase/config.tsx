import firebase from "firebase/compat/app"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyADlD6kB-Bgn1kmyp85k_a9ONABbXz0ga8",
  authDomain: "talent-trace-inter.firebaseapp.com",
  projectId: "talent-trace-inter",
  storageBucket: "talent-trace-inter.appspot.com",
  messagingSenderId: "796153284508",
  appId: "1:796153284508:web:532b4b917a05e8665fea59",
}

if (!firebase.apps.length) {
  console.log("Conectando...")
  firebase.initializeApp(firebaseConfig)
  console.log("Conectado")
}

export default firebase
