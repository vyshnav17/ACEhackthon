const pdf = require('pdf-parse');

console.log("pdf.PDFParse type:", typeof pdf.PDFParse);

if (typeof pdf.PDFParse === 'function') {
    console.log("Trying pdf.PDFParse...");
    try {
        const buffer = Buffer.from("test");
        // pdf-parse function usually returns a promise
        const ret = pdf.PDFParse(buffer);
        console.log("Return type:", typeof ret);
        if (ret && ret.then) {
            ret.then(d => console.log("Promise resolved (might fail parsing)", d.text))
                .catch(e => console.log("Promise rejected (expected):", e.message));
        }
    } catch (e) { console.log("Call failed:", e.message); }
}
