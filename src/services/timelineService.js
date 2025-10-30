// src/services/timelineService.js
import Timeline from "@/models/Timeline";

/**
 * createTimelineEntry
 * - applicationId: ObjectId/string
 * - performedBy: ObjectId/string | null
 * - performedByName: string
 * - action: string
 * - status: string (optional)
 * - notes: string (optional)
 * - changes: array (optional)
 * - details: mixed (optional)
 */
export async function createTimelineEntry({
  applicationId,
  performedBy = null,
  performedByName = "System",
  action,
  status = null,
  notes = "",
  changes = [],
  details = null,
  score = null
}) {
  const doc = await Timeline.create({
    applicationId,
    performedBy,
    performedByName,
    action,
    status,
    notes,
    changes,
    details,
    score
  });
  return doc;
}
