// Global variables
let currentQuestionIndex = 0;
const questions = document.querySelectorAll('.question-section');
let studentAnswers = {};  // Object to store the student's answers
let timer;  // Variable to store the timer
let startTime; // To track time taken

// Start the timer and set the start time
function startTimer(duration) {
    let timerDisplay = document.getElementById('timer');
    let minutes, seconds;
    startTime = Date.now(); // Start time
    timer = setInterval(function () {
        let timePassed = Date.now() - startTime;
        let remainingTime = duration - Math.floor(timePassed / 1000);
        minutes = parseInt(remainingTime / 60, 10);
        seconds = parseInt(remainingTime % 60, 10);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        timerDisplay.textContent = minutes + ":" + seconds;

        if (remainingTime <= 0) {
            clearInterval(timer);
            alert("Time is up!");
            calculateScore();  // Automatically calculate score when time is up
        }
    }, 1000);
}

function showQuestion(index) {
    questions.forEach((question, idx) => {
        question.style.display = (idx === index) ? 'block' : 'none'; // Show only the current question
    });

    // Show/hide navigation buttons
    document.getElementById('prevButton').style.display = (index === 0) ? 'none' : 'inline';
    document.getElementById('nextButton').style.display = (index === questions.length - 1) ? 'none' : 'inline';
    document.getElementById('submitButton').style.display = 'inline';  // Always show submit button

    // Update question palette
    updateQuestionPalette();
}

// Start the timer when the quiz is initialized
startTimer(60 * 60);  // 60 minutes timer

function saveAndNext() {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = currentQuestion.querySelector('input[type="radio"]:checked');
    const paletteButton = document.getElementById('paletteButtons').children[currentQuestionIndex];

    if (selectedAnswer) {
        studentAnswers[currentQuestionIndex] = selectedAnswer.value;  // Save the selected option value
        paletteButton.style.backgroundColor = 'green';  // Change color to green
        nextQuestion();  // Move to next question
    } else {
        alert("Please select an answer before proceeding.");
    }
}

function markForReview() {
    const paletteButton = document.getElementById('paletteButtons').children[currentQuestionIndex];
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = currentQuestion.querySelector('input[type="radio"]:checked');

    // Store answer if selected
    if (selectedAnswer) {
        studentAnswers[currentQuestionIndex] = selectedAnswer.value;  // Save the selected option value
    }
    paletteButton.style.backgroundColor = 'purple';  // Change color to purple for review
}

function nextQuestion() {
    const paletteButton = document.getElementById('paletteButtons').children[currentQuestionIndex];
    const selectedAnswer = questions[currentQuestionIndex].querySelector('input[type="radio"]:checked');
    if (!selectedAnswer && !studentAnswers[currentQuestionIndex]) {
        paletteButton.style.backgroundColor = 'red';  // Mark as not answered if no selection and no answer saved
    }
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

// Function to calculate the score
async function calculateScore(event) {
    if (event) event.preventDefault();  // Prevent form submission if event is present
    clearInterval(timer);  // Stop the timer

    let score = 0, totalCorrect = 0, totalAttempted = 0;

    // Iterate through each question to calculate score
    questions.forEach((question, index) => {
        const correctAnswer = question.getAttribute('data-correct');  // Get the correct answer from the attribute
        const selectedAnswer = studentAnswers[index];  // Get the student's selected answer

        if (selectedAnswer) {
            totalAttempted++;
            if (selectedAnswer === correctAnswer) {  // Compare the selected option with the correct answer
                score += 4;  // Correct answer +4
                totalCorrect++;
            } else {
                score -= 1;  // Incorrect answer -1
            }
        }
    });

    // Log the scores to the console for debugging (optional)
    console.log("Score:", score);
    console.log("Total Correct:", totalCorrect);
    console.log("Total Attempted:", totalAttempted);

    // Calculate additional data
    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // Total time in seconds
    const accuracy = (totalCorrect / questions.length) * 100;

    // Store the results in sessionStorage (or use any other method for passing data to the result page)
    sessionStorage.setItem('quizScore', score);
    sessionStorage.setItem('timeTaken', timeTaken);
    sessionStorage.setItem('accuracy', accuracy);

    // Call the function to store quiz results in Firestore
    try {
        await storeQuizResults(score, accuracy, timeTaken);
        console.log("Quiz results stored successfully.");
    } catch (error) {
        console.error("Error storing quiz results:", error);
    }

    // Redirect to the result page after score calculation
    window.location.href = 'result.html';
}


// Initialize the quiz by showing the first question
showQuestion(currentQuestionIndex);

// Function to update the question palette
function updateQuestionPalette() {
    const paletteButtonsContainer = document.getElementById('paletteButtons');

    // Only create buttons if they don't exist
    if (paletteButtonsContainer.children.length === 0) {
        questions.forEach((_, index) => {
            const button = document.createElement('button');
            button.innerText = index + 1;
            button.className = 'palette-button not-visited';
            button.onclick = () => {
                currentQuestionIndex = index;
                showQuestion(currentQuestionIndex);
            };
            paletteButtonsContainer.appendChild(button);
        });
    }
}

// Add event listener for the Submit Now button
document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', calculateScore);
    } else {
        console.error("Submit button not found");
    }
});
// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();  // Prevent the context menu from appearing
});

// Disable 'Ctrl + C' for copying
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();  // Prevent copy action
    }
});

// Loading indicator for score submission
document.body.insertAdjacentHTML('beforeend', '<div id="loadingIndicator" style="display:none;">Submitting...</div>');