"use client";
import { loginUser } from "./actions";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  async function handleSubmit(formData: FormData) {
    await loginUser(formData);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800 relative z-10 shadow-2xl">

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10 mx-auto mb-4">
            <span className="text-white font-bold text-lg">NP</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-zinc-500 hover:bg-zinc-800/70 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-zinc-500 hover:bg-zinc-800/70 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-white font-semibold hover:text-zinc-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
