import mongoose from 'mongoose';

const visitorLogSchema = new mongoose.Schema({
    visitorId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    path: {
        type: String,
        required: true
    },
    ip: {
        type: String
    },
    userAgent: {
        type: String
    },
    deviceType: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet', 'unknown'],
        default: 'unknown'
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: { expires: '30d' } // Auto-delete logs older than 30 days
    },
    metadata: {
        type: Map,
        of: String
    }
});

// Compound index for frequent queries (e.g., unique visitors per day)
visitorLogSchema.index({ visitorId: 1, timestamp: -1 });

export default mongoose.models.VisitorLog || mongoose.model('VisitorLog', visitorLogSchema);
