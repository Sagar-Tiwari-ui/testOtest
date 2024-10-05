 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"
 
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

 // homepage.js

// Function to enable/disable the "Proceed" button based on checkbox
export function toggleProceedButton() {
    const checkbox = document.getElementById('agreeCheckbox');
    const proceedBtn = document.getElementById('proceedBtn');
    proceedBtn.disabled = !checkbox.checked;
}

// Function to handle redirection to the quiz page
export function redirectToQuiz() {
    window.location.href = 'quiz.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to checkbox
    const checkbox = document.getElementById('agreeCheckbox');
    checkbox.addEventListener('change', toggleProceedButton);

    // Add event listener to Proceed button
    const proceedBtn = document.getElementById('proceedBtn');
    proceedBtn.addEventListener('click', redirectToQuiz);
});