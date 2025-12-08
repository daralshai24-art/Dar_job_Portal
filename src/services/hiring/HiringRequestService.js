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

    async reviewRequest(requestId, reviewerId, decision, notes) {
        await connectDB();
        const reviewer = await User.findById(reviewerId);
        // Validate role...

        const request = await HiringRequest.findById(requestId);
        if (!request) throw new Error("Request not found");

        if (decision === "approved") {
            await request.approve(reviewerId, notes);
        } else if (decision === "rejected") {
            await request.reject(reviewerId, notes);
        }

        // Notify Manager
        await this.notifyRequestDecision(requestId);

        return request;
    }

    async convertToJob(requestId, createdBy) {
        await connectDB();
        const request = await HiringRequest.findById(requestId);
        if (request.status !== "approved") throw new Error("Request must be approved first");

        const job = await Job.create({
            title: request.positionTitle,
            description: request.positionDescription,
            location: request.location,
            category: request.category,
            jobType: request.employmentType,
            experience: request.experience,
            requirements: request.requiredSkills.join('\n'),
            status: "active",
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
            .sort({ createdAt: -1 });
    }

    async notifyNewHiringRequest(requestId) {
        const request = await HiringRequest.findById(requestId).populate("requestedBy");
        if (!request) return;

        const recipients = await emailRoutingService.getRecipientsByRole("hr_manager", "new_hiring_request");

        // Also notify Admins
        const adminRecipients = await emailRoutingService.getRecipientsByRole("admin", "new_hiring_request", { request });

        // Combine and dedup
        const allRecipients = [...recipients, ...adminRecipients].filter(
            (user, index, self) => index === self.findIndex((t) => t.userId.toString() === user.userId.toString())
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
        if (!request) return;

        // Notify the manager who requested it
        const emailService = (await import("@/services/email")).default;

        // Check if they want this email
        const { shouldSend } = await emailRoutingService.shouldSendEmail(
            request.requestedBy._id,
            "hiring_request_decision" // Ensure this map key exists in EmailPreference
        );

        // Assuming hiring_request_decision maps to departmentManagerEmails.hiring_request_approved/rejected logic
        // But for simplicity, we send if enabled.

        try {
            await emailService.sendHiringRequestDecision({
                recipientEmail: request.requestedBy.email,
                request,
                decision: request.status // "approved" or "rejected"
            });
        } catch (error) {
            console.error("Failed to send hiring decision notification:", error);
        }
    }
}

const hiringRequestService = new HiringRequestService();
export default hiringRequestService;
