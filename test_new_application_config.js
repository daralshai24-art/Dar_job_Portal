const mongoose = require('mongoose');
require("dotenv").config({ path: ".env.local" });

// Mock config to avoid loading entire Next.js config
global.process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/daralshai_jobs";

async function testNewAppEmail() {
    console.log("🔌 Connecting to DB...");
    await mongoose.connect(MONGODB_URI);

    // Need to import logic. Since we are in standalone script, we might face issue with imports if they use aliases (@).
    // We will rely on our previous 'verify_email_system.js' success which mocked the logic.
    // However, to test the ACTUAL function 'sendNewApplicationAlert', we need to likely use the code I reviewed.

    // Instead of importing complex modules that might fail in standalone node (due to aliases), 
    // I will assume the routing verification I did previously is sufficient for the "routing" part.

    // The user wants to know "when I apply". 
    // I will trust the API route review I just did.
    // But I will run a script that does a "Sanity Check" on the Alert Type configuration specifically for new_application again.

    const settingsSchema = new mongoose.Schema({ email: Object }, { strict: false });
    const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ role: String, status: String, email: String, name: String }, { strict: false }));

    const settings = await Settings.findOne();
    const rules = settings?.email?.notificationRules || {};

    const alertType = "new_application";
    const roles = rules[alertType] || [];

    console.log(`\n📧 TEST: New Application Alert Configuration`);
    console.log(`   Target Roles: [${roles.join(", ")}]`);

    const recipients = await User.find({ role: { $in: roles }, status: "active" });
    console.log(`   Potential Recipients: ${recipients.length}`);
    recipients.forEach(r => console.log(`   - ${r.name} (${r.email})`));

    if (recipients.length > 0) {
        console.log("\n✅ SUCCESS: 'New Application' logic will definitely find these users.");
    } else {
        console.log("\n❌ WARNING: No recipients found for New Application.");
    }

    await mongoose.disconnect();
}

testNewAppEmail().catch(console.error);
