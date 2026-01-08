const fs = require('fs');
const path = require('path');
const pkgPath = path.join(__dirname, 'node_modules', 'pdf-parse', 'package.json');
try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    console.log("Main:", pkg.main);
} catch (e) {
    console.log("Error:", e.message);
}
