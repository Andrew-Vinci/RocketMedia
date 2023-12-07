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


    const toMessages = document.querySelector('.toMessages')
    toMessages.addEventListener('click', async (e) =>{
        console.log("Working")
        window.location.href = 'messaging.html'; // Replace with the actual path
    })


    /*

    // #1
    // DISPLAYS USERS FOR FRIEND SUGGESTIONS
    // NEEDS AN ALGORITHM FOR FRIEND MATHCHING
    const friendsList = document.querySelectorAll('.friends_list button')
    const userCollection = collection(db, 'users')
    let users = []
    const uidMap = new Map()

    onSnapshot(userCollection, async (snapshot) => {

        // get each user inside the collection and put into an array
        users = []
        snapshot.docs.forEach((doc) => {
            users.push({ ...doc.data(), id: doc .id })
        })

        // diplaying users currently
        for(let i = 0; i < friendsList.length; i++){
            if (users[i] && users[i].userName) {

                const checkUID = users[i].uid
                const user = auth.currentUser;

                if(user){
                    const friendDocRef = doc(db, 'friendsList', auth.currentUser.uid, 'friends', checkUID);
                    const friendDoc = await getDoc(friendDocRef);

                    const notificationSent = doc(db, 'notifications', checkUID, 'friendRequests', auth.currentUser.uid)
                    const checkNotification = await getDoc(notificationSent)

                    // Checks if user is already friend, is current user, or if a notification already exists. Prevents repeat.
                    if(friendDoc.exists() ||  checkUID == auth.currentUser.uid || checkNotification.exists()){
                        continue
                    }

                    friendsList[i].textContent = users[i].userName;
                    uidMap.set(users[i].userName, users[i].uid);

                } else {
                    friendsList[i].textContent = "User not found";
                }
            }
        }
    })

    // #2
    // ACCESSES ALL BUTTONS IN THE FRIEND SUGGESTIONS SECTION
    const buttonsContainer = document.querySelector('.friends_list');
    buttonsContainer.addEventListener('click', async (e) =>{
        e.preventDefault()

        const user = auth.currentUser

        console.log(user.uid)
        
        // Need signed in users username to 
        const userDocRef = doc(db, 'users', user.uid);
    
        // 2. Fetch the document
        const userDocSnap = await getDoc(userDocRef);

        const userData = userDocSnap.data();
        const name = userData.userName;

        // Get name off of button
        const buttonText = e.target.textContent;

        for(let i = 0; i < users.length; i++){
            if(users[i].userName == buttonText){
                
                e.target.style.display = 'none'
                return setDoc(doc(db, 'notifications', users[i].id, 'friendRequests', user.uid), {
                    // could potentiall be removed in future, may not need values
                    acceptRequest: false,
                    userName: name,
                })
                .then(() => {
                    return updateDoc(doc(db, 'notifications', users[i].id), {
                        frCount: increment(1),
                        frNotify: true
                })
            })
         }
    }
})

*/








/* 2/4 - Halfway */
/* ---------------------------------------------------------------------------------------------------------------- */

/*
// SHOW THE FRIEND REQUEST COUNT
// GETS USER AUTH STATE CHANGE
const notify = document.querySelector('.notifyCount')
auth.onAuthStateChanged(user => {
    if (user) {
      const uid = user.uid;
      
      const userNotification = doc(db, 'notifications', uid)
      onSnapshot(userNotification, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            if (data && data.frCount !== undefined) {
                notify.textContent = data.frCount;
                console.log(data.frCount);
            } else {
                console.log("frCount is undefined or null.");
            }
        } else {
            console.log("Document does not exist.");
        }
    })
    } else {
      console.log("No user is signed in.");
    }
  });
 



  // SHOWS THE FRIEND REQUEST USERNAME IN A DROP DOWN MENU
  // NEED TO BETTER UNDERSTAND THIS FUNCTION
const frSelect = document.querySelector('.frSelect')
auth.onAuthStateChanged(user => {
    if (user) {
        const uid = user.uid;
        const friendRequestsCollectionRef = collection(db, 'notifications', uid, 'friendRequests');
        const friendRequestsQuery = query(friendRequestsCollectionRef, where('acceptRequest', '==', false));

        // Using onSnapshot for real-time updates
        onSnapshot(friendRequestsQuery, (querySnapshot) => {
            // Clear existing options
            frSelect.innerHTML = '';

            if(querySnapshot.empty){
                const option = document.createElement('option')
                option.value = null
                option.textContent = "No Requests"
                frSelect.appendChild(option)
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const option = document.createElement('option')
                option.value = doc.id
                option.textContent = data.userName
                frSelect.appendChild(option)
            });
        }, (err) => {
            console.log(err.message)
        });
    } else {
        console.log("No user is signed in.");
    }
});


*/

    /* Accept/Decline Requests */
    /* ---------------------------------------------------------------------------------------------------------------- */


    /*
    // ACCEPT FRIEND REQUEST
    const acceptFr = document.querySelector('.acceptFr')
    acceptFr.addEventListener('click', () => {

        const uid = auth.currentUser.uid
        const usersDB = doc(db, 'users', uid);
        let senderId = frSelect.value;

        // Fetch the sender's username from the database
        getDoc(usersDB)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const senderData = docSnapshot.data();
                const signedInUserName = senderData.userName;
    
                // Fetch the recipient's username (if needed)
                // Replace 'recipientId' with the recipient's ID as needed
                const recipientDB = doc(db, 'users', senderId);
                return getDoc(recipientDB)
                .then((recipientDocSnapshot) => {
                    if (recipientDocSnapshot.exists()) {
                        const recipientData = recipientDocSnapshot.data();
                        const recipientUserName = recipientData.userName;
    
                        // Add the sender to the recipient's friend list
                        const signedInFriendsListRef = doc(db, 'friendsList', uid, 'friends', senderId);
                        const senderFriendsListRef = doc(db, 'friendsList', senderId, 'friends', uid);
    
                        const batch = writeBatch(db);

                        // Set each user to the other users friends list
                        batch.set(signedInFriendsListRef, {
                            name: recipientUserName
                        });
                        batch.set(senderFriendsListRef, {
                            name: signedInUserName
                        });
    
                        // Update notifications for user who received friend request
                        batch.update(doc(db, 'notifications', uid, 'friendRequests', senderId), {
                            acceptRequest: true
                        });
                        batch.update(doc(db, 'notifications', uid), {
                            frCount: increment(-1)
                        });
    
                        return batch.commit();
                    } else {
                        console.log("Recipient data not found.");
                    }
                })
            } else {
                console.log("Sender data not found.");
            }
        })
        .catch((error) => {
            console.error("Error getting user data: ", error);
        });
    });

    // DECLINE FRIEND REQUEST
    const declineFr = document.querySelector('.rejectFr')
    declineFr.addEventListener('click', () =>{
        const uid = auth.currentUser.uid
        let senderId = frSelect.value;
        const deleteFr = doc(db, 'notifications', uid, 'friendRequests', senderId)
        deleteDoc(deleteFr)
        updateDoc(doc(db, 'notifications', uid), {
                frCount: increment(-1),
                frNotify: false
        })
    })
    
    */