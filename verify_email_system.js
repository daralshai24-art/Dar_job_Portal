const mongoose = require('mongoose');
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/daralshai_jobs";

async function verifySystem() {
    console.log("🔌 Connecting to DB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected.");

    // 1. Check Settings
    const settingsSchema = new mongoose.Schema({ email: Object }, { strict: false });
    const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

    const settings = await Settings.findOne();
    const rules = settings?.email?.notificationRules || {};

    console.log("\n📊 CURRENT NOTIFICATION RULES (DB State):");
    Object.keys(rules).forEach(key => {
        const roles = rules[key];
        console.log(`   - ${key}: [${roles.join(", ")}]`);
    });

    // 2. Check Users
    const userSchema = new mongoose.Schema({ name: String, email: String, role: String, department: String }, { strict: false });
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // 3. Simulate Routing for ALL Scenarios
    console.log("\n🕵️ SIMULATING ROUTING FOR ALL ALERT TYPES:");

    for (const alertType of Object.keys(rules)) {
        const configuredRoles = rules[alertType] || [];
        console.log(`\n-----------------------------------------------------------`);
        console.log(`� ALERT TYPE: '${alertType}'`);
        console.log(`   Configured Roles: [${configuredRoles.join(", ")}]`);

        if (configuredRoles.length === 0) {
            console.log("   ❌ No roles configured! Only defaults might apply.");
        } else {
            const users = await User.find({ role: { $in: configuredRoles }, status: "active" });

            if (users.length === 0) {
                console.log(`   ⚠️ Roles configured, but NO ACTIVE USERS found.`);
            } else {
                console.log(`   ✅ Would send to (${users.length}) users:`);
                users.forEach(u => console.log(`      - ${u.name} (${u.email}) [${u.role}]`));
            }
        }
    }

    await mongoose.disconnect();
}

verifySystem().catch(console.error);
