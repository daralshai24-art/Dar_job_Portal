import User from "@/models/user";
import EmailPreference from "@/models/EmailPreference";
import Settings from "@/models/settings";
import ApplicationCommittee from "@/models/ApplicationCommittee";
import { connectDB } from "@/lib/db";

class EmailRoutingService {
    /**
     * Get list of recipients based on Global Rules + Individual Preference + Committee Members
     * This is the main entry point for internal alerts
     */
    async getRecipientsForAlert(alertType, context = {}) {
        await connectDB();

        // 1. Get Global Settings Rules
        const settings = await Settings.findOne();
        const rules = settings?.email?.notificationRules || {};

        // Roles allowed to receive this alert
        const allowedRoles = rules[alertType] || [];

        // 2. Find Global Users (Admins/HR)
        const globalQuery = {
            role: { $in: allowedRoles },
            status: "active"
        };

        let globalRecipients = [];
        if (allowedRoles.length > 0) {
            globalRecipients = await User.find(globalQuery).select("_id email name role department");
            console.log(`[EmailRouting] 🌍 Global Rule ('${alertType}') matched roles: [${allowedRoles.join(", ")}] -> Found ${globalRecipients.length} users.`);
        } else {
            console.log(`[EmailRouting] ⚠️ No global roles configured for alert: ${alertType}`);
        }

        // 3. Find Committee Members (if application context exists)
        let committeeRecipients = [];
        if (context.applicationId) {
            const committee = await ApplicationCommittee.findOne({
                applicationId: context.applicationId,
                status: 'active'
            }).populate("members.userId", "_id email name role");

            if (committee && committee.members) {
                committeeRecipients = committee.members
                    .map(m => m.userId)
                    .filter(u => u); // Filter nulls if user deleted

                console.log(`[EmailRouting] 👥 Committee Lookup for App ${context.applicationId}: Found ${committeeRecipients.length} members.`);
            } else {
                console.log(`[EmailRouting] ℹ️ No active committee found for App ${context.applicationId}`);
            }
        }

        // 4. Merge & Deduplicate
        const allPotentialUsers = [...globalRecipients, ...committeeRecipients];
        const uniqueUsersMap = new Map();
        allPotentialUsers.forEach(u => {
            if (u && u._id) uniqueUsersMap.set(u._id.toString(), u);
        });

        const uniquePotentialRecipients = Array.from(uniqueUsersMap.values());
        console.log(`[EmailRouting] 🔄 Merged Recipients: ${allPotentialUsers.length} -> Unique: ${uniquePotentialRecipients.length}`);

        // 5. Filter by Individual Preferences & Logic
        const validRecipients = [];

        for (const user of uniquePotentialRecipients) {
            // Special Check: Department Managers should only get alerts for their department (Global only)
            const isGlobalOnly = !committeeRecipients.some(c => c._id.toString() === user._id.toString());

            if (isGlobalOnly && user.role === 'department_manager' && context.department) {
                if (user.department !== context.department) {
                    continue; // Skip mismatched dept manager
                }
            }

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

        // 2. Check Global Master Switch
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

        // Fallback for new email types if Mongoose model is stale during dev
        const newTypes = [
            "new_application",
            "hiring_request",
            "interview_scheduled",
            "interview_rescheduled",
            "application_accepted",
            "application_rejected"
        ];

        if (!shouldSend && !preference.adminEmails && newTypes.includes(emailType)) {
            shouldSend = true;
        }

        return {
            shouldSend,
            reason: shouldSend ? "preference_enabled" : "preference_disabled"
        };
    }

    async getRecipientsByRole(role, emailType, context = {}) {
        await connectDB();
        const users = await User.find({ role, status: "active" }).select("_id email name role");
        console.log(`[EmailRouting] getRecipientsByRole('${role}') found ${users.length} active users.`);
        const validRecipients = [];
        for (const user of users) {
            // ... existing check
            const check = await this.shouldSendEmail(user._id, emailType, context);
            if (check.shouldSend) validRecipients.push(user);
        }
        return validRecipients;
    }
}

const emailRoutingService = new EmailRoutingService();
export default emailRoutingService;
