console.log("Working")


import {
    initializeApp // connects to firebase backend Video #3
} from 'firebase/app'

import {
    getFirestore, // initializes firestore Video #4
    collection,   // get a reference to collections Video #4
    getDocs,      // gets a collection of data back from the database Video #4

    addDoc,      // adds documents to a collection Video #5
    deleteDoc,   // deletes a document in a collection Video #5
    doc,         // gets a reference to a document Video #5

    onSnapshot,  // sets up a real time listener to update page Video #6

    query,      // query specific data Video #7
    where,      // use with query Video #7
    orderBy,    // orders data Video #8
    serverTimestamp,  // timestamp Video #8
    getDoc,      // grabs a single documents vs a collegtion like getDocs Video #9
    updateDoc,  // update an indvidual document Video #10
    setDoc,
    increment,
    writeBatch
} from 'firebase/firestore'

import {
    getAuth,    // gets authentication from firebase Video #11
    createUserWithEmailAndPassword, // creates a user with email and password values Video #12
    signOut,    // logout a user Video #13
    signInWithEmailAndPassword,  // signs a user in Video #13

} from 'firebase/auth'

//import './msgLogic.js'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBRy9uHMmH84Nx4ylqSglnojDPm2fhZONw",
    authDomain: "fir-tutorial1-d6c97.firebaseapp.com",
    projectId: "fir-tutorial1-d6c97",
    storageBucket: "fir-tutorial1-d6c97.appspot.com",
    messagingSenderId: "776477025425",
    appId: "1:776477025425:web:c6431e27106719df4ecb30",
    measurementId: "G-20JPQMKYZE"
  };


    initializeApp(firebaseConfig)  // initialize firebase app - Video #3
    const db = getFirestore() // Gets a connection to the database using Firestore Video #4 // initialize services
    const auth = getAuth()// initializes authentication service Video #11
    const user = auth.currentUser;
    let uid = null;

    auth.onAuthStateChanged(user => {
        if (user) {
            uid = user.uid;
            // setupSnapshotListeners();  // Set up snapshot listeners
        } else {
            console.log("No user is signed in.");
            currentUserId = null;  // Reset the user ID
        }
    });


      // SIGN USERS UP
      const signupForm = document.querySelector('.signUpTabletForm')
      signupForm.addEventListener('submit', (e) => {
          e.preventDefault()
  
          const email = signupForm.emailSU.value
          const password = signupForm.passwordSU.value
  
          createUserWithEmailAndPassword(auth, email, password)
              .then((cred) => {
  
                  const user = cred.user
                  const userName = signupForm.usernameSU.value
  
                  console.log('User ID: ', cred.user.uid) // console log #3
  
                  signupForm.reset()
  
                  return setDoc(doc(db, "users", user.uid), {
                      email: user.email,
                      userName: userName,
                      uid: user.uid
                  })
                  .then(() => {
                      return setDoc(doc(db, 'friendsList', user.uid, 'friends', '1111111'), {
                          name: 'placeholder'
                      })
                  })
                  .then(() => {
                      return setDoc(doc(db, 'notifications', user.uid, 'friendRequests', '1111111'), {
                          acceptRequest: false,
                          userName: "placeholder"
                      })
                  })
                  .then(() => {
                      return setDoc(doc(db, 'notifications', user.uid, 'messageRequests', '1111111'), {
                          acceptMessage: false,
                          userName: "placeholder"
                      })
                  })
                  .then(() => {
                      return setDoc(doc(db, 'notifications', user.uid), {
                          frCount: 0,
                          frNotify: false,
                          msgCount: 0,
                          msgNotify: false
                      })
                  })
              })
              .catch((err) => {
                  console.log(err.message)
              })
      })
