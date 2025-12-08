import Committee from "@/models/Committee";
import User from "@/models/user";
import { connectDB } from "@/lib/db";

class CommitteeService {
    /**
     * Create a new Committee Template
     */
    async createCommittee(data) {
        await connectDB();
        const {
            name,
            category,
            department,
            members = [], // Default to empty array
            settings,
            createdBy
        } = data;

        // Validate Members
        const userIds = members.map(m => m.userId);
        if (userIds.length > 0) {
            const users = await User.find({ _id: { $in: userIds } });
            if (users.length !== userIds.length) {
                throw new Error("One or more users not found");
            }
        }

        // Validate Roles (Basic check that roles are valid for committee context)
        const allowedRoles = ["interviewer", "technical_reviewer", "hr_reviewer", "decision_maker"];
        for (const m of members) {
            if (!allowedRoles.includes(m.role)) {
                throw new Error(`Invalid committee role: ${m.role}`);
            }
        }

        // Create
        const committee = await Committee.create({
            name,
            category,
            department,
            members: members.map((m, index) => ({
                userId: m.userId,
                role: m.role,
                isPrimary: m.isPrimary ?? true,
                order: index,
                addedBy: createdBy,
                addedAt: new Date()
            })),
            settings: {
                minFeedbackRequired: settings?.minFeedbackRequired || 2,
                requireAllFeedback: settings?.requireAllFeedback || false,
                autoAssignToApplications: settings?.autoAssignToApplications ?? true,
                feedbackDeadlineDays: settings?.feedbackDeadlineDays || 7,
                votingMechanism: settings?.votingMechanism || "average"
            },
            createdBy
        });

        return committee.populate("members.userId", "name email role department");
    }

    /**
     * Update Committee
     */
    async updateCommittee(id, updates, updatedBy) {
        await connectDB();

        const committee = await Committee.findById(id);
        if (!committee) throw new Error("Committee not found");

        const allowedFields = ["name", "description", "settings", "isActive"];

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                committee[field] = updates[field];
            }
        });

        committee.updatedBy = updatedBy;
        await committee.save();

        return committee.populate("members.userId", "name email role department");
    }

    /**
     * Add Member to Committee
     */
    async addMember(committeeId, { userId, role, isPrimary }, addedBy) {
        await connectDB();
        const committee = await Committee.findById(committeeId);
        if (!committee) throw new Error("Committee not found");

        await committee.addMember(userId, role, addedBy, isPrimary);

        return committee.populate("members.userId", "name email role department");
    }

    /**
     * Remove Member from Committee
     */
    async removeMember(committeeId, userId) {
        await connectDB();
        const committee = await Committee.findById(committeeId);
        if (!committee) throw new Error("Committee not found");

        await committee.removeMember(userId);

        return committee.populate("members.userId", "name email role department");
    }

    /**
     * Update Member in Committee
     */
    async updateMember(committeeId, userId, { role, isPrimary }) {
        await connectDB();
        const committee = await Committee.findById(committeeId);
        if (!committee) throw new Error("Committee not found");

        const memberIndex = committee.members.findIndex(m => m.userId.toString() === userId.toString());
        if (memberIndex === -1) throw new Error("Member not found in committee");

        if (role) committee.members[memberIndex].role = role;
        if (isPrimary !== undefined) committee.members[memberIndex].isPrimary = isPrimary;

        await committee.save();
        return committee.populate("members.userId", "name email role department");
    }

    /**
     * Get Active Committees by Category
     */
    async findByCategory(categoryId) {
        await connectDB();
        return Committee.findByCategory(categoryId);
    }

    /**
     * Get Active Committees by Department
     */
    async findByDepartment(department) {
        await connectDB();
        return Committee.findByDepartment(department);
    }

    /**
     * Get Active Committees for a User
     */
    async findForUser(userId) {
        await connectDB();
        return Committee.findForUser(userId);
    }

    /**
     * Get All Active Committees
     */
    async getActiveCommittees() {
        await connectDB();
        return Committee.find({ isActive: true })
            .populate("category", "name")
            .populate("members.userId", "name email role")
            .sort({ createdAt: -1 });
    }

    /**
     * Get by ID
     */
    async getById(id) {
        await connectDB();
        return Committee.findById(id)
            .populate("category", "name")
            .populate("members.userId", "name email role department")
            .populate("createdBy", "name")
            .populate("updatedBy", "name");
    }

    /**
     * Soft Delete
     */
    async deleteCommittee(id) {
        await connectDB();
        const committee = await Committee.findById(id);
        if (!committee) throw new Error("Committee not found");

        committee.isActive = false;
        await committee.save();
        return true;
    }
}

const committeeService = new CommitteeService();
export default committeeService;
