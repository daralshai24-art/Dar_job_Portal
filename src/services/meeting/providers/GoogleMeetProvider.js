import { google } from "googleapis";
import { AbstractMeetingProvider } from "./AbstractMeetingProvider";

/**
 * GoogleMeetProvider
 * Integrates with Google Calendar API to create generic Google Meet links.
 * Requires Google Cloud Service Account credentials in environment variables.
 */
export class GoogleMeetProvider extends AbstractMeetingProvider {
    constructor() {
        super();
        // Initialize auth using environment variables
        // Expects: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_PROJECT_NUMBER (optional)

        const scopes = ["https://www.googleapis.com/auth/calendar"];

        // Formatting private key to handle newlines correctly if passed via one-line env var
        const privateKey = process.env.GOOGLE_PRIVATE_KEY
            ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
            : undefined;

        this.auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: privateKey,
            },
            scopes: scopes,
        });

        this.calendar = google.calendar({ version: "v3", auth: this.auth });
        this.calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
    }

    async createMeeting(details) {
        try {
            console.log("[GoogleMeetProvider] Creating meeting for:", details.subject);
            console.log("[GoogleMeetProvider] Using Calendar ID:", this.calendarId);

            // FALLBACK: Since Service Accounts cannot create native Google Meet links on personal Gmail
            // without DWD, we generate a Jitsi link and put it in the Google Calendar Event.
            // This ensures the user gets a Calendar Event AND a Video Link.
            const uniqueId = "JobPortal-" + Date.now() + "-" + Math.random().toString(36).substring(7);
            const meetingLink = `https://meet.jit.si/${uniqueId}`;

            const extendedDescription = `
JOIN INTERVIEW: 
${meetingLink}

------------------------------------------------
${details.description || ""}
            `.trim();

            const event = {
                summary: details.subject,
                location: meetingLink, // Put link in location for easy clicking
                description: extendedDescription,
                start: {
                    dateTime: new Date(details.startTime).toISOString(),
                    timeZone: "Asia/Riyadh",
                },
                end: {
                    dateTime: this._calculateEndTime(details.startTime),
                    timeZone: "Asia/Riyadh",
                },
                // Removed native conferenceData/attendees to avoid 400/403 errors
            };

            console.log("[GoogleMeetProvider] PAYLOAD:", JSON.stringify(event, null, 2));

            const res = await this.calendar.events.insert({
                calendarId: this.calendarId,
                resource: event,
            });

            const htmlLink = res.data.htmlLink; // The Calendar event link
            const eventId = res.data.id;

            return {
                meetingId: eventId,
                meetingLink: meetingLink, // Return our generated link
                provider: "google_calendar_jitsi", // Distinguish this hybrid mode
                meta: { calendarLink: htmlLink }
            };

        } catch (error) {
            console.error("[GoogleMeetProvider] Error:", error);
            throw error;
        }
    }

    async updateMeeting(meetingId, details) {
        try {
            console.log("[GoogleMeetProvider] Updating meeting:", meetingId, details.subject);

            // Calculate new end time
            const endTime = this._calculateEndTime(details.startTime);

            const eventPatch = {
                summary: details.subject,
                description: details.description, // Updates the description (including link if passed in details, though usually link stays same)
                start: {
                    dateTime: new Date(details.startTime).toISOString(),
                    timeZone: "Asia/Riyadh",
                },
                end: {
                    dateTime: endTime,
                    timeZone: "Asia/Riyadh",
                },
            };

            const res = await this.calendar.events.patch({
                calendarId: this.calendarId,
                eventId: meetingId,
                resource: eventPatch,
            });

            console.log("[GoogleMeetProvider] Update successful. HTML Link:", res.data.htmlLink);

            return {
                meetingId: res.data.id,
                meetingLink: res.data.location, // Usually location contains the link we set
                provider: "google_calendar_jitsi",
                meta: { calendarLink: res.data.htmlLink }
            };

        } catch (error) {
            console.error("[GoogleMeetProvider] Update Error:", error);
            return null; // Return null to signal failure (caller might decide to create new)
        }
    }

    async deleteMeeting(meetingId) {
        try {
            if (!meetingId) return false;
            await this.calendar.events.delete({
                calendarId: this.calendarId,
                eventId: meetingId,
            });
            return true;
        } catch (error) {
            console.error("[GoogleMeetProvider] Delete Error:", error);
            return false;
        }
    }

    _calculateEndTime(startTime) {
        const date = new Date(startTime);
        date.setHours(date.getHours() + 1);
        return date.toISOString();
    }
}
