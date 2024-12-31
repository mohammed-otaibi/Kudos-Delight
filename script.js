
// DOM Elements
const toggleForm = document.getElementById('toggleForm');
const addKudosForm = document.getElementById('addKudosForm');
const kudosInput = document.getElementById('kudosInput');
const submitKudos = document.getElementById('submitKudos');
const generateKudos = document.getElementById('generateKudos');
const kudosMessage = document.getElementById('kudosMessage');

// Firebase Config (Replace with your Firebase project details)
const firebaseConfig = {
  ......
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Toggle Add Kudos Form
toggleForm.addEventListener('click', () => {
  if (addKudosForm.classList.contains('hidden')) {
    addKudosForm.classList.remove('hidden');
    toggleForm.textContent = "Hide Form";
  } else {
    addKudosForm.classList.add('hidden');
    toggleForm.textContent = "Add Kudos";
  }
});

// Handle Submit Button
submitKudos.addEventListener('click', () => {
  const kudosText = kudosInput.value.trim(); // Get the value of the textarea
  if (kudosText) {
    // Push the new compliment to the Firebase Realtime Database
    database.ref('kudos').push({
      message: kudosText, // Save the compliment
    }).then(() => {
      // Create a success message
      const successMessage = document.createElement('div');
      successMessage.id = 'successMessage'; // Assign an ID for easy access
      successMessage.textContent = "Kudos submitted successfully!";
      successMessage.style.color = "green"; // Style the message
      successMessage.style.marginTop = "10px";
      successMessage.style.textAlign = "center";
      
      // Append the message to the form's parent container
      addKudosForm.parentNode.insertBefore(successMessage, addKudosForm);

      // Remove the message after 3 seconds
      setTimeout(() => {
        const messageElement = document.getElementById('successMessage');
        if (messageElement) {
          messageElement.remove();
        }
      }, 3000);

      kudosInput.value = ""; // Clear the input field
      addKudosForm.classList.add('hidden'); // Hide the form
      toggleForm.textContent = "Add Kudos"; // Reset toggle button text
    }).catch((error) => {
      console.error("Error submitting kudos:", error);
      alert("Failed to submit Kudos. Please try again.");
    });
  } else {
    alert("Please write a Kudo before submitting!"); // Validation for empty input
  }
});



// Handle Generate Kudos Button
generateKudos.addEventListener('click', () => {
  database.ref('kudos').once('value', (snapshot) => {
    const kudosData = snapshot.val();
    if (kudosData) {
      const keys = Object.keys(kudosData); // Get all the keys
      const randomKey = keys[Math.floor(Math.random() * keys.length)]; // Select a random key
      const randomKudo = kudosData[randomKey].message; // Get the message for the random key
      kudosMessage.textContent = randomKudo; // Display the random kudo
    } else {
      kudosMessage.textContent = "No Kudos found! Be the first to add one!";
    }
  }).catch((error) => {
    console.error("Error fetching kudos:", error);
    kudosMessage.textContent = "Failed to fetch Kudos. Please try again.";
  });
});

