import { isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const admin = await isAdmin();
  if (!admin) return redirect("/dashboard");

  return <h1 className="p-6 text-2xl">Admin Dashboard</h1>;
}

