const pdf = require('pdf-parse');

try {
    const buffer = Buffer.from("test");
    // Try asking for new instance
    if (pdf.PDFParse) {
        console.log("Trying new pdf.PDFParse(buffer)...");
        const instance = new pdf.PDFParse(buffer);
        console.log("Instance created:", instance);
        // check if instance has text or promise
    } else {
        console.log("pdf.PDFParse not found on object");
    }
} catch (e) {
    console.log("Error:", e.message);
}
