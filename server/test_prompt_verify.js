const fs = require('fs');
console.log("Verifying AI Autocomplete Prompt...");
const content = fs.readFileSync('./services/resumeService.js', 'utf8');
if (content.includes('AUTO-FILL MISSING DATA') && content.includes('Freelance Developer')) {
    console.log("✅ Prompt includes auto-fill instructions.");
} else {
    console.error("❌ Prompt missing new instructions.");
}
