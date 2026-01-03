import { MockMeetingProvider } from "./providers/MockMeetingProvider.js";
import { JitsiMeetingProvider } from "./providers/JitsiMeetingProvider.js";
import { GoogleMeetProvider } from "./providers/GoogleMeetProvider.js";

/**
 * Factory to get the active provider instance
 */
const getProvider = () => {
    // Check if Google Credentials exist
    const email = process.env.GOOGLE_CLIENT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;

    // DEBUG: Log the status of credentials (first few chars only for security)
    console.log(`[MeetingService] Env Check -> Email: '${email ? email.substring(0, 5) + '...' : 'MISSING'}', Key: '${key ? 'PRESENT (len=' + key.length + ')' : 'MISSING'}'`);

    if (email && key) {
        console.log("[MeetingService] Using GoogleMeetProvider");
        return new GoogleMeetProvider();
    }

    console.warn("[MeetingService] Google Credentials missing, falling back to Jitsi");
    return new JitsiMeetingProvider();
};

const provider = getProvider();

/**
 * Safe wrapper to create meeting
 * Catches errors so main application flow doesn't break.
 */
export const createMeeting = async (details) => {
    try {
        return await provider.createMeeting(details);
    } catch (error) {
        console.error("[MeetingService] Failed to create meeting with primary provider:", error);

        // Fallback to Jitsi if not already using it
        if (!(provider instanceof JitsiMeetingProvider)) {
            console.warn("[MeetingService] ⚠️ Falling back to JitsiMeetingProvider...");
            try {
                const jitsiProvider = new JitsiMeetingProvider();
                return await jitsiProvider.createMeeting(details);
            } catch (fallbackError) {
                console.error("[MeetingService] Fallback provider also failed:", fallbackError);
            }
        }

        return null; // Graceful degradation if both fail
    }
};

export const updateMeeting = async (meetingId, details) => {
    if (!meetingId) return null;
    try {
        return await provider.updateMeeting(meetingId, details);
    } catch (error) {
        console.error("[MeetingService] Failed to update meeting:", error);
        return null;
    }
};

export const deleteMeeting = async (meetingId) => {
    if (!meetingId) return false;
    try {
        return await provider.deleteMeeting(meetingId);
    } catch (error) {
        console.error("[MeetingService] Failed to delete meeting:", error);
        return false;
    }
};

// Default export if needed, or specific named exports
export const meetingService = {
    createMeeting,
    updateMeeting,
    deleteMeeting
};
