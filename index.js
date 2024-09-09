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
var db = firebase.firestore();

// Function to handle the appointment booking
document.getElementById("requestCounseling").onclick = requestCounseling;

function requestCounseling() {
  // Get input values from the form
  var name = document.getElementById('name').value;
  var section = document.getElementById('section').value;
  var phone = document.getElementById('phone').value;

  // Check if the required fields are filled
  if (name === "" || section === "" || phone === "") {
    alert("Please fill in all the fields.");
    return;
  }

  // Example static values (You can replace these with dynamic user information)
  var studentId = "student123";
  var counselorId = "counselor456";

  // Add appointment details to Firestore
  db.collection("Appointments").add({
    studentId: studentId,
    counselorId: counselorId,
    name: name,
    section: section,
    phone: phone,
    date: firebase.firestore.Timestamp.fromDate(new Date()), // Current date/time
    status: "requested"
  }).then(function(docRef) {
    // Notify the counselor after appointment creation
    db.collection("Counselors").doc(counselorId).update({
      notifications: firebase.firestore.FieldValue.arrayUnion({
        appointmentId: docRef.id,
        studentId: studentId,
        date: firebase.firestore.Timestamp.fromDate(new Date()), // Current date/time
        status: "pending"
      })
    }).then(function() {
      console.log("Notification sent to counselor.");
      alert("Appointment booked successfully!");
    }).catch(function(error) {
      console.error("Error sending notification: ", error);
      alert("Error sending notification.");
    });
  }).catch(function(error) {
    console.error("Error creating appointment: ", error);
    alert("Error booking appointment.");
  });
}
