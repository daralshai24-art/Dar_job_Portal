const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Mock Models
const committeeSchema = new mongoose.Schema({ department: String, isActive: Boolean, settings: Object, type: String, name: String });
const Committee = mongoose.models.Committee || mongoose.model('Committee', committeeSchema);

async function main() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    // Test Department: "TestDept_NoCommittee"
    const testDept = "Finance"; // Using a real department name but ensuring we assume no committee exists for test or checking real state.

    // 1. Check existing committees
    const existing = await Committee.findOne({ department: testDept, isActive: true });
    console.log(`Checking DB: Is there a committee for ${testDept}?`, existing ? "YES" : "NO");

    if (existing) {
        console.log("Found:", existing.name);
        console.log("AutoAssign:", existing.settings?.autoAssignToApplications);
    } else {
        console.log("No committee found. Job creation SHOULD fail if active.");
    }

    await mongoose.disconnect();
}

main().catch(console.error);
