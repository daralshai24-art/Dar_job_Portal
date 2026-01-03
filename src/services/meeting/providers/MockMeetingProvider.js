import { AbstractMeetingProvider } from "./AbstractMeetingProvider.js";

/**
 * MockMeetingProvider
 * A safe implementation that generates dummy links.
 * Useful for local development and testing without external API credentials.
 */
export class MockMeetingProvider extends AbstractMeetingProvider {
  async createMeeting(details) {
    console.log("[MockMeetingProvider] Creating meeting:", details);

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    const meetingId = `mock-${Date.now()}`;
    // Generate a consistent dummy link
    const meetingLink = `https://meet.google.com/mock-${meetingId}`;

    return {
      meetingId,
      meetingLink,
      provider: "mock"
    };
  }

  async updateMeeting(meetingId, details) {
    console.log(`[MockMeetingProvider] Updating meeting ${meetingId}:`, details);

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      meetingId,
      meetingLink: `https://meet.google.com/mock-${meetingId}`, // Link usually stays same
      provider: "mock"
    };
  }

  async deleteMeeting(meetingId) {
    console.log(`[MockMeetingProvider] Deleting meeting ${meetingId}`);
    return true;
  }
}
