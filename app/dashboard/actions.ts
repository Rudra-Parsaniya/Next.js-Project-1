"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export async function getDashboardStats() {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  // TOTAL PROJECTS
  const totalProjects = await prisma.project.count({
    where: { createdById: user.id },
  });

  // TOTAL TASKS (via project → taskList → task)
  const totalTasks = await prisma.task.count({
    where: {
      list: {
        project: {
          createdById: user.id,
        },
      },
    },
  });

  // PENDING TASKS
  const pendingTasks = await prisma.task.count({
    where: {
      status: "PENDING",
      list: {
        project: {
          createdById: user.id,
        },
      },
    },
  });

  // COMPLETED TASKS
  const completedTasks = await prisma.task.count({
    where: {
      status: "COMPLETED",
      list: {
        project: {
          createdById: user.id,
        },
      },
    },
  });

  return {
    totalProjects,
    totalTasks,
    pendingTasks,
    completedTasks,
  };
}
