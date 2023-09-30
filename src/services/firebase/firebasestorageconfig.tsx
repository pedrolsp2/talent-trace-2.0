import firebase from "firebase/compat/app"
import "firebase/compat/auth"  
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDoXGF4OMjELpE4k3x8_u3fzgac2gcmDTY",
  authDomain: "web-talent-trace.firebaseapp.com",
  projectId: "web-talent-trace",
  storageBucket: "web-talent-trace.appspot.com",
  messagingSenderId: "873916493767",
  appId: "1:873916493767:web:d876d794912ee12816f3e2",
}

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}
 

export {firebase};