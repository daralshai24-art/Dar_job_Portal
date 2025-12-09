import User from "@/models/user";
import EmailPreference from "@/models/EmailPreference";
import Settings from "@/models/settings";
import { connectDB } from "@/lib/db";

class EmailRoutingService {
    /**
     * Get list of recipients based on Global Rules + Individual Preference
     * This is the main entry point for internal alerts
     */
    async getRecipientsForAlert(alertType, context = {}) {
        await connectDB();

        // 1. Get Global Settings Rules
        const settings = await Settings.findOne();
        const rules = settings?.email?.notificationRules || {};

        // Roles allowed to receive this alert (e.g. ["admin", "hr_manager"])
        const allowedRoles = rules[alertType] || [];

        if (allowedRoles.length === 0) {
            console.log(`[EmailRouting] No roles configured for alert: ${alertType}`);
            return [];
        }

        // 2. Find Users with these roles
        // Also respect department filter if provided (e.g. only HR Manager of "IT")
        const query = {
            role: { $in: allowedRoles },
            status: "active"
        };

        if (context.department) {
            // If alert is scoped to a department (e.g. new HIT request), 
            // we might want to filter users.
            // BUT: Admins usually see all. HR Managers usually see all. 
            // Department Managers see only their own.
            // Strategy: simple role fetch first, then filter in memory/loop if needed or sophisticated query

            // For simplicity in this architecture:
            // We fetch all matching roles, then filter out Dept Managers who don't match the dept
            // Admins/HR are typically global
        }

        const potentialRecipients = await User.find(query).select("_id email name role department");

        // 3. Filter by Individual Preferences & Logic
        const validRecipients = [];

        for (const user of potentialRecipients) {
            // Special Check: Department Managers should only get alerts for their department
            if (user.role === 'department_manager' && context.department) {
                if (user.department !== context.department) {
                    continue;
                }
            }

            // Check EmailPreference (Opt-out)
            // We treat "alertType" as the emailType for preference checking
            const check = await this.shouldSendEmail(user._id, alertType, context);

            if (check.shouldSend) {
                validRecipients.push({
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                });
            }
        }

        return validRecipients;
    }

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

        // 2. Check Global Master Switch (if user disabled all notifications)
        if (!preference.emailNotificationsEnabled) {
            return { shouldSend: false, reason: "user_disabled_all" };
        }

        // 3. Check Quiet Hours
        if (preference.isQuietHours()) {
            return { shouldSend: false, reason: "quiet_hours" };
        }

        // 4. Extract Context for Filters
        const categoryId = context.categoryId || context.application?.jobId?.category;

        // 5. Check Permission (Specific setting)
        let shouldSend = preference.shouldReceiveEmail(emailType, categoryId);

        // Fallback for new email types if Mongoose model is stale during dev (HMR issue)
        if (!shouldSend && !preference.adminEmails && ["new_application", "hiring_request"].includes(emailType)) {
            shouldSend = true;
        }

        return {
            shouldSend,
            reason: shouldSend ? "preference_enabled" : "preference_disabled"
        };
    }

    // Legacy methods kept for backward compatibility if needed, 
    // but getRecipientsForAlert should be preferred for system alerts.

    async getRecipientsByRole(role, emailType, context = {}) {
        // Re-implemented to be safe
        await connectDB();
        const users = await User.find({ role, status: "active" }).select("_id email name role");
        const validRecipients = [];
        for (const user of users) {
            const check = await this.shouldSendEmail(user._id, emailType, context);
            if (check.shouldSend) validRecipients.push(user);
        }
        return validRecipients;
    }
}

const emailRoutingService = new EmailRoutingService();
export default emailRoutingService;
