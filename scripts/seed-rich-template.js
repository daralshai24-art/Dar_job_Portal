
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Load env vars manually for script
require("dotenv").config({ path: ".env.local" });

const args = process.argv.slice(2);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
}

// Schemas (simplified for script usage if models not transpiled)
// Ideally we require the actual models if we were using 'type': 'module' or babel-node.
// Since we are running raw node, we'll define minimal schemas or try parsing.
// Actually, let's just use raw mongoose commands with defined schemas here to avoid import issues.

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");
    } catch (err) {
        console.error("DB Connection Error", err);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();

    // 1. Find a category
    const CategorySchema = new mongoose.Schema({ name: String });
    const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

    let category = await Category.findOne();
    if (!category) {
        console.log("No categories found, creating one...");
        category = await Category.create({ name: "General" });
    }

    // 2. Define Job Template Schema
    const JobTemplateSchema = new mongoose.Schema({
        title: { type: String, required: true },
        department: { type: String, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        description: String,
        requirements: String,
        isActive: { type: Boolean, default: true },
        jobType: String,
        experience: String
    });

    const JobTemplate = mongoose.models.JobTemplate || mongoose.model("JobTemplate", JobTemplateSchema);

    // 3. Create Sample Data
    const sampleData = {
        title: "مدير مشروع (Rich Text Test)",
        department: "Engineering", // Assuming Engineering is valid from constants check
        category: category._id,
        jobType: "Full-time",
        experience: "Mid Level",
        // Rich Text HTML
        description: `
      <h2><strong>نبذة عن الوظيفة</strong></h2>
      <p>نبحث عن <strong>مدير مشروع</strong> لقيادة الفريق التقني لدينا. ستتضمن مهامك الرئيسية:</p>
      <ul>
        <li>إدارة الجداول الزمنية للمشروع.</li>
        <li>التنسيق بين الفرق المختلفة.</li>
        <li>ضمان جودة المخرجات.</li>
      </ul>
      <p><br></p>
      <h3><strong>لماذا تنضم إلينا؟</strong></h3>
      <p>بيئة عمل <em>مرنة</em> ومحفزة للابتكار.</p>
    `,
        requirements: `
      <h2><strong>المتطلبات الأساسية</strong></h2>
      <ul>
        <li>خبرة 3 سنوات في إدارة المشاريع.</li>
        <li>إجادة التعامل مع <strong>Agile / Scrum</strong>.</li>
        <li>مهارات تواصل ممتازة.</li>
      </ul>
      <p><br></p>
      <h3><strong>المهارات المفضلة</strong></h3>
      <ol>
        <li>شهادة PMP.</li>
        <li>خبرة في مجال البرمجيات (SaaS).</li>
      </ol>
    `
    };

    try {
        // Delete if exists to avoid dupes
        await JobTemplate.deleteOne({ title: sampleData.title });

        await JobTemplate.create(sampleData);
        console.log("✅ Sample Job Template created successfully!");
        console.log("Title: " + sampleData.title);
    } catch (e) {
        console.error("Error creating template:", e);
    }

    await mongoose.disconnect();
};

run();
