// src/lib/constants.js

// Theme colors
export const COLORS = {
  primary: {
    dark: '#1D3D1E',
    medium: '#2A5A2C',
    light: '#B38025',
    accent: '#D6B666', 
    gold: '#F1DD8C'
  },
  text: {
    dark: '#1D3D1E',
    light: '#FFFFFF',
    gold: '#F1DD8C'
  }
};

// Default category (for "All" option)
export const DEFAULT_CATEGORY = {
  _id: "all",
  name: "الكل",
};

// Job status
export const JOB_STATUS = {
  DRAFT: { value: 'draft', label: 'مسودة', color: 'bg-yellow-100 text-yellow-800', badgeColor: 'bg-yellow-500' },
  ACTIVE: { value: 'active', label: 'نشط', color: 'bg-green-100 text-green-800', badgeColor: 'bg-green-500' },
  INACTIVE: { value: 'inactive', label: 'غير نشط', color: 'bg-red-100 text-red-800', badgeColor: 'bg-red-500' },
  CLOSED: { value: 'closed', label: 'مغلقة', color: 'bg-blue-100 text-blue-800', badgeColor: 'bg-blue-500' }
};

// Job actions
export const JOB_ACTIONS = {
  VIEW: 'view',
  EDIT: 'edit', 
  DELETE: 'delete',
  VIEW_APPLICATIONS: 'view_applications',
  TOGGLE_STATUS: 'toggle_status'
};

// Table columns
export const TABLE_COLUMNS = {
  JOBS: [
    { key: 'details', label: 'تفاصيل الوظيفة', sortable: false },
    { key: 'status', label: 'الحالة', sortable: true },
    { key: 'applications', label: 'الطلبات', sortable: true },
    { key: 'createdAt', label: 'تاريخ النشر', sortable: true },
    { key: 'actions', label: 'الإجراءات', sortable: false }
  ]
};

// Animation classes
export const ANIMATIONS = {
  button: {
    base: "relative transform transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95",
    primary: "bg-[#B38025] text-white border-[#B38025] hover:bg-[#D6B666] hover:text-[#1D3D1E]",
    secondary: "bg-transparent border-2 border-[#F1DD8C] text-[#F1DD8C] hover:bg-[#F1DD8C] hover:text-[#1D3D1E]",
    outline: "bg-white text-[#1D3D1E] border-gray-300 hover:border-[#B38025] hover:text-[#B38025]"
  }
};

// Application status config (Moved from component)
export const APPLICATION_STATUS_CONFIG = {
  pending: { 
    label: "قيد الانتظار", 
    className: "bg-yellow-100 text-yellow-800 border-yellow-200" 
  },
  reviewing: { 
    label: "قيد المراجعة", 
    className: "bg-blue-100 text-blue-800 border-blue-200" 
  },
  interview_scheduled: { 
    label: "مقابلة مجدولة", 
    className: "bg-purple-100 text-purple-800 border-purple-200" 
  },
  interview_completed: { 
    label: "اكتملت المقابلة", 
    className: "bg-indigo-100 text-indigo-800 border-indigo-200" 
  },
  accepted: { 
    label: "مقبول", 
    className: "bg-green-100 text-green-800 border-green-200" 
  },
  rejected: { 
    label: "مرفوض", 
    className: "bg-red-100 text-red-800 border-red-200" 
  },
  withdrawn: { 
    label: "منسحب", 
    className: "bg-gray-100 text-gray-800 border-gray-200" 
  },
};

// Client-side function to fetch categories from API
export const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('Categories API response not OK:', response.status);
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      return [DEFAULT_CATEGORY, ...result.data];
    } else {
      console.error('Categories API returned error:', result.error);
      throw new Error(result.error || 'Failed to fetch categories');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [DEFAULT_CATEGORY];
  }
};
