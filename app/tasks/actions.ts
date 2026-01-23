// "use server";

// import { prisma } from "@/lib/prisma";
// import { getUserFromSession } from "@/lib/auth";
// import { Priority, TaskStatus } from "@prisma/client";
// import { redirect } from "next/navigation";

// /* =====================================================
//    CREATE TASK (inside a TaskList)
// ===================================================== */
// export async function createTask(
//   listId: number,
//   formData: FormData
// ) {
//   const title = formData.get("title") as string;
//   const description = formData.get("description") as string | null;

//   if (!title) throw new Error("Task title is required");

//   const user = await getUserFromSession();
//   if (!user) throw new Error("Unauthorized");

//   const list = await prisma.taskList.findUnique({
//     where: { id: listId },
//     include: { project: true },
//   });

//   if (!list) throw new Error("Task list not found");

//   if (list.project.createdById !== user.id) {
//     throw new Error("Forbidden");
//   }

//   await prisma.task.create({
//     data: {
//       title,
//       description,
//       listId,
//     },
//   });

//   redirect(`/projects/${list.projectId}`);
// }

// /* =====================================================
//    GET TASKS OF A TASK LIST
// ===================================================== */
// export async function getTasks(listId: number) {
//   const user = await getUserFromSession();
//   if (!user) throw new Error("Unauthorized");

//   const list = await prisma.taskList.findUnique({
//     where: { id: listId },
//     include: { project: true },
//   });

//   if (!list) throw new Error("Task list not found");

//   if (list.project.createdById !== user.id) {
//     throw new Error("Forbidden");
//   }

//   return prisma.task.findMany({
//     where: { listId },
//     orderBy: { createdAt: "asc" },
//   });
// }

// /* =====================================================
//    GET SINGLE TASK
// ===================================================== */
// export async function getTaskById(taskId: number) {
//   const user = await getUserFromSession();
//   if (!user) throw new Error("Unauthorized");

//   const task = await prisma.task.findUnique({
//     where: { id: taskId },
//     include: {
//       list: {
//         include: {
//           project: true,
//         },
//       },
//     },
//   });

//   if (!task) throw new Error("Task not found");

//   if (task.list?.project.createdById !== user.id) {
//     throw new Error("Forbidden");
//   }

//   return task;
// }

// /* =====================================================
//    UPDATE TASK (title / description / dueDate)
// ===================================================== */
// export async function updateTask(
//   taskId: number,
//   formData: FormData
// ) {
//   const title = formData.get("title") as string;
//   const description = formData.get("description") as string | null;

//   if (!title) throw new Error("Task title required");

//   const user = await getUserFromSession();
//   if (!user) throw new Error("Unauthorized");

//   const task = await prisma.task.findUnique({
//     where: { id: taskId },
//     include: {
//       list: { include: { project: true } },
//     },
//   });

//   if (!task) throw new Error("Task not found");

//   if (task.list?.project.createdById !== user.id) {
//     throw new Error("Forbidden");
//   }

//   await prisma.task.update({
//     where: { id: taskId },
//     data: {
//       title,
//       description,
//     },
//   });

//   redirect(`/projects/${task.list.projectId}`);
// }

// /* =====================================================
//    DELETE TASK
// ===================================================== */
// export async function deleteTask(taskId: number) {
//   const user = await getUserFromSession();
//   if (!user) throw new Error("Unauthorized");

//   const task = await prisma.task.findUnique({
//     where: { id: taskId },
//     include: {
//       list: { include: { project: true } },
//     },
//   });

//   if (!task) throw new Error("Task not found");

//   if (task.list?.project.createdById !== user.id) {
//     throw new Error("Forbidden");
//   }

//   await prisma.task.delete({
//     where: { id: taskId },
//   });

//   redirect(`/projects/${task.list.projectId}`);
// }


"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";
import { TaskStatus } from "@prisma/client";
import { redirect } from "next/navigation";

export async function createTask(listId: number, formData: FormData) {
  const title = formData.get("title") as string;
  if (!title) throw new Error("Title required");

  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const list = await prisma.taskList.findUnique({
    where: { id: listId },
    include: { project: true },
  });

  if (!list || list.project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.task.create({
    data: {
      title,
      description: formData.get("description") as string | null,
      listId,
    },
  });

  redirect(`/projects/${list.projectId}/lists/${listId}/tasks`);
}

export async function getTasks(listId: number) {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const list = await prisma.taskList.findUnique({
    where: { id: listId },
    include: { project: true },
  });

  if (!list || list.project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  return prisma.task.findMany({
    where: { listId },
    orderBy: { createdAt: "asc" },
  });
}

/* ===============================
   DELETE TASK
================================ */
export async function deleteTask(taskId: number) {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      list: { include: { project: true } },
    },
  });

  if (!task) throw new Error("Task not found");

  if (task.list?.project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  redirect(
    `/projects/${task.list.projectId}/lists/${task.listId}/tasks`
  );
}


/* ===============================
   UPDATE TASK STATUS
================================ */
export async function updateTaskStatus(
  taskId: number,
  status: TaskStatus
) {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      list: { include: { project: true } },
    },
  });

  if (!task) throw new Error("Task not found");

  if (task.list?.project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });
}

/* ===============================
   UPDATE TASK (TITLE + DESCRIPTION)
================================ */
export async function updateTask(
  taskId: number,
  formData: FormData
) {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;

  if (!title || title.trim().length === 0) {
    throw new Error("Title is required");
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      list: { include: { project: true } },
    },
  });

  if (!task) throw new Error("Task not found");

  if (task.list?.project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
    },
  });

  redirect(
    `/projects/${task.list.projectId}/lists/${task.listId}/tasks`
  );
}

/* ===============================
   GET ALL TASKS (for /tasks page)
================================ */
export async function getAllTasks() {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  return prisma.task.findMany({
    where: {
      list: {
        project: {
          createdById: user.id,
        },
      },
    },
    include: {
      list: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [
      { pinned: "desc" },
      { createdAt: "desc" },
    ],
  });
}

/* ===============================
   TOGGLE TASK PIN
================================ */
export async function toggleTaskPin(taskId: number) {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      list: { include: { project: true } },
    },
  });

  if (!task) throw new Error("Task not found");

  if (task.list?.project.createdById !== user.id) {
    throw new Error("Forbidden");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { pinned: !task.pinned },
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

/* ===============================
   GET PINNED TASKS (for dashboard)
================================ */
export async function getPinnedTasks() {
  const user = await getUserFromSession();
  if (!user) throw new Error("Unauthorized");

  return prisma.task.findMany({
    where: {
      pinned: true,
      list: {
        project: {
          createdById: user.id,
        },
      },
    },
    include: {
      list: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });
}