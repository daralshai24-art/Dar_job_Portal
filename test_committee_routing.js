const mongoose = require('mongoose');
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/daralshai_jobs";

async function testCommitteeRouting() {
    console.log("🔌 Connecting to DB...");
    await mongoose.connect(MONGODB_URI);

    // 1. Models
    const ApplicationCommittee = mongoose.models.ApplicationCommittee || mongoose.model("ApplicationCommittee", new mongoose.Schema({ status: String, applicationId: mongoose.Schema.Types.ObjectId, members: Array }));
    const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({ name: String, email: String, role: String }));
    const Settings = mongoose.models.Settings || mongoose.model("Settings", new mongoose.Schema({ email: Object }));

    // 2. Find an active committee
    const committee = await ApplicationCommittee.findOne({ status: "active" });

    if (!committee) {
        console.log("❌ No active committee found in DB. Cannot test committee routing directly.");
        await mongoose.disconnect();
        return;
    }

    const appId = committee.applicationId;
    console.log(`\n🎯 Testing with Application ID: ${appId}`);

    // 3. Mock EmailRoutingService Logic
    console.log("\n🕵️ SIMULATING ROUTING SERVICE...");

    const alertType = "interview_scheduled";

    // -- Global Rules
    const settings = await Settings.findOne();
    const rules = settings?.email?.notificationRules || {};
    const allowedRoles = rules[alertType] || [];

    const globalRecipients = await User.find({ role: { $in: allowedRoles }, status: "active" });
    console.log(`   Found ${globalRecipients.length} GLOBAL recipients (Admin/HR)`);

    // -- Committee Lookup
    let committeeRecipients = [];
    const fetchedCommittee = await ApplicationCommittee.findOne({ applicationId: appId }).populate("members.userId");

    // MOCK INJECTION: Create a dummy user in memory if none exists
    const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        name: "Mock Interviewer",
        email: "mock.interviewer@example.com",
        role: "interviewer"
    };

    if (fetchedCommittee) {
        // Inject mock member for test
        fetchedCommittee.members.push({ userId: mockUser, role: "interviewer", status: "pending" });

        committeeRecipients = fetchedCommittee.members.map(m => m.userId).filter(u => u);
        console.log(`   Found ${committeeRecipients.length} COMMITTEE recipients (including Mock)`);
    }

    // Merge
    const allParams = [...globalRecipients, ...committeeRecipients];
    const uniqueMap = new Map();
    allParams.forEach(u => uniqueMap.set(u._id.toString(), u));
    const finalRecipients = Array.from(uniqueMap.values());

    console.log(`\n✅ FINAL RECIPIENT LIST (${finalRecipients.length}):`);
    finalRecipients.forEach(u => {
        const isCommittee = committeeRecipients.some(c => c._id.toString() === u._id.toString());
        const isGlobal = globalRecipients.some(g => g._id.toString() === u._id.toString());
        const source = [];
        if (isGlobal) source.push("Global Rule");
        if (isCommittee) source.push("Committee Member");

        console.log(`   - ${u.name} (${u.email}) [${source.join(" + ")}]`);
    });

    const hasCommitteeArgs = finalRecipients.some(r => r.email === "mock.interviewer@example.com");
    if (hasCommitteeArgs) {
        console.log("\n🎉 SUCCESS: Mock committee member was correctly merged!");
    } else {
        console.log("\n❌ FAIL: Mock member missing.");
    }

    await mongoose.disconnect();
}

testCommitteeRouting().catch(console.error);
