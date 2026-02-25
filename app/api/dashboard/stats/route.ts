import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // TOTAL PROJECTS
        const totalProjects = await prisma.project.count({
            where: { createdById: user.id },
        });

        // TOTAL TASKS (via project → taskList → task)
        const totalTasks = await prisma.task.count({
            where: {
                list: {
                    project: {
                        createdById: user.id,
                    },
                },
            },
        });

        // PENDING TASKS
        const pendingTasks = await prisma.task.count({
            where: {
                status: "PENDING",
                list: {
                    project: {
                        createdById: user.id,
                    },
                },
            },
        });

        // COMPLETED TASKS
        const completedTasks = await prisma.task.count({
            where: {
                status: "COMPLETED",
                list: {
                    project: {
                        createdById: user.id,
                    },
                },
            },
        });

        return NextResponse.json({
            totalProjects,
            totalTasks,
            pendingTasks,
            completedTasks,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
