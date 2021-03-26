import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyDev71gYxLd7Fcp4q7xuZAPtrtd72eqJng",
  authDomain: "vue3-todo-practice10.firebaseapp.com",
  projectId: "vue3-todo-practice10",
  storageBucket: "vue3-todo-practice10.appspot.com",
  messagingSenderId: "814270831533",
  appId: "1:814270831533:web:aee8742c08d372d6da5f24",
  measurementId: "G-LLNFV9QVJQ"
}

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
firebase.analytics()

export const db = firebaseApp.firestore()