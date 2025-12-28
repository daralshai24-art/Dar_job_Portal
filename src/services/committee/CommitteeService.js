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
            type = 'general',
            category,
            department,
            members = [], // Default to empty array
            settings,
            createdBy
        } = data;


        // 1. Resolve members (Use provided members OR find defaults)
        let membersList = members;

        // Validation: Prevent Duplicate Department Committee
        if (type === 'department' && department) {
            const existingInternal = await Committee.findOne({
                department,
                isActive: true,
                type: 'department'
            });
            if (existingInternal) {
                throw new Error(`يوجد بالفعل لجنة نشطة لقسم ${department}`);
            }
        }

        // If no members provided, try to find default members from Users
        if (!membersList || membersList.length === 0) {
            const defaultUsers = await User.find({ isDefaultCommitteeMember: true });
            if (defaultUsers && defaultUsers.length > 0) {
                membersList = defaultUsers.map(u => {
                    let role = "decision_maker";
                    if (u.role === "hr_manager" || u.role === "hr_specialist" || u.department === "HR") role = "hr_reviewer";
                    if (u.role === "technical_lead" || u.role === "technical_reviewer") role = "technical_reviewer";

                    return {
                        userId: u._id,
                        role: role,
                        isPrimary: true
                    };
                });
            }
        }

        // Create
        const committee = await Committee.create({
            name,
            type,
            category: type === 'category' ? category : undefined,
            department: type === 'department' ? department : undefined,
            members: (membersList || []).map((m, index) => ({
                userId: m.userId._id || m.userId, // Handle populated or ID
                role: m.role || "interviewer",
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

        const allowedFields = ["name", "type", "department", "category", "description", "settings", "isActive"];

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                committee[field] = updates[field];
            }
        });

        // Validation: Prevent Duplicate Department Committee on Update
        if ((committee.type === 'department' || updates.type === 'department') && (committee.department || updates.department)) {
            const targetDept = updates.department || committee.department;
            const existingInternal = await Committee.findOne({
                department: targetDept,
                isActive: true,
                type: 'department',
                _id: { $ne: id }
            });
            if (existingInternal) {
                throw new Error(`يوجد بالفعل لجنة نشطة لقسم ${targetDept}`);
            }
        }

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
