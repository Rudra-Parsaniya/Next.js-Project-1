"use client";

import React, { useEffect, useState } from "react";
import {
    Users,
    Trash2,
    ShieldCheck,
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Calendar,
    Globe
} from "lucide-react";
import Background from "../../components/Background";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "USER" });

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("API did not return an array of users. Full response data:", data);
                if (data.error === "Unauthorized") {
                    console.error("Session seems to be lost or unauthorized.");
                }
                setUsers([]);
            }
        } catch (error) {
            console.error("Failed to fetch users or parse response", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete user");
            }
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const promoAdmin = async (id: number) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id, roleName: "ADMIN" })
            });
            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to promote user");
            }
        } catch (error) {
            console.error("Failed to promote user", error);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                setShowCreateForm(false);
                setNewUser({ name: "", email: "", password: "", role: "USER" });
                // We don't need to wrap fetchUsers here because it already handles 401/error responses gracefully now
                await fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create user");
            }
        } catch (error) {
            console.error("Failed to create user", error);
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    ) : [];

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen p-6 lg:p-10 relative">
            <Background />
            <div className="max-w-[1400px] mx-auto space-y-8 relative z-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">User Management</h1>
                        <p className="text-zinc-400 mt-1">Manage platform access and member roles.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-all flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            {showCreateForm ? "Cancel" : "Add User"}
                        </button>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="bg-black/40 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full md:w-64 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {showCreateForm && (
                    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-blue-400" /> Create New Account
                        </h3>
                        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="John Doe"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="john@example.com"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Password</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/10"
                            >
                                Create User
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800/50 bg-white/5">
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Roles</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">{user.name}</p>
                                                <p className="text-xs text-zinc-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                <Mail className="w-3 h-3" /> {user.email}
                                            </div>
                                            {user.contactNo && (
                                                <div className="text-xs text-zinc-500">
                                                    {user.contactNo}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((r: any) => (
                                                <span key={r.id} className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${r.role.name === 'ADMIN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {r.role.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-zinc-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => promoAdmin(user.id)}
                                                className="p-2 hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-400 rounded-lg transition-all"
                                                title="Make Admin"
                                                disabled={user.roles.some((r: any) => r.role.name === "ADMIN")}
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-20 text-center">
                            <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500">No users found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
