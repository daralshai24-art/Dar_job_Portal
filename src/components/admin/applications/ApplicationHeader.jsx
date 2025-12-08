"use client";

import { useState } from "react";
import { X, Edit, Clock, MoreVertical } from "lucide-react";
import Button from "@/components/shared/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const ApplicationHeader = ({
  onBack,
  onEdit,
  editing,
  onCancel,
  showTimeline,
  toggleTimeline,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">

      {/* Left Section */}
      <div>
        <button
          onClick={onBack}
          className="text-[#B38025] hover:text-[#D6B666] flex items-center mb-2"
        >
          <X size={20} className="ml-1" />
          العودة للطلبات
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          تفاصيل طلب التوظيف
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          إدارة وتقييم طلب التوظيف
        </p>
      </div>

      {/* Right Section - Dropdown Actions */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <MoreVertical size={18} />
              خيارات
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            {/* Timeline toggle */}
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={toggleTimeline}
            >
              <Clock size={16} />
              {showTimeline ? "إخفاء سجل التقدم" : "عرض سجل التقدم"}
            </DropdownMenuItem>

            {/* Edit / Cancel */}
            {!editing ? (
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={onEdit}
              >
                <Edit size={16} />
                تعديل
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600"
                onClick={onCancel}
              >
                <X size={16} />
                إلغاء التعديل
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
