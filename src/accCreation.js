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
    let username = null;

    auth.onAuthStateChanged(async user => {
        if (user) {
            uid = user.uid;

            const userDocRef = doc(db, 'users', uid);

            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    username = userData.userName;
                    console.log('Username:', username);
                } else {
                    console.log('User document does not exist');
                }
            } catch (error) {
                console.error('Error fetching user document:', error);
            }
            // setupSnapshotListeners();
        } else {
            console.log("No user is signed in.");
            currentUserId = null;  // Reset the user ID
        }
    });


    const form = document.querySelector(".accCreationTabletForm");

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = uid;
        const profilePic = e.target.elements.profilePic.value;
        const backgroundPic = e.target.elements.backgroundPic.value;


            // Add data to Firestore
            const docRef = doc(db, 'profile', uid);

            try {
                await setDoc(docRef, {
                    proPic: profilePic,
                    proBack: backgroundPic,
                    username: username
                });

                const postsCollectionRef = collection(docRef, 'posts');

                // Adding initial post to the 'posts' subcollection
                await addDoc(postsCollectionRef, {
                    post: "I Just Joined Rocket Media!",
                    timestamp: serverTimestamp()
                });
                console.log('Profile created successfully!');
                window.location.href = 'userProfile.html';
            } catch (error) {
                console.error('Error writing document: ', error);
            }
    })

