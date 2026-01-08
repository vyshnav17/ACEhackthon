const fs = require('fs');
const pdf = require('pdf-parse');

const dump = {
    type: typeof pdf,
    keys: Object.keys(pdf),
    toString: pdf.toString(),
    // check if it has a default property
    hasDefault: !!pdf.default,
    defaultType: typeof pdf.default
};

fs.writeFileSync('pdf_dump.json', JSON.stringify(dump, null, 2));
