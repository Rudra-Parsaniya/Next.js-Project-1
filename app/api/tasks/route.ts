import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const listId = searchParams.get("listId");

        const userWithRoles = await prisma.user.findUnique({
            where: { id: user.id },
            include: { roles: { include: { role: true } } },
        });

        const isAdmin = userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

        let whereClause: any = isAdmin ? {} : {
            OR: [
                { assignedToId: user.id },
                {
                    list: {
                        project: {
                            createdById: user.id,
                        },
                    },
                },
                {
                    list: {
                        project: {
                            assignedToId: user.id,
                        },
                    },
                },
            ]
        };

        if (listId) {
            whereClause = {
                listId: Number(listId),
                ...whereClause
            };
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: {
                list: {
                    include: {
                        project: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: [
                { pinned: "desc" },
                { createdAt: "desc" },
            ],
        });

        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { title, description, listId, assignedToId, dueDate } = body;

        if (!title || !listId) {
            return NextResponse.json({ error: "Title and List ID required" }, { status: 400 });
        }

        const list = await prisma.taskList.findUnique({
            where: { id: Number(listId) },
            include: { project: true },
        });

        const userWithRoles = await prisma.user.findUnique({
            where: { id: user.id },
            include: { roles: { include: { role: true } } },
        });

        const isAdmin = userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

        if (!list || (!isAdmin && list.project.createdById !== user.id && list.project.assignedToId !== user.id)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                listId: Number(listId),
                assignedToId: assignedToId ? parseInt(assignedToId) : (isAdmin ? null : user.id),
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
