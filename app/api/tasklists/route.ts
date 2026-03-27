import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            return NextResponse.json({ error: "Project ID required" }, { status: 400 });
        }

        const isAdmin = user.roles?.some((r: any) => r.role.name === "ADMIN") ?? false;

        const lists = await prisma.taskList.findMany({
            where: {
                projectId: Number(projectId),
                ...(isAdmin
                    ? {}
                    : {
                        project: {
                            OR: [
                                { createdById: user.id },
                                { assignedToId: user.id },
                            ],
                        },
                    }),
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(lists);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { name, projectId } = body;

        if (!name || !projectId) {
            return NextResponse.json({ error: "Name and Project ID required" }, { status: 400 });
        }

        const project = await prisma.project.findUnique({
            where: { id: Number(projectId) },
        });

        const isAdmin = user.roles?.some((r: any) => r.role.name === "ADMIN") ?? false;
        const canManage = project && (project.createdById === user.id || project.assignedToId === user.id);

        if (!project || (!isAdmin && !canManage)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const taskList = await prisma.taskList.create({
            data: {
                name,
                projectId: Number(projectId),
            },
        });

        return NextResponse.json(taskList, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { listId } = body;

        if (!listId) {
            return NextResponse.json({ error: "List ID required" }, { status: 400 });
        }

        const list = await prisma.taskList.findUnique({
            where: { id: Number(listId) },
            include: { project: true },
        });

        const isAdmin = user.roles?.some((r: any) => r.role.name === "ADMIN") ?? false;
        const canManage = list && (list.project.createdById === user.id || list.project.assignedToId === user.id);

        if (!list || (!isAdmin && !canManage)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.taskList.delete({
            where: { id: Number(listId) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
