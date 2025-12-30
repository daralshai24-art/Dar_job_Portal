import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

export default async function sitemap() {
    // TODO: Update this with your actual production URL
    const baseUrl = "https://jobs.daralshai.com";

    // Static routes
    const routes = [
        "",
        "/jobs",
        "/login",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
    }));

    try {
        await connectDB();
        const jobs = await Job.find({ status: "active" }).select("_id updatedAt").lean();

        const jobRoutes = jobs.map((job) => ({
            url: `${baseUrl}/jobs/${job._id}`,
            lastModified: job.updatedAt,
            changeFrequency: "weekly",
            priority: 0.8,
        }));

        return [...routes, ...jobRoutes];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return routes;
    }
}
