/**
 * AbstractMeetingProvider
 * Defines the strict contract for all meeting providers.
 */
export class AbstractMeetingProvider {
  constructor() {
    if (this.constructor === AbstractMeetingProvider) {
      throw new Error("Abstract classes cannot be instantiated.");
    }
  }

  /**
   * Create a new meeting
   * @param {Object} details - { subject, startTime, endTime, attendees, description }
   * @returns {Promise<Object>} - { meetingId, meetingLink, rawResponse }
   */
  async createMeeting(details) {
    throw new Error("Method 'createMeeting' must be implemented.");
  }

  /**
   * Update an existing meeting
   * @param {string} meetingId
   * @param {Object} details - { startTime, endTime, ... }
   * @returns {Promise<Object>} - { meetingId, meetingLink }
   */
  async updateMeeting(meetingId, details) {
    throw new Error("Method 'updateMeeting' must be implemented.");
  }

  /**
   * Delete a meeting
   * @param {string} meetingId
   * @returns {Promise<boolean>}
   */
  async deleteMeeting(meetingId) {
    throw new Error("Method 'deleteMeeting' must be implemented.");
  }
}
