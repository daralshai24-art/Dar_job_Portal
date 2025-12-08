
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { connectDB } from "@/lib/db";
import EmailPreference from "@/models/EmailPreference";
import User from "@/models/user";

export async function GET(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        let preferences = await EmailPreference.findOne({ userId });

        // If no preferences execute, create defaults
        if (!preferences) {
            const user = await User.findById(userId);
            if (user) {
                preferences = await EmailPreference.createDefaultForUser(userId, user.role);
            }
        }

        return NextResponse.json(preferences);
    } catch (error) {
        console.error("Error fetching preferences:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();

        const preferences = await EmailPreference.findOneAndUpdate(
            { userId },
            { $set: body },
            { new: true, upsert: true }
        );

        return NextResponse.json(preferences);
    } catch (error) {
        console.error("Error updating preferences:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
