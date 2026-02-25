import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const projectId = Number(id);
        if (!projectId || Number.isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const userWithRoles = await prisma.user.findUnique({
            where: { id: user.id },
            include: { roles: { include: { role: true } } },
        });

        const isAdmin =
            userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

        if (!isAdmin && project.createdById !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const projectId = Number(id);
        if (!projectId || Number.isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, description } = body;

        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const userWithRoles = await prisma.user.findUnique({
            where: { id: user.id },
            include: { roles: { include: { role: true } } },
        });

        const isAdmin =
            userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

        if (!isAdmin && project.createdById !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { name, description },
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const projectId = Number(id);
        if (!projectId || Number.isNaN(projectId)) {
            return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
        }

        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const userWithRoles = await prisma.user.findUnique({
            where: { id: user.id },
            include: { roles: { include: { role: true } } },
        });

        const isAdmin =
            userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

        if (!isAdmin && project.createdById !== user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.project.delete({
            where: { id: projectId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
