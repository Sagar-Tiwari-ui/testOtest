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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let questions = [];
let studentAnswers = [];
let currentQuestionIndex = 0;
let score = 0;

// Function to load Excel file and populate the quiz
function loadExcelFile() {
    const url = 'questions.xlsx'; // Path to your Excel file
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const quizData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert sheet to JSON
            questions = quizData.slice(1); // Exclude the header row
            displayQuestion(currentQuestionIndex); // Display the first question
        })
        .catch(error => console.error("Error loading Excel file:", error));
}

// Function to display a question
function displayQuestion(index) {
    const questionTextElement = document.getElementById('question-text');
    const optionsListElement = document.getElementById('options-list');

    // Get current question data
    const questionData = questions[index];
    const questionText = questionData[0];
    const options = questionData.slice(1, 5);
    const correctAnswer = questionData[5]; // Assuming the 6th column is the correct answer

    questionTextElement.textContent = `Q${index + 1}: ${questionText}`;
    
    // Clear previous options
    optionsListElement.innerHTML = '';

    // Display new options
    options.forEach((option, i) => {
        const li = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'option';
        input.value = option;
        input.id = `option${i}`;

        li.appendChild(input);
        li.appendChild(document.createTextNode(option));
        optionsListElement.appendChild(li);
    });

    // Save the correct answer for scoring
    studentAnswers[index] = { correctAnswer: correctAnswer, selected: null };
}

// Function to save the student's answer
function saveAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        studentAnswers[currentQuestionIndex].selected = selectedOption.value;
    }
}

// Function to calculate and display score
function calculateScore() {
    score = 0; // Reset score
    studentAnswers.forEach(answer => {
        if (answer.selected === answer.correctAnswer) {
            score += 4; // Correct answer
        } else if (answer.selected) {
            score -= 1; // Wrong answer
        }
    });
}

// Function to submit the quiz and send data to Firebase
function submitQuiz() {
    saveAnswer(); // Save the last answer before submitting
    calculateScore(); // Calculate final score
    
    // Save score to Firestore
    db.collection("quizScores").add({
        score: score,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("Quiz submitted successfully! Your score: " + score);
        // Optionally, redirect or clear the quiz
    })
    .catch((error) => {
        console.error("Error submitting quiz score:", error);
    });
}

// Next and Previous question navigation
function nextQuestion() {
    saveAnswer();
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
}

function previousQuestion() {
    saveAnswer();
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
}

// Event listeners for buttons
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('prev-btn').addEventListener('click', previousQuestion);
document.getElementById('submit-btn').addEventListener('click', submitQuiz);

// Load the Excel file on page load
window.onload = function() {
    loadExcelFile();
};
