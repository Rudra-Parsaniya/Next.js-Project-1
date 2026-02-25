"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Phone, Calendar, Globe, Users, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import Background from "../../components/Background";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // ... existing logic ...
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Registration failed");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <Background />

      <div className="w-full max-w-lg bg-zinc-900/50 backdrop-blur-sm p-8 rounded-2xl border border-zinc-800/50 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            Create Account
          </h1>
          <p className="text-sm text-zinc-500">
            Fill in your details to get started
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-zinc-500 hover:bg-zinc-800/70 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Email <span className="text-red-400">*</span>
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
              Password <span className="text-red-400">*</span>
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

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                name="contactNo"
                placeholder="+91 98765 43210"
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-zinc-500 hover:bg-zinc-800/70 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Birth Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="date"
                  name="birthDate"
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-zinc-500 hover:bg-zinc-800/70 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Nationality
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  name="nationality"
                  placeholder="Indian"
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-zinc-500 hover:bg-zinc-800/70 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Gender
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <select
                name="gender"
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 hover:border-zinc-500 hover:bg-zinc-800/70 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-zinc-900">Select Gender</option>
                <option value="MALE" className="bg-zinc-900">Male</option>
                <option value="FEMALE" className="bg-zinc-900">Female</option>
                <option value="OTHER" className="bg-zinc-900">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-semibold hover:text-zinc-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
