// Include the xlsx library
import * as XLSX from "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js";

let questions = [];   // Array to store questions and options
let studentAnswers = []; // Array to store the student's answers
let currentQuestionIndex = 0;
let correctAnswers = []; // Array to store correct answers

// Function to calculate total marks
function calculateTotalMarks(studentAnswers, correctAnswers) {
    let totalMarks = 0;

    for (let i = 0; i < correctAnswers.length; i++) {
        if (!studentAnswers[i]) {
            // No answer provided (unattempted question)
            continue;
        } else if (studentAnswers[i] === correctAnswers[i]) {
            // Correct answer
            totalMarks += 4;
        } else {
            // Incorrect answer
            totalMarks -= 1;
        }
    }

    return totalMarks;
}

// Function to retrieve the Excel file from local storage
function fetchExcelFromLocal() {
    const url = 'questions.xlsx';  // Ensure the Excel file is in the same directory as the HTML file

    // Fetch the Excel file from the local path
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            // Parse the Excel file using the xlsx library
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // Get the first sheet
            const worksheet = workbook.Sheets[sheetName];

            // Parse the Excel data into JSON
            questions = XLSX.utils.sheet_to_json(worksheet);

            // Store correct answers
            correctAnswers = questions.map(q => q['Correct Answer']);

            if (questions.length > 0) {
                populateQuestionPalette(); // Create the question palette
                displayQuestion(currentQuestionIndex); // Display the first question
                document.getElementById('quizContainer').style.display = 'block'; // Show quiz container
            } else {
                console.error('No questions found in the Excel file.');
            }
        })
        .catch(error => console.error('Error loading the Excel file:', error));
}

// Function to display a question and its options
function displayQuestion(questionIndex) {
    if (questionIndex >= questions.length) {
        alert('Quiz completed!');
        document.getElementById('quizContainer').style.display = 'none';  // Hide quiz after completion

        // Calculate total marks after the quiz is completed
        const totalMarks = calculateTotalMarks(studentAnswers, correctAnswers);
        alert(`Your total score is: ${totalMarks}`);

        return;
    }

    const questionData = questions[questionIndex];
    const questionText = questionData['Question Text'];
    const options = [questionData['Option A'], questionData['Option B'], questionData['Option C'], questionData['Option D']];

    // Display the question
    document.getElementById('questionDisplay').innerText = `Q${questionIndex + 1}: ${questionText}`;

    // Display the options
    const optionsContainer = document.getElementById('optionsDisplay');
    optionsContainer.innerHTML = '';  // Clear previous options
    options.forEach(option => {
        const optionElement = document.createElement('button');
        optionElement.innerText = option;
        optionElement.style.display = 'block';
        optionElement.style.margin = '10px 0';

        // Event listener for when an option is clicked
        optionElement.addEventListener('click', function () {
            // Store the selected answer
            studentAnswers[questionIndex] = option;
            updatePalette(); // Update the question palette after selecting an answer
        });

        optionsContainer.appendChild(optionElement);
    });

    updatePalette(); // Update palette every time a new question is displayed
}

// Function to populate the question palette
function populateQuestionPalette() {
    const palette = document.getElementById('question-grid');
    palette.innerHTML = ''; // Clear previous content

    for (let i = 0; i < questions.length; i++) {
        const questionBox = document.createElement('div');
        questionBox.classList.add('question-box');
        questionBox.textContent = i + 1;

        // Event listener for question navigation
        questionBox.addEventListener('click', () => {
            currentQuestionIndex = i;
            displayQuestion(i);
        });

        palette.appendChild(questionBox);
    }
}

// Function to update the question palette
function updatePalette() {
    const palette = document.getElementById('question-grid');
    const questionBoxes = palette.children;

    for (let i = 0; i < questionBoxes.length; i++) {
        if (studentAnswers[i]) {
            questionBoxes[i].classList.add('answered');
        } else {
            questionBoxes[i].classList.remove('answered');
        }
    }
}

// Event listeners for navigation buttons
document.getElementById('nextQuestionBtn').addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
});

document.getElementById('prevQuestionBtn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
});

// Fetch the Excel data from local storage when the page loads
window.onload = fetchExcelFromLocal;