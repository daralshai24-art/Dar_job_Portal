// components/admin/dashboard/StatusBadge.jsx
export default function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    interview_scheduled: 'bg-purple-100 text-purple-800',
    interview_completed: 'bg-indigo-100 text-indigo-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-green-100 text-green-800',
  };
  const texts = {
    pending: 'قيد المراجعة',
    reviewed: 'تمت المراجعة',
    interview_scheduled: 'مقابلة مجدولة',
    interview_completed: 'تمت المقابلة',
    rejected: 'مرفوض',
    hired: 'مقبول',
  };

  const bgColor = colors[status] || 'bg-gray-100 text-gray-800';
  const text = texts[status] || status || 'غير محدد';

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${bgColor}`}>
      {text}
    </span>
  );
}
