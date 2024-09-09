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

// Function to fetch appointment details by ID
function getAppointmentDetails(appointmentId) {
    return db.collection('Appointments').doc(appointmentId).get().then((doc) => {
        if (doc.exists) {
            return doc.data();
        } else {
            console.log("No such appointment document!");
            return null;
        }
    }).catch((error) => {
        console.error("Error getting appointment document:", error);
        return null;
    });
}

// Function to create and display notification elements
function createNotificationElement(notification) {
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('notification');

    // Fetch the appointment details
    getAppointmentDetails(notification.appointmentId).then((appointment) => {
        if (appointment) {
            const name = appointment.name || 'N/A';
            const section = appointment.section || 'N/A';
            const phone = appointment.phone || 'N/A';
            
            const appointmentDate = appointment.date.toDate();
            const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

            notificationElement.innerHTML = `
                <div class="title">Name: ${name}</div>
                <div class="details">Section: ${section}, Phone: ${phone}</div>
                <div class="day">Day: ${dayName}</div>
            `;
        } else {
            notificationElement.textContent = `Appointment ID: ${notification.appointmentId}`;
        }
    });

    return notificationElement;
}

// Function to display notifications in a single div
function displayNotifications(notifications) {
    const notificationsContainer = document.getElementById('notifications-container');
    notificationsContainer.innerHTML = ''; // Clear existing notifications

    notifications.forEach(notification => {
        // Create a new div for each notification
        const notificationElement = document.createElement('div');
        notificationElement.classList.add('notification');

        // Fetch appointment details based on appointmentId
        db.collection('Appointments').doc(notification.appointmentId).get().then(doc => {
            if (doc.exists) {
                const appointment = doc.data();
                const date = new Date(appointment.date.toDate());
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const dayName = dayNames[date.getDay()];

                notificationElement.innerHTML = `
                    <div class="title">${appointment.name}</div>
                    <div class="details">Section: ${appointment.section}</div>
                    <div class="details">Number: ${appointment.phone}</div>
                    <div class="day">${dayName}</div>
                `;

                notificationsContainer.appendChild(notificationElement); // Append the notification to the container
            }
        }).catch(error => {
            console.log("Error fetching appointment details:", error);
        });
    });
}

// Set up a real-time listener for notifications
function listenForNotifications(counselorId) {
    const counselorRef = db.collection('Counselors').doc(counselorId);

    counselorRef.onSnapshot((doc) => {
        if (doc.exists) {
            const notifications = doc.data().notifications || []; // Default to empty array if no notifications
            displayNotifications(notifications);
        } else {
            console.log("No such counselor document!");
        }
    }, (error) => {
        console.log("Error getting counselor document:", error);
    });
}

// Call listenForNotifications with the appropriate counselor ID
listenForNotifications("counselor456"); // Replace with the actual counselor ID if needed
