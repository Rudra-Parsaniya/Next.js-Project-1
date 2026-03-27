import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getUserFromSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const taskId = formData.get("taskId") as string;

    if (!file || !taskId) {
      return NextResponse.json({ error: "File and Task ID are required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "submissions");
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${taskId}-${Date.now()}-${file.name}`;
    const path = join(uploadDir, fileName);
    await writeFile(path, buffer);

    const submissionUrl = `/submissions/${fileName}`;

    return NextResponse.json({ submissionUrl });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
