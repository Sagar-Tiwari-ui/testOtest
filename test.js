function startTest(subject) {
    const name = document.getElementById('name').value;
    if (!name) {
        alert('Please enter your name');
        return;
    }

    document.getElementById('test-form').style.display = 'none';
    document.getElementById('test-questions').style.display = 'block';

    // Add sample questions dynamically (can be replaced with real questions)
    const testQuestions = `
        <h3>Question 1: What is the speed of light?</h3>
        <input type="radio" name="q1" value="299792458"> 299,792,458 m/s<br>
        <input type="radio" name="q1" value="150000000"> 150,000,000 m/s<br>
        <br>
        <h3>Question 2: What is the force of gravity on Earth?</h3>
        <input type="radio" name="q2" value="9.8"> 9.8 m/s²<br>
        <input type="radio" name="q2" value="5.5"> 5.5 m/s²<br>
        <br>
        <button type="button" onclick="submitTest('${subject}', '${name}')">Submit Test</button>
    `;
    document.getElementById('test-questions').innerHTML = testQuestions;
}

function submitTest(subject, name) {
    const answers = {
        q1: document.querySelector('input[name="q1"]:checked')?.value || '',
        q2: document.querySelector('input[name="q2"]:checked')?.value || ''
    };

    // Send test results via POST to PHP server to generate an Excel report
    fetch('result.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, name, answers })
    })
    .then(response => response.json())
    .then(data => alert(`Test submitted! Your score: ${data.score}`))
    .catch(error => console.error('Error:', error));
}