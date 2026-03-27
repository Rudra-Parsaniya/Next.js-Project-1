import { prisma } from "@/lib/prisma";
import { getUserFromSession, isUserAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUserFromSession();
        if (!user || !(await isUserAdmin(user))) {
            console.log("Unauthorized attempt to /api/admin/users", { hasUser: !!user, userId: user?.id });
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const user = await getUserFromSession();
        if (!user || !(await isUserAdmin(user))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: parseInt(userId) }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const user = await getUserFromSession();
        if (!user || !(await isUserAdmin(user))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { userId, roleName } = body;

        if (!userId || !roleName) {
            return NextResponse.json({ error: "User ID and role name are required" }, { status: 400 });
        }

        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName }
        });

        await prisma.userRole.upsert({
            where: {
                userId_roleId: {
                    userId: parseInt(userId),
                    roleId: role.id
                }
            },
            update: {},
            create: {
                userId: parseInt(userId),
                roleId: role.id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );


    }
}
