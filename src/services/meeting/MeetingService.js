import { MockMeetingProvider } from "./providers/MockMeetingProvider";
import { JitsiMeetingProvider } from "./providers/JitsiMeetingProvider";
// import { GoogleMeetProvider } from "./providers/GoogleMeetProvider"; // Future

/**
 * Factory to get the active provider instance
 */
const getProvider = () => {
    // Use Jitsi for real video meetings
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
        console.error("[MeetingService] Failed to create meeting:", error);
        return null; // Graceful degradation
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
