// src/models/Settings.js
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  general: {
    siteName: { type: String, default: 'موقع التوظيف' },
    siteDescription: { type: String, default: 'منصة التوظيف الرائدة' },
    siteLogo: String,
    language: { type: String, default: 'ar' },
    timezone: { type: String, default: 'Asia/Riyadh' },
    dateFormat: { type: String, default: 'dd/MM/yyyy' },
    maintenanceMode: { type: Boolean, default: false }
  },
  email: {
    smtpHost: String,
    smtpPort: { type: Number, default: 587 },
    smtpUsername: String,
    smtpPassword: String,
    fromEmail: String,
    fromName: String,
    emailNotifications: { type: Boolean, default: true },
    applicationAlerts: { type: Boolean, default: true }
  },
  jobs: {
    autoApproveJobs: { type: Boolean, default: false },
    jobExpiryDays: { type: Number, default: 30 },
    maxApplicationsPerJob: { type: Number, default: 100 },
    allowRemoteWork: { type: Boolean, default: true },
    jobCategories: [String],
    defaultJobStatus: { type: String, default: 'draft' }
  }
}, {
  timestamps: true
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);