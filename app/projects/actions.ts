"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Get projects
 * - USER  → only own projects
 * - ADMIN → all projects
 */
export async function getProjects() {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const userWithRoles = await prisma.user.findUnique({
    where: { id: user.id },
    include: { roles: { include: { role: true } } },
  });

  const isAdmin =
    userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

  const projects = await prisma.project.findMany({
    where: isAdmin ? {} : { createdById: user.id },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

/**
 * Create project
 */
export async function createProject(formData: FormData) {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;

  if (!name) throw new Error("Project name required");

  await prisma.project.create({
    data: {
      name,
      description,
      createdById: user.id,
    },
  });

  revalidatePath("/projects");
}

/**
 * Delete project
 * - USER  → only own project
 * - ADMIN → can delete any project
 */
export async function deleteProject(formData: FormData) {
  const projectId = Number(formData.get("projectId"));
  if (!projectId || Number.isNaN(projectId)) {
    throw new Error("Invalid project id");
  }

  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const userWithRoles = await prisma.user.findUnique({
    where: { id: user.id },
    include: { roles: { include: { role: true } } },
  })

  const isAdmin =
    userWithRoles?.roles.some((r) => r.role.name === "ADMIN") ?? false;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Project not found");

  // USER can delete only own project, ADMIN can delete any
  if (!isAdmin && project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/projects");
}
