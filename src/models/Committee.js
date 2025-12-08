import mongoose from "mongoose";

const committeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },
        department: {
            type: String,
            enum: ["HR", "IT", "Finance", "Operations", "Marketing", "Sales", "Other"],
            required: true,
            index: true,
        },

        // Committee Members Template
        members: [{
            _id: false, // Disable auto ID generation for embedded objects
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            role: {
                type: String,
                enum: ["supervisor", "manager", "head_department", "department_manager"],
                required: true
            },
            isPrimary: { type: Boolean, default: true },
            order: { type: Number, default: 0 },
            addedAt: { type: Date, default: Date.now },
            addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }],

        // Default Configuration
        settings: {
            minFeedbackRequired: { type: Number, default: 2, min: 1 },
            requireAllFeedback: { type: Boolean, default: false },
            autoAssignToApplications: { type: Boolean, default: true },
            feedbackDeadlineDays: { type: Number, default: 7 },
            votingMechanism: {
                type: String,
                enum: ["average", "majority", "consensus"],
                default: "average"
            }
        },

        isActive: { type: Boolean, default: true, index: true },
        description: String,

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true }
);

// Indexes
committeeSchema.index({ category: 1, isActive: 1 });
committeeSchema.index({ department: 1, isActive: 1 });
committeeSchema.index({ "members.userId": 1 });

// Instance Methods
committeeSchema.methods.addMember = async function (userId, role, addedBy, isPrimary = true) {
    if (this.hasMember(userId)) {
        throw new Error("User is already a member of this committee");
    }

    this.members.push({
        userId,
        role,
        isPrimary,
        order: this.members.length,
        addedBy,
        addedAt: new Date()
    });

    return this.save();
};

committeeSchema.methods.removeMember = async function (userId) {
    this.members = this.members.filter(m => m.userId.toString() !== userId.toString());

    // Reorder remaining members
    this.members.forEach((member, index) => {
        member.order = index;
    });

    return this.save();
};

committeeSchema.methods.hasMember = function (userId) {
    return this.members.some(m => m.userId.toString() === userId.toString());
};

// Static Methods
committeeSchema.statics.findByCategory = function (categoryId) {
    return this.findOne({ category: categoryId, isActive: true })
        .populate("members.userId", "name email role department");
};

committeeSchema.statics.findByDepartment = function (department) {
    return this.find({ department, isActive: true })
        .populate("members.userId", "name email role department");
};

committeeSchema.statics.findForUser = function (userId) {
    return this.find({ "members.userId": userId, isActive: true })
        .populate("category", "name");
};

export default mongoose.models.Committee || mongoose.model("Committee", committeeSchema);
