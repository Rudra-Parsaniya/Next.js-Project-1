import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = Number(id);
        if (!taskId) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { title, description, status, pinned } = body;

        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { list: { include: { project: true } } },
        });

        if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        const isAdmin = user.roles?.some((r: any) => r.role.name === "ADMIN") ?? false;
        const canManage =
            task.list?.project.createdById === user.id ||
            task.list?.project.assignedToId === user.id ||
            task.assignedToId === user.id;

        if (!isAdmin && !canManage) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (pinned !== undefined) updateData.pinned = pinned;
        if (body.submissionUrl !== undefined) updateData.submissionUrl = body.submissionUrl;

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: updateData,
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = Number(id);
        if (!taskId) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        const user = await getUserFromSession();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { list: { include: { project: true } } },
        });

        if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        const isAdmin = user.roles?.some((r: any) => r.role.name === "ADMIN") ?? false;
        const canManage =
            task.list?.project.createdById === user.id ||
            task.list?.project.assignedToId === user.id ||
            task.assignedToId === user.id;

        if (!isAdmin && !canManage) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
