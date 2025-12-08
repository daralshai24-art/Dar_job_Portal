"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, User as UserIcon, Loader2, Edit2, X } from "lucide-react";
import { FilterSelect } from "@/components/common/Select";
import Button from "@/components/shared/ui/Button";
import { toast } from "react-hot-toast";
import { useConfirmationModal } from "@/components/shared/modals/ConfirmationModalContext";
import { getRoleLabel as getUserRoleLabel } from "@/services/userService";

export default function CommitteeBuilder({ committeeId, initialMembers = [], onUpdate }) {
    const [members, setMembers] = useState(initialMembers);
    const [users, setUsers] = useState([]); // Potential members
    const [loading, setLoading] = useState(false);

    // Form State
    const [newMember, setNewMember] = useState({ userId: "", role: "interviewer", isPrimary: false });
    const [editingMemberId, setEditingMemberId] = useState(null);

    const { showConfirmation } = useConfirmationModal();

    useEffect(() => {
        fetchUsers();
    }, []);

    // Also update local state if props change (e.g., after parent refetch)
    useEffect(() => {
        if (initialMembers) {
            setMembers(initialMembers);
        }
    }, [initialMembers]);

    const fetchUsers = async () => {
        try {
            // Fetch ALL users to allow adding anyone to the committee
            // Force no-store to ensure we get the latest 'isDefaultCommitteeMember' flags
            const res = await fetch(`/api/users?t=${Date.now()}`, { cache: "no-store" });
            const data = await res.json();

            if (res.ok) {
                const userList = Array.isArray(data) ? data : (data.users || []);
                setUsers(userList);

                // Auto-add Default Members if creating a NEW committee (no ID) and list is empty
                if (!committeeId && members.length === 0 && (!initialMembers || initialMembers.length === 0)) {
                    const defaults = userList.filter(u => u.isDefaultCommitteeMember === true);


                    if (defaults.length > 0) {
                        const prefilledMembers = defaults.map(u => {
                            // Smart Role Assignment
                            let committeeRole = "decision_maker";
                            if (u.role === "hr_manager" || u.role === "hr_specialist") committeeRole = "hr_reviewer";
                            if (u.department === "HR") committeeRole = "hr_reviewer";
                            if (u.role === "technical_lead" || u.role === "technical_reviewer") committeeRole = "technical_reviewer";

                            return {
                                userId: u, // Full user object for display
                                role: committeeRole,
                                isPrimary: true
                            };
                        });

                        setMembers(prefilledMembers);
                        toast.success(`تم إضافة ${defaults.length} أعضاء افتراضيين تلقائياً`);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const handleEdit = (member) => {
        setEditingMemberId(member.userId._id);
        setNewMember({
            userId: member.userId._id,
            role: member.role,
            isPrimary: member.isPrimary
        });
    };

    const cancelEdit = () => {
        setEditingMemberId(null);
        setNewMember({ userId: "", role: "interviewer", isPrimary: false });
    };

    const saveMember = async () => {
        if (!newMember.userId) return;
        setLoading(true);

        try {
            let res;
            if (editingMemberId) {
                // Update existing member
                res = await fetch(`/api/committees/${committeeId}/members/${editingMemberId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: newMember.role, isPrimary: newMember.isPrimary })
                });
            } else {
                // Add new member
                res = await fetch(`/api/committees/${committeeId}/members`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newMember)
                });
            }

            const data = await res.json();
            if (res.ok) {
                // Standardize response parsing: API likely returns { message, data: committee }
                const updatedCommittee = data.data || data;
                // Fallback if structure varies, but let's assume standard { data: { members: [] } }
                const updatedMembers = updatedCommittee.members || [];

                setMembers(updatedMembers);
                toast.success(editingMemberId ? "تم تحديث بيانات العضو" : "تم إضافة العضو بنجاح");

                cancelEdit(); // Reset form and mode
                if (onUpdate) onUpdate();
            } else {
                toast.error(data.message || data.error || "فشل العملية");
            }
        } catch (e) {
            console.error(e);
            toast.error("حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    const removeMember = (targetUserId) => {
        showConfirmation({
            title: "حذف عضو",
            message: "هل أنت متأكد من إزالة هذا العضو من اللجنة؟",
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/committees/${committeeId}/members/${targetUserId}`, {
                        method: "DELETE"
                    });

                    const data = await res.json();
                    if (res.ok) {
                        const updatedMembers = (data.data && data.data.members) ? data.data.members : [];
                        setMembers(updatedMembers);
                        toast.success("تم حذف العضو بنجاح");
                        if (onUpdate) onUpdate();
                    } else {
                        toast.error(data.message || "فشل حذف العضو");
                    }
                } catch (e) {
                    toast.error("حدث خطأ أثناء الحذف");
                }
            }
        });
    };

    const roleOptions = [
        { value: "interviewer", label: "محاور" },
        { value: "technical_reviewer", label: "مقيم فني" },
        { value: "hr_reviewer", label: "مقيم HR" },
        { value: "decision_maker", label: "صانع قرار" },
        { value: "head_department", label: "مدير قسم" },
        { value: "department_manager", label: "مدير إدارة" },
        { value: "manager", label: "مدير" },
        { value: "supervisor", label: "مشرف" }
    ];

    // Map users to options compatible with FilterSelect
    const userOptions = users.map(u => ({
        value: u._id,
        label: `${u.name} (${u.role})`,
        isDisabled: members.some(m => m.userId?._id === u._id) && (editingMemberId !== u._id)
        // Disable if already a member, UNLESS it's the one currently being edited
    }));

    return (
        <div className="space-y-4">
            {/* Editor / Add Form */}
            <div className={`bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row items-end gap-3 border border-dashed ${editingMemberId ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-300'}`}>
                <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">الموظف</label>
                    <FilterSelect
                        value={newMember.userId}
                        onChange={(val) => setNewMember({ ...newMember, userId: val })}
                        options={userOptions}
                        placeholder="بحث عن موظف..."
                        isSearchable={true}
                        isDisabled={!!editingMemberId} // Cannot change user when editing
                    />
                </div>

                <div className="w-full md:w-48">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">الدور في اللجنة</label>
                    <FilterSelect
                        value={newMember.role}
                        onChange={(val) => setNewMember({ ...newMember, role: val })}
                        options={roleOptions}
                        placeholder="الدور"
                        isSearchable={false}
                    />
                </div>

                <div className="flex flex-col justify-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                        <input
                            type="checkbox"
                            checked={newMember.isPrimary}
                            onChange={e => setNewMember({ ...newMember, isPrimary: e.target.checked })}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        عضو أساسي
                    </label>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        onClick={saveMember}
                        disabled={!newMember.userId || loading}
                        loading={loading}
                        className="flex-1 md:flex-none"
                    >
                        {editingMemberId ? <Edit2 className="w-4 h-4 ml-1" /> : <Plus className="w-5 h-5 ml-1" />}
                        {editingMemberId ? "تحديث" : "إضافة"}
                    </Button>

                    {editingMemberId && (
                        <Button
                            variant="secondary" // Assuming Button supports variant, or fallback to default
                            className="bg-white border text-gray-600 hover:bg-gray-100" // Explicit classes just in case
                            onClick={cancelEdit}
                            disabled={loading}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Members List */}
            <div className="space-y-2">
                {members.map((member, idx) => (
                    <div
                        key={idx}
                        className={`flex justify-between items-center bg-white border p-3 rounded-lg shadow-sm transition-all
                            ${editingMemberId === member.userId?._id ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : ''}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-full">
                                <UserIcon className="w-4 h-4 text-indigo-700" />
                            </div>
                            <div>
                                <div className="font-medium text-sm text-gray-900">
                                    {member.userId?.name || 'مستخدم غير معروف'}
                                    <span className="text-xs text-gray-400 mr-2 font-normal">
                                        ({getUserRoleLabel(member.userId?.role)})
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 flex gap-2">
                                    <span>{getRoleLabel(member.role)}</span>
                                    {member.isPrimary && (
                                        <span className="bg-indigo-50 text-indigo-700 px-1.5 rounded ring-1 ring-indigo-100">أساسي</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handleEdit(member)}
                                disabled={editingMemberId !== null && editingMemberId !== member.userId?._id}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition disabled:opacity-30"
                                title="تعديل العضو"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => removeMember(member.userId?._id)}
                                disabled={editingMemberId !== null}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition disabled:opacity-30"
                                title="حذف العضو"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {members.length === 0 && (
                    <div className="text-center text-sm text-gray-400 py-6 border-2 border-dashed rounded-lg bg-gray-50/30">
                        لا يوجد أعضاء في هذه اللجنة بعد. قم بإضافة أعضاء من النموذج أعلاه.
                    </div>
                )}
            </div>
        </div>
    );
}

function getRoleLabel(role) {
    const roles = {
        interviewer: "محاور",
        technical_reviewer: "مقيم فني",
        hr_reviewer: "مقيم HR",
        decision_maker: "صانع قرار",
        head_department: "مدير قسم",
        department_manager: "مدير إدارة",
        manager: "مدير",
        supervisor: "مشرف"
    };
    return roles[role] || role;
}
