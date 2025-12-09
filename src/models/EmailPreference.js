import mongoose from "mongoose";

const emailPreferenceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },

        // Master Switch
        emailNotificationsEnabled: { type: Boolean, default: true },

        // HR Controls (Applicant Lifecycle)
        applicantEmails: {
            application_received: { type: Boolean, default: true },
            interview_scheduled: { type: Boolean, default: true },
            interview_rescheduled: { type: Boolean, default: true },
            application_rejected: { type: Boolean, default: true },
            application_accepted: { type: Boolean, default: true }
        },

        // Committee Member Controls
        committeeEmails: {
            feedback_request: { type: Boolean, default: true },
            feedback_reminder: { type: Boolean, default: true },
            application_assigned: { type: Boolean, default: true },
            committee_completed: { type: Boolean, default: true }
        },

        // Stakeholder/Admin Controls
        statusChangeEmails: {
            application_submitted: { type: Boolean, default: true },
            application_reviewed: { type: Boolean, default: true },
            interview_scheduled: { type: Boolean, default: true },
            interview_completed: { type: Boolean, default: true },
            application_rejected: { type: Boolean, default: false },
            application_hired: { type: Boolean, default: true }
        },

        // Department Manager Controls
        departmentManagerEmails: {
            hiring_request_approved: { type: Boolean, default: true },
            hiring_request_rejected: { type: Boolean, default: true },
            new_application_in_department: { type: Boolean, default: true },
            application_status_changed: { type: Boolean, default: false },
            interview_scheduled_department: { type: Boolean, default: true },
            feedback_request: { type: Boolean, default: true },
            committee_completed: { type: Boolean, default: true }
        },

        // Admin/HR General Alerts
        adminEmails: {
            new_application: { type: Boolean, default: true },
            hiring_request: { type: Boolean, default: true }
        },

        // Category Filtering
        categoryFilters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // Empty = All

        // Delivery Settings
        deliveryPreferences: {
            digestEnabled: { type: Boolean, default: false },
            digestFrequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
            quietHours: {
                enabled: { type: Boolean, default: false },
                start: { type: String, default: "22:00" }, // HH:mm
                end: { type: String, default: "08:00" }
            }
        }
    },
    { timestamps: true }
);

// Methods
emailPreferenceSchema.methods.shouldReceiveEmail = function (emailType, categoryId = null) {
    if (!this.emailNotificationsEnabled) return false;

    // Check Category Filter
    if (categoryId && this.categoryFilters && this.categoryFilters.length > 0) {
        const hasCategory = this.categoryFilters.some(id => id.toString() === categoryId.toString());
        if (!hasCategory) return false;
    }

    // Find preference in groups
    const parts = emailType.split('_');
    // Simple mapping strategy or check all groups

    // Applicant Emails
    if (emailType in this.applicantEmails) return this.applicantEmails[emailType];

    // Committee Emails
    if (emailType in this.committeeEmails) return this.committeeEmails[emailType];

    // Status Change Emails
    if (emailType in this.statusChangeEmails) return this.statusChangeEmails[emailType];

    // Dept Manager Emails
    if (emailType in this.departmentManagerEmails) return this.departmentManagerEmails[emailType];

    // Admin Emails
    // Fallback: If adminEmails is undefined (schema update not applied to old doc), use defaults
    const adminDefaults = { new_application: true, hiring_request: true };
    const adminPrefs = this.adminEmails || adminDefaults;

    if (emailType in adminPrefs) return adminPrefs[emailType];

    return false;
};

emailPreferenceSchema.methods.isQuietHours = function () {
    if (!this.deliveryPreferences.quietHours.enabled) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = this.deliveryPreferences.quietHours.start.split(':').map(Number);
    const [endH, endM] = this.deliveryPreferences.quietHours.end.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (startTotal > endTotal) {
        // Spans midnight (e.g. 22:00 to 08:00)
        return currentMinutes >= startTotal || currentMinutes <= endTotal;
    } else {
        // Same day (e.g. 09:00 to 17:00)
        return currentMinutes >= startTotal && currentMinutes <= endTotal;
    }
};

// Statics
emailPreferenceSchema.statics.createDefaultForUser = async function (userId, userRole) {
    const defaults = this.getDefaultsByRole(userRole);
    return this.create({ userId, ...defaults });
};

emailPreferenceSchema.statics.getDefaultsByRole = function (role) {
    const base = { emailNotificationsEnabled: true };

    if (role === "super_admin" || role === "admin") {
        return {
            ...base,
            adminEmails: {
                new_application: true,
                hiring_request: true
            }
        }; // All true by default
    }

    if (role === "hr_manager") {
        return {
            ...base,
            statusChangeEmails: {
                application_submitted: true,
                application_reviewed: true,
                interview_scheduled: true,
                interview_completed: true,
                application_rejected: false,
                application_hired: true
            },
            adminEmails: {
                new_application: true,
                hiring_request: true
            }
            // ... others default to true/defined schema defaults
        };
    }

    if (role === "hr_specialist") {
        return {
            ...base,
            applicantEmails: {
                application_received: false,
                // others true 
            }
        };
    }

    if (role === "department_manager") {
        return {
            ...base,
            applicantEmails: {
                application_received: false,
                interview_scheduled: false,
                interview_rescheduled: false,
                application_rejected: false,
                application_accepted: false
            }
        };
    }

    if (role === "interviewer") {
        return {
            ...base,
            emailNotificationsEnabled: true,
            // Disable most, enable committee
            statusChangeEmails: {
                application_submitted: false,
                application_reviewed: false,
                interview_scheduled: false,
                interview_completed: false,
                application_rejected: false,
                application_hired: false
            }
        };
    }

    if (role === "viewer") {
        return { emailNotificationsEnabled: false };
    }

    return base;
};

emailPreferenceSchema.statics.findUsersForEmail = async function (emailType, categoryId = null) {
    // Find users who have notifications enabled
    // If categoryId is provided, user must either have NO filters OR have that category in filters

    const query = { emailNotificationsEnabled: true };

    if (categoryId) {
        query.$or = [
            { categoryFilters: { $size: 0 } },
            { categoryFilters: categoryId }
        ];
    }

    const preferences = await this.find(query).populate("userId", "name email role");

    // Filter in memory for specific email type check (since strict DB query for nested fields is complex with defaults)
    return preferences.filter(pref => pref.shouldReceiveEmail(emailType, categoryId));
};

export default mongoose.models.EmailPreference || mongoose.model("EmailPreference", emailPreferenceSchema);
