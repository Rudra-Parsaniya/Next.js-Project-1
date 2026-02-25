import { prisma } from "@/lib/prisma";
import { getUserFromSession, isUserAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getUserFromSession();
        if (!user || !(await isUserAdmin(user))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const latestTasks = await prisma.task.findMany({
            where: {
                assignedToId: { not: null }
            },
            take: 3,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                assignedTo: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                list: {
                    include: {
                        project: true
                    }
                }
            }
        });

        return NextResponse.json(latestTasks);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
