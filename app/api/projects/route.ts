import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userWithRoles = await prisma.user.findUnique({
            where: { id: user.id },
            include: { roles: { include: { role: true } } },
        });

        const isAdmin =
            userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

        const projects = await prisma.project.findMany({
            where: isAdmin ? {} : {
                OR: [
                    { createdById: user.id },
                    { assignedToId: user.id }
                ]
            },
            include: {
                createdBy: { select: { name: true } },
                assignedTo: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUserFromSession();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, assignedToId } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Project name is required" },
                { status: 400 }
            );
        }

        const project = await prisma.project.create({
            data: {
                name,
                description,
                createdById: user.id,
                assignedToId: assignedToId ? parseInt(assignedToId) : null,
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
