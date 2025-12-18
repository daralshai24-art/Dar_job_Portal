// scripts/seed_templates.js
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define minimal schema for seeding to avoid import issues with ES modules
const jobTemplateSchema = new Schema({
    title: String,
    department: String,
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    description: String,
    requirements: String,
    skills: [String],
    jobType: String,
    experience: String,
    isActive: Boolean
}, { timestamps: true });

const JobTemplate = mongoose.models.JobTemplate || mongoose.model("JobTemplate", jobTemplateSchema);
const Category = mongoose.models.Category || mongoose.model("Category", new Schema({ name: String }));

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Find a category
        const category = await Category.findOne();
        if (!category) {
            console.log("No categories found. Please create a category first.");
            return;
        }

        const templateData = {
            title: "Senior Frontend Engineer (Sample)",
            department: "IT",
            category: category._id,
            description: "We are looking for an experienced Frontend Engineer to join our team. You will be responsible for building high-quality user interfaces using React and Next.js.",
            requirements: "- 5+ years of experience in web development\n- Strong proficiency in JavaScript, HTML, CSS\n- Experience with React and state management libraries",
            skills: ["React", "Next.js", "TailwindCSS", "TypeScript"],
            jobType: "Full-time",
            experience: "Senior Level",
            isActive: true
        };

        const existing = await JobTemplate.findOne({ title: templateData.title });
        if (existing) {
            console.log("Sample template already exists.");
        } else {
            await JobTemplate.create(templateData);
            console.log("Sample template created successfully!");
        }

        mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding template:", error);
    }
}

seed();
