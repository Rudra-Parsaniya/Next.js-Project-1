"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const contactNo = formData.get("contactNo") as string | null;
  const birthDateRaw = formData.get("birthDate") as string | null;
  const nationality = formData.get("nationality") as string | null;
  const gender = formData.get("gender") as any;


  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) return { error: "User already exists" };

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
      birthDate: birthDateRaw ? new Date(birthDateRaw) : null,
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


  await createSession(user.id);

  redirect("/dashboard");
}
