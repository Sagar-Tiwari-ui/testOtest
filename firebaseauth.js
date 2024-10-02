// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzZG2MtJb244u0g4IX59tGWATK-KGht-w",
    authDomain: "testotest-b77f3.firebaseapp.com",
    projectId: "testotest-b77f3",
    storageBucket: "testotest-b77f3.appspot.com",
    messagingSenderId: "57536899329",
    appId: "1:57536899329:web:d07442630c944086171300",
    measurementId: "G-52156S4D02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Function to display messages
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    // Fade out the message after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Sign up new users
const signUpButton = document.getElementById('submitSignUp');
signUpButton.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                MarksObtained: 0 // Initialize with 0 or any other default value
            };
            showMessage('Account Created Successfully', 'signUpMessage');

            const docRef = doc(db, "users", user.uid);
            return setDoc(docRef, userData);
        })
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists !!!', 'signUpMessage');
            } else {
                showMessage('Unable to create User', 'signUpMessage');
            }
        });
});

// Sign in users
const signInButton = document.getElementById('submitSignIn');
signInButton.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            showMessage('Login is successful', 'signInMessage');
            window.location.href = 'homepage.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('An error occurred during login', 'signInMessage');
            }
        });
});

// Function to store student's quiz results after test submission
function storeQuizResults(score, accuracy, timeTaken) {
    const userId = localStorage.getItem('loggedInUserId'); // Get the logged-in user's ID

    if (userId) {
        const userRef = doc(db, "users", userId); // Reference to the user's Firestore document

        // Prepare the data to be stored
        const quizData = {
            score: score,
            accuracy: accuracy,
            timeTaken: timeTaken, // in seconds
            submissionDate: new Date()
        };

        // Update the document with the quiz results
        return setDoc(userRef, { quizResults: quizData }, { merge: true })
            .then(() => {
                console.log("Quiz results stored successfully in Firestore");
            })
            .catch((error) => {
                console.error("Error storing quiz results: ", error);
                throw new Error("Failed to store quiz results");
            });
    } else {
        console.error("User not logged in");
        throw new Error("User not logged in");
    }
}