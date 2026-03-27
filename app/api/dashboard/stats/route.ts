import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const isAdmin = user.roles?.some((r: any) => r.role.name === "ADMIN") ?? false;
        const baseTaskWhere = isAdmin
            ? {}
            : {
                OR: [
                    { assignedToId: user.id },
                    { list: { project: { createdById: user.id } } },
                    { list: { project: { assignedToId: user.id } } },
                ],
            };

        const baseProjectWhere = isAdmin
            ? {}
            : {
                OR: [
                    { createdById: user.id },
                    { assignedToId: user.id },
                ],
            };

        const [totalProjects, totalTasks, pendingTasks, completedTasks, recentTasks] = await Promise.all([
            prisma.project.count({ where: baseProjectWhere }),
            prisma.task.count({ where: baseTaskWhere }),
            prisma.task.count({
                where: { ...baseTaskWhere, status: "PENDING" },
            }),
            prisma.task.count({
                where: { ...baseTaskWhere, status: "COMPLETED" },
            }),
            prisma.task.findMany({
                where: baseTaskWhere,
                include: {
                    list: {
                        include: {
                            project: {
                                select: { id: true, name: true },
                            },
                        },
                    },
                },
                orderBy: { updatedAt: "desc" },
                take: 60,
            }),
        ]);

        const today = new Date();
        const startOfThisWeek = new Date(today);
        startOfThisWeek.setDate(today.getDate() - 6);
        startOfThisWeek.setHours(0, 0, 0, 0);

        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        const weeklyBuckets: Record<string, { total: number; completed: number }> = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfThisWeek);
            d.setDate(d.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            weeklyBuckets[key] = { total: 0, completed: 0 };
        }

        let thisWeekCompleted = 0;
        let lastWeekCompleted = 0;

        for (const task of recentTasks) {
            const updated = new Date(task.updatedAt);
            const updatedKey = updated.toISOString().slice(0, 10);

            if (weeklyBuckets[updatedKey]) {
                weeklyBuckets[updatedKey].total += 1;
                if (task.status === "COMPLETED") {
                    weeklyBuckets[updatedKey].completed += 1;
                }
            }

            if (task.status === "COMPLETED") {
                if (updated >= startOfThisWeek) thisWeekCompleted += 1;
                if (updated >= startOfLastWeek && updated < startOfThisWeek) lastWeekCompleted += 1;
            }
        }

        const weeklyProgress = Object.entries(weeklyBuckets).map(([date, value]) => ({
            date,
            completionRate: value.total > 0 ? Math.round((value.completed / value.total) * 100) : 0,
            completed: value.completed,
            total: value.total,
        }));

        const weeklyDelta =
            lastWeekCompleted > 0
                ? Math.round(((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100)
                : thisWeekCompleted > 0
                    ? 100
                    : 0;

        const recentActivities = recentTasks.slice(0, 6).map((task) => ({
            id: task.id,
            title:
                task.status === "COMPLETED"
                    ? "Task completed"
                    : task.updatedAt.getTime() - task.createdAt.getTime() < 1000 * 60 * 5
                        ? "New task created"
                        : "Task updated",
            description: task.title,
            projectName: task.list?.project?.name ?? "Project",
            updatedAt: task.updatedAt,
            status: task.status,
        }));

        return NextResponse.json({
            totalProjects,
            totalTasks,
            pendingTasks,
            completedTasks,
            weeklyProgress,
            weeklyDelta,
            recentActivities,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
