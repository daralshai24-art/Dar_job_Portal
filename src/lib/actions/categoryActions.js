// lib/actions/categoryActions.js
"use server";

import Category from "@/models/Category";
import { connectDB } from "@/lib/db";

export async function getCategories() {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .select("name nameEn")
      .sort({ name: 1 });

    return { success: true, data: categories };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createCategory(categoryData) {
  try {
    await connectDB();

    const category = await Category.create(categoryData);
    return { success: true, data: category };
  } catch (error) {
    return { success: false, error: error.message };
  }
}