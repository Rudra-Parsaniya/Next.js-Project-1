import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        await createSession(user.id);

        const isAdmin = user.roles.some((r: any) => r.role.name === "ADMIN");

        return NextResponse.json({ success: true, isAdmin }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
