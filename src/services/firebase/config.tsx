import firebase from "firebase/compat/app"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDoXGF4OMjELpE4k3x8_u3fzgac2gcmDTY",
  authDomain: "web-talent-trace.firebaseapp.com",
  projectId: "web-talent-trace",
  storageBucket: "web-talent-trace.appspot.com",
  messagingSenderId: "873916493767",
  appId: "1:873916493767:web:d876d794912ee12816f3e2",
}

if (!firebase.apps.length) {
  console.log("Conectando...")
  firebase.initializeApp(firebaseConfig)
  console.log("Conectador")
}

export default firebase
