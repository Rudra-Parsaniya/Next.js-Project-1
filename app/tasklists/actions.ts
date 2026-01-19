"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/* =====================================================
   GET TASK LISTS BY PROJECT
===================================================== */
export async function getTaskLists(projectId: number) {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const lists = await prisma.taskList.findMany({
    where: {
      projectId,
      project: {
        createdById: user.id, // user can only see own project lists
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return lists;
}

/* =====================================================
   CREATE TASK LIST
===================================================== */
export async function createTaskList(formData: FormData) {
  const name = formData.get("name") as string;
  const projectId = Number(formData.get("projectId"));

  if (!name || !projectId) throw new Error("Invalid input");

  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.taskList.create({
    data: {
      name,
      projectId,
    },
  });

  revalidatePath(`/projects/${projectId}`);
}

/* =====================================================
   DELETE TASK LIST
===================================================== */
export async function deleteTaskList(formData: FormData) {
  const listId = Number(formData.get("listId"));
  const projectId = Number(formData.get("projectId"));

  if (!listId || !projectId) throw new Error("Invalid input");

  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const list = await prisma.taskList.findUnique({
    where: { id: listId },
    include: { project: true },
  });

  if (!list || list.project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.taskList.delete({
    where: { id: listId },
  });

  revalidatePath(`/projects/${projectId}`);
}
