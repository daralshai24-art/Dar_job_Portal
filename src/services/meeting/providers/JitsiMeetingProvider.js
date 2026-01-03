import { AbstractMeetingProvider } from "./AbstractMeetingProvider.js";

/**
 * JitsiMeetingProvider
 * Generates real, working video meeting links using Jitsi Meet.
 * No API (Auth) required. Free and open source.
 */
export class JitsiMeetingProvider extends AbstractMeetingProvider {

    constructor() {
        super();
        this.baseUrl = "https://meet.jit.si";
    }

    async createMeeting(details) {
        console.log("[JitsiMeetingProvider] Creating meeting for:", details.subject);

        // Create a unique, secure room name
        // Format: CompanyName-Interview-Timestamp-Random
        const safeSubject = (details.subject || "Interview").replace(/[^a-zA-Z0-9]/g, "");
        const uniqueId = Math.random().toString(36).substring(7);
        const roomName = `JobPortal-${safeSubject}-${Date.now()}-${uniqueId}`;

        const meetingLink = `${this.baseUrl}/${roomName}`;

        return {
            meetingId: roomName,
            meetingLink: meetingLink,
            provider: "jitsi"
        };
    }

    async updateMeeting(meetingId, details) {
        // Jitsi links are static based on room name, so update doesn't change the link
        // unless we want to generate a new room. For now, keep same room.
        return {
            meetingId,
            meetingLink: `${this.baseUrl}/${meetingId}`,
            provider: "jitsi"
        };
    }

    async deleteMeeting(meetingId) {
        // Jitsi rooms are ephemeral, nothing to delete server-side.
        return true;
    }
}
