// Function to retrieve and display quiz results from sessionStorage
function displayQuizResults() {
    // Get the quiz results from sessionStorage
    const score = sessionStorage.getItem('quizScore');
    const timeTaken = sessionStorage.getItem('timeTaken');
    const accuracy = sessionStorage.getItem('accuracy');

    // Check if the results are available
    if (score !== null && timeTaken !== null && accuracy !== null) {
        // Convert time from seconds to minutes and seconds
        const timeInMinutes = Math.floor(timeTaken / 60);
        const timeInSeconds = timeTaken % 60;

        // Display the quiz results on the page
        document.getElementById('score').textContent = score;
        document.getElementById('accuracy').textContent = parseFloat(accuracy).toFixed(2);
        document.getElementById('timeTaken').textContent = timeInMinutes + ' min ' + timeInSeconds + ' sec';
    } else {
        console.error("Quiz results are not available in sessionStorage");
    }
}

// Function to submit the score to Firestore
async function submitScore() {
    const score = sessionStorage.getItem('quizScore');
    const timeTaken = sessionStorage.getItem('timeTaken');
    const accuracy = sessionStorage.getItem('accuracy');
    const userId = localStorage.getItem('loggedInUserId'); // Get the logged-in user's ID

    if (userId && score !== null) {
        try {
            const studentDocRef = doc(db, "users", userId); // Reference to the user's document
            await setDoc(studentDocRef, {
                quizResults: {
                    score: parseInt(score, 10), // Convert score to integer
                    timeTaken: parseInt(timeTaken, 10), // Convert time taken to integer
                    accuracy: parseFloat(accuracy) // Ensure accuracy is a float
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
}


// Call the function to display quiz results when the page loads
displayQuizResults();

// Event listener for the score submission button
document.getElementById('submitScoreButton').addEventListener('click', submitScore);
