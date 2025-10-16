import { Edit, Trash2, Power, Key } from "lucide-react";
import Button from "@/components/shared/ui/Button";
import { Table, TableRow, TableCell } from "@/components/ui/Table";
import {
  getRoleLabel,
  getStatusLabel,
  getDepartmentLabel,
  getUserInitials,
  getUserAvatarColor,
} from "@/services/userService";

export function UsersTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  onResetPassword,
  actionLoading,
  loading,
}) {
  // Define table columns
  const columns = [
    { key: "user", label: "المستخدم" },
    { key: "role", label: "الدور" },
    { key: "department", label: "القسم" },
    { key: "status", label: "الحالة" },
    { key: "lastLogin", label: "آخر تسجيل دخول" },
    { key: "actions", label: "الإجراءات" },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <p className="text-center text-gray-500">لا توجد مستخدمين</p>
      </div>
    );
  }

  return (
    <Table columns={columns}>
      {users.map((user) => (
        <TableRow key={user._id}>
          {/* User Info */}
          <TableCell>
            <div className="flex items-center">
              <div
                className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: getUserAvatarColor(user.email) }}
              >
                {getUserInitials(user.name)}
              </div>
              <div className="mr-4">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
          </TableCell>

          {/* Role */}
          <TableCell>
            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              {getRoleLabel(user.role)}
            </span>
          </TableCell>

          {/* Department */}
          <TableCell className="text-sm text-gray-900">
            {getDepartmentLabel(user.department)}
          </TableCell>

          {/* Status */}
          <TableCell>
            <span
              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                user.status === "active"
                  ? "bg-green-100 text-green-800"
                  : user.status === "suspended"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {getStatusLabel(user.status)}
            </span>
          </TableCell>

          {/* Last Login */}
          <TableCell className="text-sm text-gray-500">
            {user.lastLogin
              ? new Date(user.lastLogin).toLocaleDateString("ar-SA")
              : "لم يسجل دخول"}
          </TableCell>

          {/* Actions */}
          <TableCell>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(user)}
                disabled={actionLoading === user._id}
              >
                <Edit size={16} className="ml-1" />
                تعديل
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleStatus(user)}
                disabled={actionLoading === user._id}
              >
                <Power size={16} className="ml-1" />
                {user.status === "active" ? "إيقاف" : "تفعيل"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResetPassword(user)}
                disabled={actionLoading === user._id}
              >
                <Key size={16} className="ml-1" />
                إعادة تعيين
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(user)}
                disabled={actionLoading === user._id || user.role === "super_admin"}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} className="ml-1" />
                حذف
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}