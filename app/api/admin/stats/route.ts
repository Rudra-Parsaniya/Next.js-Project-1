import { prisma } from "@/lib/prisma";
import { getUserFromSession, isUserAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUserFromSession();
        if (!user || !(await isUserAdmin(user))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userCount = await prisma.user.count();
        const projectCount = await prisma.project.count();
        const taskCount = await prisma.task.count();

        return NextResponse.json({
            userCount,
            projectCount,
            taskCount
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
