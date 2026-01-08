const pdf = require('pdf-parse');
const fs = require('fs');

console.log("Type of pdf:", typeof pdf);
console.log("Is pdf a function?", typeof pdf === 'function');
console.log("pdf export:", pdf);

try {
    const buffer = Buffer.from("test pdf content");
    // Just testing if it's callable, it will likely fail parsing but shouldn't say "not a function"
    pdf(buffer).then(data => {
        console.log("Parsed:", data.text);
    }).catch(e => {
        console.log("Parse error (expected):", e.message);
    });
} catch (e) {
    console.log("Runtime error:", e.message);
}
