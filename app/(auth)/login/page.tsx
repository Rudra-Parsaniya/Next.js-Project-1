"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Background from "../../components/Background";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // ... existing logic ...
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Login failed");
      } else {
        const redirectPath = result.isAdmin ? "/admin" : "/dashboard";
        router.push(redirectPath);
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <Background />

      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 relative z-10 shadow-2xl">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500">
            Enter your credentials to access your workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              suppressHydrationWarning
              className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-zinc-500 hover:bg-zinc-800/70 transition-all placeholder:text-zinc-600"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              suppressHydrationWarning
              className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-zinc-500 hover:bg-zinc-800/70 transition-all placeholder:text-zinc-600"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
              {error}
            </div>
          )}

            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full bg-blue-600 text-white font-semibold rounded-xl px-4 py-3.5 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-white hover:underline font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
