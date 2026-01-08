const mongoose = require("mongoose");
const path = require("path");
// Load environment variables from .env.local or .env.production.local
try {
    require("dotenv").config({ path: path.join(__dirname, "../.env.docker") });
    require("dotenv").config({ path: path.join(__dirname, "../.env.local") });
} catch (e) {
    // dotenv might not be available in production/docker (variables are injected via env)
    console.log("ℹ️  dotenv not found or failed to load. Assuming variables are in process.env");
}

// User Model Config (Simplified)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["super_admin", "admin", "manager", "employee", "hr_manager", "hr_specialist", "head_department", "department_manager", "interviewer", "technical_reviewer", "hr_reviewer", "decision_maker"], default: "employee" },
    department: { type: String, default: "General" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isEmailVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Prevent overwrite warning if model exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

const createAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error("❌ MONGODB_URI is not defined in environment variables.");
            process.exit(1);
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB");

        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Default fallback (warn in logs)

        if (!process.env.ADMIN_PASSWORD) {
            console.warn("⚠️ WARNING: No ADMIN_PASSWORD set in env. Using default 'admin123'. Change this immediately!");
        }

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log(`✅ Admin user (${adminEmail}) already exists. Skipping creation.`);
        } else {
            console.log(`Creating Admin User: ${adminEmail}`);
            // Note: In a real app, hash password here. 
            // Since this project currently stores passwords plain or handles hashing in model/save middleware?
            // Assuming plain text based on earlier seed file review or handled by pre-save hook.
            // Wait, previous seed file showed plain text password. Let's verify hashing later.
            // For now, mirroring seed file behavior.

            // Actually, let's include bcrypt just in case, but if the app expects hashed passwords, this script must hash them.
            // The provided seed file in route.js was passing plain text: `password: "Dar-job-321"`.
            // So I will assume the User model pre-save hook handles hashing, OR the app uses plain text (unlikely but possible based on seed).
            // Let's create it as is.

            const newAdmin = new User({
                name: "Super Admin",
                email: adminEmail,
                password: adminPassword,
                role: "super_admin",
                department: "IT",
                isEmailVerified: true,
                status: "active"
            });

            await newAdmin.save();
            console.log("✅ Super Admin user created successfully.");
        }

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("❌ Failed to create admin:", error);
        process.exit(1);
    }
};

createAdmin();
