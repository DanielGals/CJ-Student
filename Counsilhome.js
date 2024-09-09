// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCzmzZu9L0DWtG5YSsGmElrw6Jhom8Wv-0",
    authDomain: "cjproject-f03d5.firebaseapp.com",
    projectId: "cjproject-f03d5",
    storageBucket: "cjproject-f03d5.appspot.com",
    messagingSenderId: "431375394328",
    appId: "1:431375394328:web:993f3c11e8a54ef8ff056d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Function to change bell color for 3 seconds
function notifyBell() {
    const bellIcon = document.getElementById('notification-bell');
    bellIcon.classList.add('bell-notified');
    
    setTimeout(() => {
        bellIcon.classList.remove('bell-notified');
    }, 3000); // Change color for 3 seconds
}

// Set up a real-time listener for notifications
function listenForNotifications() {
    const notificationsRef = db.collection('Counselors').doc('counselor456'); // Adjust to the correct document

    notificationsRef.onSnapshot((doc) => {
        if (doc.exists) {
            const notifications = doc.data().notifications || [];
            
            if (notifications.length > 0) {
                notifyBell();
            }
        } else {
            console.log("No such document!");
        }
    }, (error) => {
        console.log("Error getting document:", error);
    });
}

// Call the function to start listening for notifications
listenForNotifications();
