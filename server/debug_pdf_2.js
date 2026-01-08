const pdf = require('pdf-parse');

console.log("Keys:", Object.keys(pdf));
console.log("pdf.default type:", typeof pdf.default);

if (typeof pdf.default === 'function') {
    console.log("Found default export function");
    // Try to call it
    try {
        const buffer = Buffer.from("test");
        pdf.default(buffer).then(() => { }).catch(e => console.log("Called default, got error (expected):", e.message));
    } catch (e) { console.log(e); }
} else {
    // maybe it is named something else?
    console.log("Structure:", pdf);
}
