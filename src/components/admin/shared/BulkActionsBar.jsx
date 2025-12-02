import { Trash2, X } from "lucide-react";

export const BulkActionsBar = ({ selectedCount, onDelete, onClearSelection, loading }) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
            <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
                <span className="font-medium text-gray-900">
                    {selectedCount} عنصر محدد
                </span>
                <button
                    onClick={onClearSelection}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="إلغاء التحديد"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onDelete}
                    disabled={loading}
                    className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Trash2 size={16} />
                    )}
                    حذف المحدد
                </button>
            </div>
        </div>
    );
};
