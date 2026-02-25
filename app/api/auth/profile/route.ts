import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
        }

        // Check if email is already taken by another user
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                id: { not: user.id },
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { name, email },
        });

        return NextResponse.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
