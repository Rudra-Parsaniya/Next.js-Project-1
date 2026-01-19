"use client";

import React, { useState } from "react";
import { registerUser } from "./actions";
import Link from "next/link";
import { User, Mail, Lock, Phone, Calendar, Globe, Users } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    if (res?.error) setError(res.error);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12 relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800 relative z-10 shadow-2xl">

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10 mx-auto mb-4">
            <span className="text-white font-bold text-lg">NP</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Create Account
          </h1>
          <p className="text-sm text-zinc-500">
            Fill in your details to get started
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
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
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Email */}
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
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Password */}
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
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Contact */}
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
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Birth Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="date"
                  name="birthDate"
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Nationality */}
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
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Gender
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <select
                name="gender"
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all appearance-none"
              >
                <option value="" className="bg-zinc-900">Select Gender</option>
                <option value="MALE" className="bg-zinc-900">Male</option>
                <option value="FEMALE" className="bg-zinc-900">Female</option>
                <option value="OTHER" className="bg-zinc-900">Other</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-white text-zinc-900 py-3 rounded-xl font-semibold hover:bg-zinc-100 transition-all shadow-lg shadow-white/5"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
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
