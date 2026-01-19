"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/* =====================================================
   GET SINGLE PROJECT
===================================================== */
export async function getProjectById(projectId: number) {
  if (!projectId || Number.isNaN(projectId)) {
    throw new Error("Invalid project id");
  }

  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!project) throw new Error("Project not found");

  const userWithRoles = await prisma.user.findUnique({
    where: { id: user.id },
    include: { roles: { include: { role: true } } },
  });

  const isAdmin =
    userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

  if (!isAdmin && project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  return project;
}

/* =====================================================
   UPDATE PROJECT (SERVER ACTION)
===================================================== */
export async function updateProject(formData: FormData) {
  const projectId = Number(formData.get("projectId"));
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;

  if (!projectId || !name) {
    throw new Error("Invalid input");
  }

  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Project not found");

  const userWithRoles = await prisma.user.findUnique({
    where: { id: user.id },
    include: { roles: { include: { role: true } } },
  });

  const isAdmin =
    userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

  if (!isAdmin && project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      name,
      description,
    },
  });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

/* =====================================================
   DELETE PROJECT (SERVER ACTION)
===================================================== */
export async function deleteProject(formData: FormData) {
  const projectId = Number(formData.get("projectId"));
  if (!projectId || Number.isNaN(projectId)) {
    throw new Error("Invalid project id");
  }

  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Project not found");

  const userWithRoles = await prisma.user.findUnique({
    where: { id: user.id },
    include: { roles: { include: { role: true } } },
  });

  const isAdmin =
    userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

  if (!isAdmin && project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/projects");
  redirect("/projects");
}
