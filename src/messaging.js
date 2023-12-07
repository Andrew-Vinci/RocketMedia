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
    writeBatch,
    limit
} from 'firebase/firestore'

import {
    getAuth,    // gets authentication from firebase Video #11
    createUserWithEmailAndPassword, // creates a user with email and password values Video #12
    signOut,    // logout a user Video #13
    signInWithEmailAndPassword,  // signs a user in Video #13

} from 'firebase/auth'

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

const userCollection = collection(db, 'users')
let users = []
const uidMap = new Map()



  // REPEAT OF FRIENDS LIST BUT JUST ALLOWS FOR USER TO SEND MESSAGE REQUEST TO OTHER USER
  const messageList = document.querySelectorAll('.message_list button')

  onSnapshot(userCollection, async (snapshot) => {

      // get each user inside the collection and put into an array
      users = []
      snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc .id })
      })

      // diplaying users currently
      for(let i = 0; i < messageList.length; i++){
          if (users[i] && users[i].userName) {

              const checkUID = users[i].uid
              const user = auth.currentUser;

              if(user){
                  const friendDocRef = doc(db, 'friendsList', auth.currentUser.uid, 'friends', checkUID);
                  const friendDoc = await getDoc(friendDocRef);

                  const notificationSent = doc(db, 'notifications', checkUID, 'messageRequests', auth.currentUser.uid)
                  const checkNotification = await getDoc(notificationSent)

                  // Checks if user is already friend, is current user, or if a notification already exists. Prevents repeat.
                  if(friendDoc.exists() ||  checkUID == auth.currentUser.uid || checkNotification.exists()){
                      continue
                  }

                  messageList[i].textContent = users[i].userName;
                  uidMap.set(users[i].userName, users[i].uid);

              } else {
                  messageList[i].textContent = "User not found";
              }
          }
      }
  })

  // ACCESS ALL BUTTONS IN THE MESSAGE SUGGESTIONS SECTION
  // SETS NOTIFICATIONS OF REQUESTEE THAT USER WANTS TO CHAT
  const messageButtons = document.querySelector('.message_list')
  messageButtons.addEventListener('click', async (e) => {
    e.preventDefault()

    // Consider making global variables
    const user = auth.currentUser

    console.log(user.uid)

    const userDocRef = doc(db, 'users', user.uid)

    const userDocSnap = await getDoc(userDocRef)

    const userData = userDocSnap.data()
    const name = userData.userName;

    const buttonText = e.target.textContent

    for(let i = 0; i < users.length; i++){
        if(users[i].userName == buttonText){
            e.target.style.display = 'none'
            return setDoc(doc(db, 'notifications', users[i].id, 'messageRequests', user.uid), {
                acceptRequest: false,
                userName: name,
            })
            .then(() => {
                return updateDoc(doc(db, 'notifications', users[i].id), {
                    msgCount: increment(1),
                    msgNotify: true
                })
            })
        }
    }
  })



      // SHOW THE MESSAGE REQUEST COUNT
      const messageCount = document.querySelector('.messageCount')
      auth.onAuthStateChanged(user => {
          if (user) {
          const uid = user.uid;
          
          const userNotification = doc(db, 'notifications', uid)
          onSnapshot(userNotification, (doc) => {
              if (doc.exists()) {
                  const data = doc.data();
                  if (data && data.msgCount !== undefined) {
                      messageCount.textContent = data.msgCount;
                      console.log(data.msgCount);
                  } else {
                      console.log("messageCount is undefined or null.");
                  }
              } else {
                  console.log("Document does not exist.");
              }
          })
          } else {
          console.log("No user is signed in.");
          }
      });


    // SHOWS THE MESSAGE REQUESTS IN A DROPDOWN
    const messageRequest = document.querySelector('.messageRequest')
    auth.onAuthStateChanged(user => {
      if (user) {
        const uid = user.uid;
  
        const messageRequestsCollectionRef = collection(db, 'notifications', uid, 'messageRequests');
        const messageRequestsQuery = query(messageRequestsCollectionRef, where('acceptRequest', '==', false));
    
        onSnapshot(messageRequestsQuery, (querySnapshot) => {
            messageRequest.innerHTML = '';

            if(querySnapshot.empty){
                const option = document.createElement('option')
                option.value = null
                option.textContent = "No Requests"
                messageRequest.appendChild(option)
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const option = document.createElement('option')
                option.value = doc.id
                option.textContent = data.userName
                messageRequest.appendChild(option)
            });
        }, (err) => {
            console.log(err.message)
        });
        } else {
          console.log("No user is signed in.");
        }
      });


      // ACCEPT REQUEST
      const acceptMR = document.querySelector('.acceptMR')
      const msgRequest = document.querySelector('.messageRequest')
      acceptMR.addEventListener('click', async () =>{

        const uid = auth.currentUser.uid
        const usersDB = doc(db, 'users', uid)
        const userDocSnapshot = await getDoc(usersDB);
        let userName = "";
        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            userName = userData.userName;
        }

        let recipientId = msgRequest.value
        const recipientDB = doc(db, 'users', recipientId)
        const recipientDocSnapshot = await getDoc(recipientDB);
        let recipientUserName = "";
        if (recipientDocSnapshot.exists()) {
            const recipientData = recipientDocSnapshot.data();
            recipientUserName = recipientData.userName;
        }
        

        let combinedMessageID = uid.toString() + recipientId.toString()
        let msgReference = collection(db, 'conversations', combinedMessageID, 'messages')

        return addDoc(msgReference, {
            content: userName + " Joined",
            sender: userName,
            time: serverTimestamp()
        })
        .then(() => {
           return addDoc(msgReference, {
            content: msgRequest.textContent + " Joined",
            sender: recipientUserName,
            time: serverTimestamp()
           })
        })
        .then(() => {
            return setDoc(doc(db, 'conversations', combinedMessageID), {
                party1: uid,
                party2: recipientId
            })
        })
        .then(() => {
            return updateDoc(doc(db, 'notifications', uid), {
                msgCount: 0,
                msgNotify: false
            })
        })
        .then(() => {
            return setDoc(doc(db, 'notifications', recipientId, 'messageRequests', uid), {
                acceptRequest: true,
                userName: userName
            })
        })
        .then(() => {
            return updateDoc(doc(db, 'notifications', uid, 'messageRequests', recipientId), {
                acceptRequest: true,
            })
        })
        
      })

        //let currentUserId = '';
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, now you can use the user's ID
                let currentUserId = user.uid;
                displayMessageRequests(currentUserId);
            } else {
                // No user is signed in
            }
        });


        // DECLINE REQUEST
        const rejectMsgReq = document.querySelector('.rejectMR')

        rejectMsgReq.addEventListener('click', async () =>{

            const uid = auth.currentUser.uid
            const usersDB = doc(db, 'users', uid)
            const userDocSnapshot = await getDoc(usersDB);
            let userName = "";
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                userName = userData.userName;
            }

            let recipientId = msgRequest.value
            const recipientDB = doc(db, 'users', recipientId)
            const recipientDocSnapshot = await getDoc(recipientDB);
            let recipientUserName = "";
            if (recipientDocSnapshot.exists()) {
                const recipientData = recipientDocSnapshot.data();
                recipientUserName = recipientData.userName;
            }


            return deleteDoc(doc(db, 'notifications', uid, 'messageRequests', recipientId))
            .then(() => {
                return updateDoc(doc(db, 'notifications', uid), {
                    msgCount: 0,
                    msgNotify: false,
                })
            })

        });




      
        function displayMessageRequests(userID) {
            const requestsContainer = document.getElementById("messageRequestSelect");
            const requestsRef = collection(db, 'notifications', userID, 'messageRequests');
            const q = query(requestsRef, where("acceptRequest", "==", true)); // Filter for accepted requests
        
            // Using onSnapshot for real-time updates
            onSnapshot(q, (querySnapshot) => {
                requestsContainer.innerHTML = ''; // Clear previous requests
        
                querySnapshot.forEach((doc) => {
                    const requestData = doc.data();
                    const optionElement = document.createElement("option");
                    optionElement.innerText = requestData.userName;
                    optionElement.value = doc.id; // Use the document ID as the value
                    requestsContainer.appendChild(optionElement);
                });
        
                if (requestsContainer.options.length > 0) {
                    const firstUserId = requestsContainer.options[0].value;
                    loadMessages(userID, firstUserId); // Load messages for the first user
                }
            });
        
            requestsContainer.addEventListener('change', () => {
                const selectedUserId = requestsContainer.value;
                loadMessages(userID, selectedUserId); // Function to load messages
            });
        }
        

        async function loadMessages(currentUserId, otherUserId) {
            const messageContainer = document.getElementById("messageContainer");
        
            // Function to determine the correct collection
            async function determineCollection() {
                let messagesRef = collection(db, 'conversations', currentUserId + otherUserId, 'messages');
                const qCheck = query(messagesRef, limit(1)); // Limit the query to only fetch one document
        
                const querySnapshot = await getDocs(qCheck);
                if (querySnapshot.empty) {
                    return collection(db, 'conversations', otherUserId + currentUserId, 'messages');
                } else {
                    return messagesRef;
                }
            }
        
            const messagesRef = await determineCollection();
            const q = query(messagesRef, orderBy('time'));
        
            // Using onSnapshot for real-time updates
            onSnapshot(q, (querySnapshot) => {
                messageContainer.innerHTML = ''; // Clear previous messages
        
                querySnapshot.forEach((doc) => {
                    let messageData = doc.data();
                    let messageElement = document.createElement("div");
                    messageElement.innerText = `${messageData.sender}: ${messageData.content}`;
                    messageContainer.appendChild(messageElement);
                });
            });
        }
        


        document.getElementById("sendMessageButton").addEventListener("click", async () => {
            const messageText = document.getElementById("messageInput").value;
            const selectedUserId = document.getElementById("messageRequestSelect").value;
            const currentUserId = auth.currentUser.uid;
        
            if (messageText && selectedUserId) {
                sendMessage(currentUserId, selectedUserId, messageText);
                document.getElementById("messageInput").value = ''; // Clear the input field after sending
            }
        });
        
        async function sendMessage(senderId, recipientId, messageText) {
            let conversationId = senderId + recipientId;
            let messagesRef = collection(db, 'conversations', conversationId, 'messages');
        
            // Check if messages exist in this conversation
            const querySnapshot = await getDocs(query(messagesRef, limit(1)));
            if (querySnapshot.empty) {
                // If no messages, reverse the IDs
                conversationId = recipientId + senderId;
                messagesRef = collection(db, 'conversations', conversationId, 'messages');
            }
        
            // Fetch user's name
            let userName = "";
            const usersDB = doc(db, 'users', senderId);
            const userDocSnapshot = await getDoc(usersDB);
            if (userDocSnapshot.exists()) {
                userName = userDocSnapshot.data().userName;
            }
        
            // Add the message to the correct conversation
            await addDoc(messagesRef, {
                content: messageText,
                sender: userName,
                time: serverTimestamp()
            });
        
            console.log("Message sent!");
        }
    
        

