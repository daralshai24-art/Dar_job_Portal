const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env.local');

console.log(`Checking file at: ${envPath}`);

if (!fs.existsSync(envPath)) {
    console.error("ERROR: .env.local file not found!");
    process.exit(1);
}

// Load env file
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error("ERROR: dotenv failed to parse file:", result.error);
}

const email = process.env.GOOGLE_CLIENT_EMAIL;
const key = process.env.GOOGLE_PRIVATE_KEY;

console.log("\n--- PARSE RESULTS ---");
console.log(`GOOGLE_CLIENT_EMAIL: ${email ? 'FOUND (' + email.substring(0, 10) + '...)' : 'MISSING'}`);
console.log(`GOOGLE_PRIVATE_KEY:  ${key ? 'FOUND (Length: ' + key.length + ')' : 'MISSING'}`);

if (key) {
    console.log("Key details:");
    console.log("  Contains literal '\\n':", key.includes('\\n'));
    console.log("  Contains actual newline:", key.includes('\n'));
} else {
    console.log("\n--- DEBUGGING FILE CONTENT (Last 20 lines) ---");
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    console.log(lines.slice(-20).join('\n'));
}
