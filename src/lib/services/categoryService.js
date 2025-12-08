// lib/services/categoryService.js
"use server";

import Category from "@/models/Category";
import { connectDB } from "@/lib/db";

export async function getCategories() {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .select("name nameEn _id")
      .sort({ name: 1 });

    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getCategoriesForClient() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('Failed to fetch categories');

    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error fetching categories for client:", error);
    return [];
  }
}