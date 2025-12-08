import User from "@/models/user";
import EmailPreference from "@/models/EmailPreference";
import { connectDB } from "@/lib/db";

class EmailRoutingService {
    /**
     * Check if a user should receive a specific email
     */
    async shouldSendEmail(userId, emailType, context = {}) {
        await connectDB();

        // 1. Get Preferences
        let preference = await EmailPreference.findOne({ userId });

        if (!preference) {
            // Create defaults if not exists
            const user = await User.findById(userId);
            if (user) {
                preference = await EmailPreference.createDefaultForUser(userId, user.role);
            } else {
                return { shouldSend: false, reason: "user_not_found" };
            }
        }

        // 2. Check Quiet Hours
        if (preference.isQuietHours()) {
            return { shouldSend: false, reason: "quiet_hours" };
        }

        // 3. Extract Context for Filters
        const categoryId = context.categoryId || context.application?.jobId?.category;

        // 4. Check Permission
        const shouldSend = preference.shouldReceiveEmail(emailType, categoryId);

        return {
            shouldSend,
            reason: shouldSend ? "preference_enabled" : "preference_disabled"
        };
    }

    /**
     * Get list of recipients for an email type
     */
    async getRecipientsForEmail(emailType, context = {}) {
        await connectDB();
        const categoryId = context.categoryId || context.application?.jobId?.category;

        // Get ALL users who *potentially* want this email (based on DB query)
        const preferences = await EmailPreference.findUsersForEmail(emailType, categoryId);

        // Double check specific logic (like Quiet Hours) in memory
        const recipients = [];

        for (const pref of preferences) {
            // Re-verify strictly including quiet hours
            const check = await this.shouldSendEmail(pref.userId._id, emailType, context);

            if (check.shouldSend) {
                recipients.push({
                    userId: pref.userId._id,
                    email: pref.userId.email,
                    name: pref.userId.name,
                    role: pref.userId.role
                });
            }
        }

        return recipients;
    }

    /**
     * Helper to check multiple users at once
     */
    async batchCheckRecipients(userIds, emailType, context = {}) {
        const results = await Promise.all(
            userIds.map(id => this.shouldSendEmail(id, emailType, context))
        );

        return userIds.filter((_, index) => results[index].shouldSend);
    }

    /**
     * Get recipients by Role (e.g. "notify all HR managers")
     */
    async getRecipientsByRole(role, emailType, context = {}) {
        await connectDB();
        const users = await User.find({ role, status: "active" }).select("_id email name role");

        const validRecipients = [];
        for (const user of users) {
            const check = await this.shouldSendEmail(user._id, emailType, context);
            if (check.shouldSend) {
                validRecipients.push(user);
            }
        }
        return validRecipients;
    }

    /**
     * Get recipients by Department
     */
    async getRecipientsByDepartment(department, emailType, context = {}) {
        await dbConnect();
        const users = await User.find({ department, status: "active" }).select("_id email name role");

        const validRecipients = [];
        for (const user of users) {
            const check = await this.shouldSendEmail(user._id, emailType, context);
            if (check.shouldSend) {
                validRecipients.push(user);
            }
        }
        return validRecipients;
    }

    /**
     * Get Department Managers for a specific department
     */
    async getDepartmentManagers(department, emailType, context = {}) {
        await dbConnect();
        // Special case: Department Managers are defined by role AND managedDepartment (if schema supported it, currently relying on department field or role logic)
        // Adjusting based on user model: "managedDepartment" exists for department_manager role? 
        // Checking User Model: "managedDepartment which is only set for department_manager roles"

        const users = await User.find({
            role: "department_manager",
            // managedDepartment: department // Assuming this field exists based on requirements description, checking User.js...
            // User.js doesn't explicitly show 'managedDepartment' in the file I read earlier? 
            // User.js text: "managedDepartment which is only set for department_manager roles to indicate which department they oversee" -- wait, was this in the prompt description or the file?
            // Reading User.js again...
            // User.js file content: It has `department` enum. It does NOT have `managedDepartment`.
            // The prompt description said: "managedDepartment which is only set for department_manager roles... You must not modify this model's structure". 
            // WAIT. If the model doesn't have it, I can't query it.
            // I will assume `department` field is sufficient for now or if they meant the enum.
            department: department,
            status: "active"
        }).select("_id email name role");

        const validRecipients = [];
        for (const user of users) {
            const check = await this.shouldSendEmail(user._id, emailType, context);
            if (check.shouldSend) {
                validRecipients.push(user);
            }
        }
        return validRecipients;
    }
}

const emailRoutingService = new EmailRoutingService();
export default emailRoutingService;
