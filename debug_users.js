const mongoose = require('mongoose');
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/daralshai_jobs";

async function checkUsers() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI);
    }

    // Define minimal schema to read users
    const userSchema = new mongoose.Schema({
        name: String,
        email: String,
        role: String,
        department: String,
        status: String
    });
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    const users = await User.find({});

    console.log("\n--- USER REGISTRY ---");
    users.forEach(u => {
        console.log(`[${u.role.toUpperCase()}] ${u.name} (${u.email}) - Status: ${u.status}`);
    });
    console.log("---------------------\n");

    await mongoose.disconnect();
}

checkUsers().catch(console.error);
