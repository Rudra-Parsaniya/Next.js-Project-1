import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { oldPassword, newPassword } = await req.json();

        if (!oldPassword || !newPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Fetch full user data including passwordHash
        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
        });

        if (!fullUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify old password
        const isPasswordCorrect = await bcrypt.compare(oldPassword, fullUser.passwordHash);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Incorrect old password" }, { status: 400 });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Password change error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
