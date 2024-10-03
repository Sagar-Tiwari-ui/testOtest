import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Initialize Firestore and Auth
const db = getFirestore();
const auth = getAuth();

// Function to retrieve and display quiz results from sessionStorage
function displayQuizResults() {
    const score = sessionStorage.getItem('quizScore');
    const timeTaken = sessionStorage.getItem('timeTaken');
    const accuracy = sessionStorage.getItem('accuracy');

    if (score !== null && timeTaken !== null && accuracy !== null) {
        const timeInMinutes = Math.floor(timeTaken / 60);
        const timeInSeconds = timeTaken % 60;

        document.getElementById('score').textContent = score;
        document.getElementById('accuracy').textContent = parseFloat(accuracy).toFixed(2);
        document.getElementById('timeTaken').textContent = `${timeInMinutes} min ${timeInSeconds} sec`;
    } else {
        console.error("Quiz results are not available in sessionStorage");
    }
}

// Function to submit the score to Firestore
async function submitScore() {
    const score = sessionStorage.getItem('quizScore');
    const timeTaken = sessionStorage.getItem('timeTaken');
    const accuracy = sessionStorage.getItem('accuracy');

    onAuthStateChanged(auth, async (user) => {
        if (user && score !== null) { // Check if the user is authenticated
            try {
                const userId = user.uid; // Get authenticated user's UID
                const studentDocRef = doc(db, "users", userId);

                // Submit quiz results to Firestore under the user's document
                await setDoc(studentDocRef, {
                    quizResults: {
                        score: parseInt(score, 10),
                        timeTaken: parseInt(timeTaken, 10),
                        accuracy: parseFloat(accuracy)
                    }
                }, { merge: true });

                console.log("Score successfully submitted to Firebase!");
                alert("Score submitted successfully!");
            } catch (error) {
                console.error("Error submitting score: ", error);
                alert("An error occurred while submitting your score.");
            }
        } else {
            alert("User not logged in or score not available.");
        }
    });
}

// Call the function to display quiz results when the page loads
displayQuizResults();

// Store the candidate's name in sessionStorage
function setCandidateName() {
    const candidateName = prompt("Please enter your name:");
    if (candidateName) {
        sessionStorage.setItem('candidateName', candidateName);
    }
}

// Call this function before the quiz starts
setCandidateName();

// Event listener for the score submission button
document.getElementById('submitScoreButton').addEventListener('click', submitScore);