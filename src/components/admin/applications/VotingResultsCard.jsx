"use client";

import { Star, CheckCircle, XCircle, Clock, Users, BarChart3 } from "lucide-react";

export default function VotingResultsCard({ committee }) {
    if (!committee || !committee.votingResults) return null;

    const { votingResults } = committee;
    const { averageScore, recommendation, recommendations, submittedCount, totalMembers } = votingResults;
    const pendingCount = totalMembers - submittedCount;

    // Helper to get color/label based on recommendation
    const getRecommendationInfo = (rec) => {
        switch (rec) {
            case "hire":
                return {
                    label: "يوصى بالتوظيف",
                    color: "text-green-600",
                    bg: "bg-green-50",
                    border: "border-green-100",
                    icon: CheckCircle
                };
            case "reject":
                return {
                    label: "لا يوصى بالتوظيف",
                    color: "text-red-600",
                    bg: "bg-red-50",
                    border: "border-red-100",
                    icon: XCircle
                };
            default:
                return {
                    label: "قيد الانتظار",
                    color: "text-yellow-600",
                    bg: "bg-yellow-50",
                    border: "border-yellow-100",
                    icon: Clock
                };
        }
    };

    const statusInfo = getRecommendationInfo(recommendation);
    const StatusIcon = statusInfo.icon;

    // Calculate percentages for the breakdown bars
    const getPercent = (count) => totalMembers > 0 ? (count / totalMembers) * 100 : 0;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
            <h3 className="font-bold flex items-center gap-2 mb-6 text-gray-800 border-b pb-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                نتائج التصويت والتقييم
                <span className="text-xs font-normal text-gray-500 mr-auto flex items-center gap-1">
                    <Clock size={12} />
                    آخر تحديث: {votingResults.lastCalculatedAt ? new Date(votingResults.lastCalculatedAt).toLocaleString('ar-SA') : 'غير متوفر'}
                </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Final Decision / Recommendation */}
                <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed ${statusInfo.border} ${statusInfo.bg}`}>
                    <StatusIcon className={`w-10 h-10 mb-2 ${statusInfo.color}`} />
                    <span className="text-sm text-gray-500 mb-1">القرار المقترح</span>
                    <span className={`text-xl font-bold ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                    <div className="mt-2 text-xs text-center text-gray-400">
                        بناءً على {statusInfo.label === "قيد الانتظار" ? "اكتمال التصويت" : suggestionRuleText(committee.settings?.votingMechanism)}
                    </div>
                </div>

                {/* 2. Average Score */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${averageScore >= star
                                        ? "text-yellow-400 fill-yellow-400"
                                        : averageScore >= star - 0.5
                                            ? "text-yellow-400 fill-yellow-400 opacity-50" // Half star visual approx
                                            : "text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-3xl font-bold text-gray-800 mb-1">
                        {averageScore} <span className="text-sm text-gray-400 font-normal">/ 5.0</span>
                    </span>
                    <span className="text-sm text-gray-500">متوسط نقاط التقييم</span>
                </div>

                {/* 3. Voting Breakdown */}
                <div className="flex flex-col justify-center gap-3 p-4">
                    {/* Participation */}
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="flex items-center gap-1 text-gray-600">
                            <Users size={14} /> نسبة المشاركة
                        </span>
                        <span className="font-bold text-gray-800">
                            {submittedCount} <span className="text-gray-400 font-normal">من {totalMembers}</span>
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full bg-indigo-500 transition-all duration-500"
                            style={{ width: `${getPercent(submittedCount)}%` }}
                        ></div>
                    </div>

                    {/* Breakdown Bars */}
                    <div className="space-y-2">
                        <VoteBar
                            label="يوصي بشدة"
                            count={recommendations?.recommend || 0}
                            total={submittedCount} // % of submitted, or total? Usually total looks better for progress
                            color="bg-green-500"
                            textColor="text-green-700"
                        />
                        <VoteBar
                            label="لا يوصي"
                            count={recommendations?.not_recommend || 0}
                            total={submittedCount}
                            color="bg-red-500"
                            textColor="text-red-700"
                        />
                        <VoteBar
                            label="معلق"
                            count={recommendations?.pending || pendingCount}
                            total={totalMembers} // Use total members for pending to show remaining
                            color="bg-yellow-400"
                            textColor="text-yellow-700"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function VoteBar({ label, count, total, color, textColor }) {
    if (total === 0 && count === 0) return null; // Hide if no activity
    const percent = total > 0 ? (count / total) * 100 : 0;

    return (
        <div className="flex items-center text-xs">
            <span className={`w-20 ${textColor} font-medium`}>{label}</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full mx-2 overflow-hidden">
                <div
                    className={`h-full ${color}`}
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
            <span className="text-gray-500 w-4 text-left">{count}</span>
        </div>
    );
}

function suggestionRuleText(mechanism) {
    if (mechanism === 'majority') return 'الأغلبية';
    if (mechanism === 'consensus') return 'الإجماع';
    return 'المعدل العام';
}
