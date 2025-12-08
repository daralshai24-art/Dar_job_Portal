import User from "@/models/user";
import Application from "@/models/Application";
import HiringRequest from "@/models/HiringRequest";
import Category from "@/models/Category";
import { connectDB } from "@/lib/db";

class DepartmentManagerService {

    async getDashboardStats(managerId) {
        await connectDB();
        const manager = await User.findById(managerId);
        if (manager.role !== "department_manager" && manager.role !== "head_department") {
            // Allow head_department too loosely?
        }

        // 1. Get Categories for Dept
        const categories = await this.getCategoriesForDepartment(manager.department);
        const categoryIds = categories.map(c => c._id);

        // 2. Count Applications in those categories
        // Need jobs in those categories
        // Simplified logic:

        const stats = {
            applications: { total: 0, pending: 0, hired: 0 },
            hiringRequests: { pending: 0, approved: 0 },
            department: manager.department
        };

        return stats;
    }

    async getCategoriesForDepartment(department) {
        // Regex or exact match on name
        return Category.find({ name: { $regex: department, $options: "i" } });
    }
}

const departmentManagerService = new DepartmentManagerService();
export default departmentManagerService;
