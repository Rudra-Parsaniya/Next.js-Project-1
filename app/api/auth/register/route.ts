import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession, getUserFromSession, isUserAdmin } from "@/lib/auth";
import { SESSION_NAME } from "@/lib/session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    // 1. Check if the current user is an admin BEFORE reading the body or doing anything else
    const adminUser = await getUserFromSession();
    const isAdminSession = adminUser && (await isUserAdmin(adminUser));

    // Debug: Check if cookie is even present
    const cookieStore = await cookies();
    const hasCookie = cookieStore.has(SESSION_NAME);

    console.log("Registration API called", {
        hasCookie,
        hasAdminUser: !!adminUser,
        adminId: adminUser?.id,
        isAdminSession
    });

    try {
        const body = await request.json();
        const {
            name,
            email,
            password,
            contactNo,
            birthDate,
            nationality,
            gender,
        } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // CHECK IF FIRST USER
        const userCount = await prisma.user.count();
        const roleName = userCount === 0 ? "ADMIN" : "USER";

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                contactNo: contactNo || null,
                birthDate: birthDate ? new Date(birthDate) : null,
                nationality: nationality || null,
                gender: gender || null,
            },
        });

        // ASSIGN ROLE
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });

        await prisma.userRole.create({
            data: {
                userId: user.id,
                roleId: role.id,
            },
        });

        // Only create session (login) if NOT an admin adding a user
        if (!isAdminSession) {
            console.log("Creating session for new user (public registration)");
            await createSession(user.id);
        } else {
            console.log("Preserving admin session (admin adding user)", { adminId: adminUser.id });
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
