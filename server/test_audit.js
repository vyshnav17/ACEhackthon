const fs = require('fs');
const path = require('path');

// 1. Create a dummy text file (since PDF is harder to generate raw)
const filePath = path.join(__dirname, 'test_resume.txt');
fs.writeFileSync(filePath, 'John Doe\nSoftware Engineer\nSkills: React, Node.js\nExperience: 5 years at Tech Corp.');

// 2. Upload it
async function testUpload() {
    console.log("Testing upload with:", filePath);

    const formData = new FormData();
    const fileBlob = new Blob([fs.readFileSync(filePath)], { type: 'text/plain' });
    formData.append('resume', fileBlob, 'test_resume.txt');
    formData.append('jobRole', 'Frontend Developer');

    try {
        const response = await fetch('http://localhost:5000/api/assessments/upload', {
            method: 'POST',
            body: formData
        });

        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testUpload();
