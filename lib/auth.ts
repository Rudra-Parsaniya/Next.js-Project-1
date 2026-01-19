"use server";

import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { randomUUID } from "crypto";

const SESSION_NAME = "session_token";

// Create a new session for a user
export async function createSession(userId: number) {
  const token = randomUUID();

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
    },
  });

  // ✅ CORRECT Next.js 15+ syntax
  const cookieStore = await cookies();
  cookieStore.set(SESSION_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return token;
}

// Get the current user from the session
export async function getUserFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  return session?.user ?? null;
}

// Logout the current user
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_NAME)?.value;
  if (token) {
    await prisma.session.delete({ where: { token } });
  }

  cookieStore.delete(SESSION_NAME);
}

// Check if the current user is an admin
export async function isAdmin() {
  const user = await getUserFromSession();
  if (!user) return false;

  const role = await prisma.userRole.findFirst({
    where: { userId: user.id },
    include: { role: true }
  });

  return role?.role?.name === "ADMIN";
}


// Protect routes
export async function requireUser() {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");
  return user;
}

