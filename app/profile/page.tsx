"use client";

import { useEffect, useState } from "react";
import { User, Mail, Calendar, Shield, Loader2, ArrowLeft, CheckCircle2, AlertCircle, Key, Save, X } from "lucide-react";
import Link from "next/link";

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit Profile States
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Password Change States
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        try {
            const response = await fetch("/api/auth/me");
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const data = await response.json();
            setUser(data);
            setEditName(data.name);
            setEditEmail(data.email);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    async function handleProfileUpdate(e: React.FormEvent) {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateMessage(null);

        try {
            const response = await fetch("/api/auth/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName, email: editEmail }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            setUser(prev => prev ? { ...prev, name: editName, email: editEmail } : null);
            setUpdateMessage({ type: 'success', text: "Profile updated successfully!" });
            setTimeout(() => {
                setIsEditing(false);
                setUpdateMessage(null);
            }, 2000);
        } catch (err) {
            setUpdateMessage({ type: 'error', text: err instanceof Error ? err.message : "An error occurred" });
        } finally {
            setUpdateLoading(false);
        }
    }

    async function handlePasswordChange(e: React.FormEvent) {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: "Passwords do not match" });
            return;
        }

        setPasswordLoading(true);
        setPasswordMessage(null);

        try {
            const response = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to change password");
            }

            setPasswordMessage({ type: 'success', text: "Password changed successfully!" });
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setIsChangingPassword(false);
                setPasswordMessage(null);
            }, 2000);
        } catch (err) {
            setPasswordMessage({ type: 'error', text: err instanceof Error ? err.message : "An error occurred" });
        } finally {
            setPasswordLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-zinc-500 animate-pulse">Loading your profile...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <Shield className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                    <p className="text-zinc-500 max-w-md">{error || "We couldn't load your profile details."}</p>
                </div>
                <Link
                    href="/dashboard"
                    className="px-6 py-2.5 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-all font-medium flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Profile Settings</h1>
                <p className="text-zinc-500">Manage your personal information and account security.</p>
            </div>

            <div className="grid gap-8">
                {/* Profile Overview Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-opacity group-hover:opacity-100 opacity-50" />

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-zinc-800/50 group-hover:scale-105 transition-transform duration-500">
                            <span className="text-4xl font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 self-center">
                                    {user.role}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-400">
                                    <Mail className="w-4 h-4 text-zinc-500" />
                                    <span className="text-sm font-medium">{user.email}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-400">
                                    <Calendar className="w-4 h-4 text-zinc-500" />
                                    <span className="text-sm font-medium">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-5 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${isEditing ? 'bg-zinc-800 text-white' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                        }`}
                                >
                                    {isEditing ? <X className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Section */}
                {isEditing && (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            Update Information
                        </h3>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Full Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        required
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Email Address</label>
                                    <input
                                        type="email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        required
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {updateMessage && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${updateMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {updateMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {updateMessage.text}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                                >
                                    {updateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Change Password Section */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-500" />
                            Security & Password
                        </h3>
                        <button
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            {isChangingPassword ? "Cancel" : "Update password →"}
                        </button>
                    </div>

                    {!isChangingPassword ? (
                        <p className="text-sm text-zinc-500">Your account is protected with standard security protocols. We recommend using a strong, unique password.</p>
                    ) : (
                        <form onSubmit={handlePasswordChange} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Current Password</label>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {passwordMessage && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${passwordMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {passwordMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {passwordMessage.text}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                                >
                                    {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                                    Change Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
