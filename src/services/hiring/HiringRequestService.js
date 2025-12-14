import HiringRequest from "@/models/HiringRequest";
import Job from "@/models/Job";
import User from "@/models/user";
import { connectDB } from "@/lib/db";
import emailRoutingService from "@/services/email/EmailRoutingService";

class HiringRequestService {

    async createRequest(managerId, requestData) {
        await connectDB();
        const manager = await User.findById(managerId);
        if (!manager) throw new Error("Manager not found");

        const request = await HiringRequest.create({
            requestedBy: managerId,
            department: requestData.department || manager.department,
            ...requestData
        });

        // Notify HR
        await this.notifyNewHiringRequest(request._id);

        return request.populate("requestedBy category");
    }

    async reviewRequest(requestId, reviewerId, decision, notes, jobData = null) {
        await connectDB();
        const reviewer = await User.findById(reviewerId);
        // Validate role...

        const request = await HiringRequest.findById(requestId);
        if (!request) throw new Error("Request not found");

        if (decision === "approved") {
            await request.approve(reviewerId, notes);
            // [New] Auto-convert to job as per Flow 9, allowing overrides
            if (jobData && jobData.createJob) {
                await this.convertToJob(requestId, reviewerId, jobData);
            } else {
                // Fallback or explicit separate step if needed, but assuming approve always tries to create unless strictly decoupled
                // For now, if no jobData but approved, we might still want to create exact copy or wait.
                // The Prompt implies we want to control it. Let's assume if jobData is passed we use it. 
                // If not, we behave as before (auto-create exact copy) OR we strictly rely on the flag.
                await this.convertToJob(requestId, reviewerId, {});
            }
        } else if (decision === "rejected") {
            await request.reject(reviewerId, notes);
        }

        // Notify Manager
        await this.notifyRequestDecision(requestId);

        return request;
    }

    async convertToJob(requestId, createdBy, jobData = {}) {
        await connectDB();
        const request = await HiringRequest.findById(requestId);
        if (request.status !== "approved") throw new Error("Request must be approved first");

        const job = await Job.create({
            title: jobData.title || request.positionTitle,
            description: jobData.description || request.positionDescription,
            location: jobData.location || request.location,
            category: jobData.category || request.category, // Assuming ID is passed if changed
            jobType: jobData.jobType || request.employmentType,
            experience: jobData.experience || request.experience,
            requirements: jobData.requirements || (Array.isArray(request.requiredSkills) ? request.requiredSkills.join('\n') : request.requiredSkills),
            department: jobData.department || request.department,
            status: "draft",
            createdBy
        });

        await request.linkJob(job._id);

        return { request, job };
    }

    async getAllRequests(filters = {}) {
        await connectDB();
        const query = {};
        if (filters.status) query.status = filters.status;
        if (filters.department) query.department = filters.department;
        if (filters.requestedBy) query.requestedBy = filters.requestedBy;

        return HiringRequest.find(query)
            .populate("requestedBy", "name email department")
            .populate("category", "name")
            .populate("reviewedBy", "name")
            .populate("jobId", "_id title")
            .sort({ createdAt: -1 });
    }

    async notifyNewHiringRequest(requestId) {
        const request = await HiringRequest.findById(requestId).populate("requestedBy");
        if (!request) return;

        const recipients = await emailRoutingService.getRecipientsByRole("hr_manager", "hiring_request");

        // Also notify Admins
        const adminRecipients = await emailRoutingService.getRecipientsByRole("admin", "hiring_request", { request });

        // Combine and dedup
        const allRecipients = [...recipients, ...adminRecipients].filter(
            (user, index, self) => index === self.findIndex((t) => t._id.toString() === user._id.toString())
        );

        // Import inside method to avoid circular deps if any, or assume global import
        const emailService = (await import("@/services/email")).default;

        for (const recipient of allRecipients) {
            try {
                await emailService.sendNewHiringRequest({
                    recipientEmail: recipient.email,
                    request
                });
            } catch (error) {
                console.error("Failed to send hiring request notification:", error);
            }
        }
    }

    async notifyRequestDecision(requestId) {
        const request = await HiringRequest.findById(requestId).populate("requestedBy jobId");
        if (!request || !request.requestedBy) return;

        // Notify the manager who requested it
        const emailService = (await import("@/services/email")).default;

        try {
            // Check if they want this email
            const { shouldSend } = await emailRoutingService.shouldSendEmail(
                request.requestedBy._id,
                "hiring_request_decision"
            );

            if (shouldSend) {
                await emailService.sendHiringRequestDecision({
                    recipientEmail: request.requestedBy.email,
                    request,
                    decision: request.status
                });
                console.log(`[HiringRequest] Decision email sent to ${request.requestedBy.email} (${request.status})`);
            } else {
                console.log(`[HiringRequest] Skipped decision email for ${request.requestedBy.email} (Preference disabled)`);
            }
        } catch (error) {
            console.error("Failed to send hiring decision notification:", error);
        }
    }
    async deleteRequests(ids) {
        await connectDB();
        // Option A: Hard Delete
        // return HiringRequest.deleteMany({ _id: { $in: ids } });

        // Option B: Soft Delete (if schema supports it, assuming hard delete for now as per user request 'delete')
        // Check if any request is 'approved' and linked to a job? 
        // For simplicity, we allow deleting any request for now, or restrict active ones.

        return HiringRequest.deleteMany({ _id: { $in: ids } });
    }
}

const hiringRequestService = new HiringRequestService();
export default hiringRequestService;
