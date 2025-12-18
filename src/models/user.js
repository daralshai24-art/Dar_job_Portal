// models/User.js
// ====================  ====================
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { JOB_DEPARTMENTS } from "@/lib/constants";

const userSchema = new mongoose.Schema(
  {
    // ==================== BASIC INFO ====================
    name: {
      type: String,
      required: [true, "الاسم مطلوب"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "البريد الإلكتروني غير صالح"],
    },
    password: {
      type: String,
      required: [true, "كلمة المرور مطلوبة"],
      minlength: [6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"],
      select: false,
    },
    phone: { type: String, trim: true },

    // ==================== ROLE & PERMISSIONS ====================
    role: {
      type: String,
      enum: ["super_admin", "admin", "hr_manager", "hr_specialist", "department_manager", "head_of_department", "direct_manager", "interviewer", "viewer"],
      default: "viewer",
      required: true,
    },
    department: {
      type: String,
      enum: JOB_DEPARTMENTS,
      default: "Other",
    },

    // Default member in all new committees (auto-added)
    isDefaultCommitteeMember: {
      type: Boolean,
      default: false,
    },

    // Stored as JSON - managed by service layer
    permissions: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ==================== STATUS & ACTIVITY ====================
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
      default: "active",
    },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    lastActivity: { type: Date },

    // ==================== PROFILE INFO ====================
    avatar: { type: String },
    bio: { type: String, maxlength: 500 },
    position: { type: String },

    // ==================== SECURITY ====================
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,

    // ==================== METADATA ====================
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// ==================== INDEXES ====================
userSchema.index({ role: 1, status: 1 });
userSchema.index({ department: 1 });
userSchema.index({ createdAt: -1 });

// ==================== MIDDLEWARE - ONLY DATABASE CONCERNS ====================

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ==================== INSTANCE METHODS - SIMPLE HELPERS ONLY ====================

// Compare password (database operation)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked (simple check)
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// ==================== VIRTUAL FIELDS ====================
userSchema.virtual("isActive").get(function () {
  return this.status === "active" && !this.isLocked();
});

// ==================== EXPORT ====================
// Prevent Mongoose Recompilation Error in Next.js (Hot Reload)
// AND ensure schema changes like 'isDefaultCommitteeMember' are picked up instantly in dev
if (process.env.NODE_ENV === "development" && mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model("User", userSchema);