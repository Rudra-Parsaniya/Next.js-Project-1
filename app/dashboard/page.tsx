// import Link from "next/link";
// import { getUserFromSession } from "@/lib/auth";
// import { getDashboardStats } from "./actions";

// export default async function DashboardPage() {
//   const user = await getUserFromSession();
//   if (!user) return null;

//   const stats = await getDashboardStats();

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">
//         Welcome, {user.name} 👋
//       </h1>

//       {/* STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Projects"
//           value={stats.totalProjects}
//           href="/projects"
//         />
//         <StatCard
//           title="Total Tasks"
//           value={stats.totalTasks}
//           href="/tasks"
//         />
//         <StatCard
//           title="Pending Tasks"
//           value={stats.pendingTasks}
//           href="/tasks?status=PENDING"
//         />
//         <StatCard
//           title="Completed Tasks"
//           value={stats.completedTasks}
//           href="/tasks?status=COMPLETED"
//         />
//       </div>

//       {/* QUICK ACTIONS */}
//       <div className="space-y-2">
//         <h2 className="text-xl font-semibold">Quick Actions</h2>
//         <Link
//           href="/projects/new"
//           className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           + New Project
//         </Link>
//       </div>
//     </div>
//   );
// }

// function StatCard({
//   title,
//   value,
//   href,
// }: {
//   title: string;
//   value: number;
//   href: string;
// }) {
//   return (
//     <Link
//       href={href}
//       className="bg-white p-4 rounded shadow hover:bg-gray-50"
//     >
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="text-2xl font-bold">{value}</p>
//     </Link>
//   );
// }



// import Link from "next/link";
// import { getUserFromSession } from "@/lib/auth";
// import { getDashboardStats } from "./actions";
// import { FolderKanban, ListTodo, Clock, CheckCircle2, Plus, ArrowUpRight } from "lucide-react";

// export default async function DashboardPage() {
//   const user = await getUserFromSession();
//   if (!user) return null;

//   const stats = await getDashboardStats();
  
//   const completionRate = stats.totalTasks > 0 
//     ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
//     : 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-2">
//             Welcome, {user.name} 👋
//           </h1>
//           <p className="text-slate-600 text-lg">Here's an overview of your projects and tasks</p>
//         </div>

//         {/* STATS Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             title="Total Projects"
//             value={stats.totalProjects}
//             href="/projects"
//             icon={<FolderKanban className="w-6 h-6" />}
//             gradient="from-violet-500 to-purple-600"
//             bgGradient="from-violet-50 to-purple-50"
//           />
          
//           <StatCard
//             title="Total Tasks"
//             value={stats.totalTasks}
//             href="/tasks"
//             icon={<ListTodo className="w-6 h-6" />}
//             gradient="from-blue-500 to-cyan-600"
//             bgGradient="from-blue-50 to-cyan-50"
//           />
          
//           <StatCard
//             title="Pending Tasks"
//             value={stats.pendingTasks}
//             href="/tasks?status=PENDING"
//             icon={<Clock className="w-6 h-6" />}
//             gradient="from-amber-500 to-orange-600"
//             bgGradient="from-amber-50 to-orange-50"
//           />
          
//           <StatCard
//             title="Completed Tasks"
//             value={stats.completedTasks}
//             href="/tasks?status=COMPLETED"
//             icon={<CheckCircle2 className="w-6 h-6" />}
//             gradient="from-emerald-500 to-green-600"
//             bgGradient="from-emerald-50 to-green-50"
//           />
//         </div>

//         {/* Bottom Section: Progress & Quick Actions */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
//           {/* Completion Rate Card */}
//           <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 p-6 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-slate-800">Progress Overview</h3>
//               <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-md">
//                 <CheckCircle2 className="w-5 h-5 text-white" />
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <div className="flex items-end gap-2 mb-2">
//                   <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
//                     {completionRate}
//                   </span>
//                   <span className="text-2xl font-semibold text-slate-400 mb-1">%</span>
//                 </div>
//                 <p className="text-sm text-slate-500">Task completion rate</p>
//               </div>
              
//               <div className="relative">
//                 <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
//                   <div 
//                     className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
//                     style={{ width: `${completionRate}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-xs text-slate-500 mt-2">
//                   {stats.completedTasks} of {stats.totalTasks} tasks completed
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* QUICK ACTIONS Card */}
//           <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg shadow-slate-200/60 p-6 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
//             <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Link
//                 href="/projects/new"
//                 className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
//               >
//                 <div className="relative z-10 flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
//                       <Plus className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <p className="font-semibold">New Project</p>
//                       <p className="text-xs text-blue-100">Create a new project</p>
//                     </div>
//                   </div>
//                   <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </div>
//                 <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//               </Link>

//               <Link
//                 href="/tasks"
//                 className="group relative overflow-hidden bg-white border-2 border-slate-200 px-6 py-4 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-300 hover:scale-105"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
//                       <ListTodo className="w-5 h-5 text-slate-700" />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-slate-800">View All Tasks</p>
//                       <p className="text-xs text-slate-500">Manage your tasks</p>
//                     </div>
//                   </div>
//                   <ArrowUpRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </div>
//               </Link>

//               <Link
//                 href="/projects"
//                 className="group relative overflow-hidden bg-white border-2 border-slate-200 px-6 py-4 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-300 hover:scale-105"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
//                       <FolderKanban className="w-5 h-5 text-slate-700" />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-slate-800">All Projects</p>
//                       <p className="text-xs text-slate-500">Browse projects</p>
//                     </div>
//                   </div>
//                   <ArrowUpRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </div>
//               </Link>

//               <Link
//                 href="/tasks?status=PENDING"
//                 className="group relative overflow-hidden bg-white border-2 border-amber-200 px-6 py-4 rounded-xl hover:border-amber-300 hover:shadow-md transition-all duration-300 hover:scale-105"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg">
//                       <Clock className="w-5 h-5 text-amber-700" />
//                     </div>
//                     <div>
//                       <p className="font-semibold text-slate-800">Pending Tasks</p>
//                       <p className="text-xs text-slate-500">View pending items</p>
//                     </div>
//                   </div>
//                   <ArrowUpRight className="w-5 h-5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({
//   title,
//   value,
//   href,
//   icon,
//   gradient,
//   bgGradient,
// }: {
//   title: string;
//   value: number;
//   href: string;
//   icon: React.ReactNode;
//   gradient: string;
//   bgGradient: string;
// }) {
//   return (
//     <Link
//       href={href}
//       className={`group relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-2xl shadow-lg shadow-slate-200/60 p-6 border border-white/60 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300`}
//     >
//       <div className="relative z-10">
//         <div className="flex items-start justify-between mb-4">
//           <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
//             <div className="text-white">{icon}</div>
//           </div>
//           <ArrowUpRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         </div>
        
//         <div className="space-y-1">
//           <p className="text-sm font-medium text-slate-600">{title}</p>
//           <p className="text-4xl font-bold text-slate-900">{value}</p>
//         </div>
//       </div>
      
//       {/* Hover effect overlay */}
//       <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
//     </Link>
//   );
// }

// import Link from "next/link";
// import { getUserFromSession } from "@/lib/auth";
// import { getDashboardStats } from "./actions";

// export default async function DashboardPage() {
//   const user = await getUserFromSession();
//   if (!user) return null;

//   const stats = await getDashboardStats();

//   return (
//     <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* HEADER */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
//               Dashboard
//             </h1>
//             <p className="mt-1 text-zinc-600 dark:text-zinc-400">
//               Welcome, <span className="font-semibold">{user.name}</span> 👋
//             </p>
//           </div>
//         </div>

//         {/* STATS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             title="Total Projects"
//             value={stats.totalProjects}
//             href="/projects"
//           />
//           <StatCard
//             title="Total Tasks"
//             value={stats.totalTasks}
//             href="/tasks"
//           />
//           <StatCard
//             title="Completed Tasks"
//             value={stats.completedTasks}
//             href="/tasks?status=completed"
//           />
//           <StatCard
//             title="Pending Tasks"
//             value={stats.pendingTasks}
//             href="/tasks?status=pending"
//           />
//         </div>

//         {/* QUICK ACTIONS */}
//         <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
//           <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
//             Quick Actions
//           </h2>

//           <div className="flex flex-wrap gap-4">
//             <Link
//               href="/projects/new"
//               className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
//             >
//               + New Project
//             </Link>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// function StatCard({
//   title,
//   value,
//   href,
// }: {
//   title: string;
//   value: number;
//   href: string;
// }) {
//   return (
//     <Link
//       href={href}
//       className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-md transition"
//     >
//       <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
//         {title}
//       </p>
//       <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
//         {value}
//       </p>
//       <p className="mt-2 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition">
//         View details →
//       </p>
//     </Link>
//   );
// }


// import Link from "next/link";
// import { getUserFromSession } from "@/lib/auth";
// import { getDashboardStats } from "./actions";

// export default async function DashboardPage() {
//   const user = await getUserFromSession();
//   if (!user) return null;

//   const stats = await getDashboardStats();
  
//   const completionRate = stats.totalTasks > 0 
//     ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
//     : 0;

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
//         {/* Logo */}
//         <div className="h-16 flex items-center px-6 border-b border-gray-200">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">PM</span>
//             </div>
//             <span className="font-bold text-xl text-gray-800">ProjectHub</span>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 py-6 space-y-1">
//           <Link 
//             href="/dashboard" 
//             className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-sm"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//             </svg>
//             Dashboard
//           </Link>

//           <Link 
//             href="/projects" 
//             className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
//             </svg>
//             Projects
//           </Link>

//           <Link 
//             href="/tasks" 
//             className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//             </svg>
//             Tasks
//           </Link>

//           <Link 
//             href="/team" 
//             className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//             </svg>
//             Team
//           </Link>

//           <Link 
//             href="/analytics" 
//             className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//             </svg>
//             Analytics
//           </Link>

//           <Link 
//             href="/settings" 
//             className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//             Settings
//           </Link>
//         </nav>

//         {/* User Profile */}
//         <div className="p-4 border-t border-gray-200">
//           <div className="flex items-center gap-3 px-3 py-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//               <span className="text-white font-semibold text-sm">{user.name.charAt(0)}</span>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
//               <p className="text-xs text-gray-500 truncate">View Profile</p>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//             <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Search */}
//             <div className="relative">
//               <input 
//                 type="text" 
//                 placeholder="Search..." 
//                 className="w-64 px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>

//             {/* Notifications */}
//             <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//               </svg>
//               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>
//           </div>
//         </header>

//         {/* Main Content Area */}
//         <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <StatCard
//               title="Total Projects"
//               value={stats.totalProjects}
//               href="/projects"
//               iconPath="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
//               colorClass="from-purple-500 to-purple-600"
//               bgClass="bg-purple-50"
//             />
            
//             <StatCard
//               title="Total Tasks"
//               value={stats.totalTasks}
//               href="/tasks"
//               iconPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//               colorClass="from-blue-500 to-blue-600"
//               bgClass="bg-blue-50"
//             />
            
//             <StatCard
//               title="Pending Tasks"
//               value={stats.pendingTasks}
//               href="/tasks?status=PENDING"
//               iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//               colorClass="from-amber-500 to-amber-600"
//               bgClass="bg-amber-50"
//             />
            
//             <StatCard
//               title="Completed Tasks"
//               value={stats.completedTasks}
//               href="/tasks?status=COMPLETED"
//               iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//               colorClass="from-green-500 to-green-600"
//               bgClass="bg-green-50"
//             />
//           </div>

//           {/* Progress & Quick Actions */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//             {/* Progress Card */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
//                 <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="flex items-baseline gap-2">
//                   <span className="text-5xl font-bold text-gray-900">{completionRate}</span>
//                   <span className="text-2xl font-semibold text-gray-400">%</span>
//                 </div>
                
//                 <div className="relative pt-1">
//                   <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                     <div 
//                       className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000"
//                       style={{ width: `${completionRate}%` }}
//                     ></div>
//                   </div>
//                 </div>
                
//                 <p className="text-sm text-gray-600">
//                   {stats.completedTasks} of {stats.totalTasks} tasks completed
//                 </p>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <Link
//                   href="/projects/new"
//                   className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
//                 >
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-semibold">New Project</p>
//                     <p className="text-xs text-blue-100">Create project</p>
//                   </div>
//                 </Link>

//                 <Link
//                   href="/tasks"
//                   className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
//                 >
//                   <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-900">All Tasks</p>
//                     <p className="text-xs text-gray-500">View tasks</p>
//                   </div>
//                 </Link>

//                 <Link
//                   href="/projects"
//                   className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
//                 >
//                   <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-900">Projects</p>
//                     <p className="text-xs text-gray-500">Browse all</p>
//                   </div>
//                 </Link>

//                 <Link
//                   href="/analytics"
//                   className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
//                 >
//                   <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-gray-900">Analytics</p>
//                     <p className="text-xs text-gray-500">View reports</p>
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
//             <div className="space-y-4">
//               <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900">New task created in Marketing Project</p>
//                   <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
//                 <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900">Task completed: Update documentation</p>
//                   <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900">New project created: Website Redesign</p>
//                   <p className="text-xs text-gray-500 mt-1">1 day ago</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// function StatCard({
//   title,
//   value,
//   href,
//   iconPath,
//   colorClass,
//   bgClass,
// }: {
//   title: string;
//   value: number;
//   href: string;
//   iconPath: string;
//   colorClass: string;
//   bgClass: string;
// }) {
//   return (
//     <Link
//       href={href}
//       className={`${bgClass} rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group`}
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
//           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
//           </svg>
//         </div>
//         <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//         </svg>
//       </div>
      
//       <div>
//         <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
//         <p className="text-3xl font-bold text-gray-900">{value}</p>
//       </div>
//     </Link>
//   );
// }


import Link from "next/link";
import { getUserFromSession } from "@/lib/auth";
import { getDashboardStats } from "./actions";
import { ArrowUpRight, FolderKanban, ListTodo, Clock, CheckCircle2, Plus } from "lucide-react";

export default async function DashboardPage() {
  const user = await getUserFromSession();
  if (!user) return null;

  const stats = await getDashboardStats();
  
  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating blob 1 - Blue */}
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-blue-300/40 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'floatRandom1 15s ease-in-out infinite'}}></div>
        
        {/* Floating blob 2 - Green */}
        <div className="absolute -top-32 -right-40 w-96 h-96 bg-green-200/40 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'floatRandom2 18s ease-in-out infinite'}}></div>
        
        {/* Floating blob 3 - Yellow */}
        <div className="absolute -bottom-48 left-0 w-96 h-96 bg-green-300/30 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'floatRandom3 16s ease-in-out infinite'}}></div>

        {/* Floating blob 4 - Blue accent */}
        <div className="absolute -bottom-32 -right-48 w-80 h-80 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl" style={{animation: 'floatRandom4 17s ease-in-out infinite'}}></div>
      </div>

      <style>{`
        @keyframes floatRandom1 {
          0% { transform: translateY(200px) translateX(300px); opacity: 0.6; }
          15% { transform: translateY(-250px) translateX(180px); opacity: 0.7; }
          30% { transform: translateY(280px) translateX(-280px); opacity: 0.8; }
          45% { transform: translateY(-180px) translateX(-320px); opacity: 0.7; }
          60% { transform: translateY(320px) translateX(240px); opacity: 0.6; }
          75% { transform: translateY(-220px) translateX(100px); opacity: 0.7; }
          90% { transform: translateY(200px) translateX(-250px); opacity: 0.8; }
          100% { transform: translateY(200px) translateX(300px); opacity: 0.6; }
        }
        
        @keyframes floatRandom2 {
          0% { transform: translateY(300px) translateX(-280px); opacity: 0.6; }
          20% { transform: translateY(-220px) translateX(320px); opacity: 0.7; }
          40% { transform: translateY(240px) translateX(200px); opacity: 0.8; }
          60% { transform: translateY(-280px) translateX(-240px); opacity: 0.7; }
          80% { transform: translateY(280px) translateX(-180px); opacity: 0.6; }
          100% { transform: translateY(300px) translateX(-280px); opacity: 0.6; }
        }
        
        @keyframes floatRandom3 {
          0% { transform: translateY(-300px) translateX(250px); opacity: 0.6; }
          25% { transform: translateY(200px) translateX(-300px); opacity: 0.8; }
          50% { transform: translateY(-240px) translateX(280px); opacity: 0.7; }
          75% { transform: translateY(320px) translateX(-200px); opacity: 0.8; }
          100% { transform: translateY(-300px) translateX(250px); opacity: 0.6; }
        }
        
        @keyframes floatRandom4 {
          0% { transform: translateY(240px) translateX(280px); opacity: 0.6; }
          18% { transform: translateY(-280px) translateX(-260px); opacity: 0.7; }
          36% { transform: translateY(300px) translateX(320px); opacity: 0.8; }
          54% { transform: translateY(-200px) translateX(-180px); opacity: 0.7; }
          72% { transform: translateY(260px) translateX(240px); opacity: 0.6; }
          90% { transform: translateY(-300px) translateX(-240px); opacity: 0.7; }
          100% { transform: translateY(240px) translateX(280px); opacity: 0.6; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700">
              Welcome back, {user.name}! 
            </h1>
            <p className="text-lg text-slate-600 font-light">
              Here's a snapshot of your productivity today
            </p>
          </div>
        </div>

        {/* Stats Grid - 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            href="/projects"
            icon={<FolderKanban className="w-6 h-6" />}
            gradient="from-blue-500 to-blue-600"
            bgGradient="from-blue-50 to-blue-100/50"
            textColor="text-blue-700"
          />
          
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            href="/tasks"
            icon={<ListTodo className="w-6 h-6" />}
            gradient="from-blue-500 to-blue-600"
            bgGradient="from-blue-50 to-blue-100/50"
            textColor="text-blue-700"
          />
          
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            href="/tasks?status=PENDING"
            icon={<Clock className="w-6 h-6" />}
            gradient="from-yellow-500 to-yellow-600"
            bgGradient="from-yellow-50 to-yellow-100/50"
            textColor="text-yellow-700"
          />
          
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            href="/tasks?status=COMPLETED"
            icon={<CheckCircle2 className="w-6 h-6" />}
            gradient="from-green-500 to-green-600"
            bgGradient="from-green-50 to-green-100/50"
            textColor="text-green-700"
          />
        </div>

        {/* Main Grid - Progress & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Completion Progress Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/40 p-8 border border-white/80 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Task Progress</h3>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-600">
                    {completionRate}
                  </span>
                  <span className="text-3xl font-light text-slate-400 mb-2">%</span>
                </div>
                <p className="text-sm text-slate-600">completion rate</p>
              </div>
              
              <div className="relative">
                <div className="w-full bg-slate-200/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-3 font-medium">
                  {stats.completedTasks} of {stats.totalTasks} tasks completed
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/40 p-8 border border-white/80 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Project */}
              <Link
                href="/projects/new"
                className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold leading-tight">New Project</p>
                      <p className="text-xs text-blue-100 font-light">Start fresh</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>

              {/* View All Tasks */}
              <Link
                href="/tasks"
                className="group relative overflow-hidden bg-white border-2 border-slate-200 px-6 py-5 rounded-xl hover:border-slate-300 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                      <ListTodo className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 leading-tight">View Tasks</p>
                      <p className="text-xs text-slate-500 font-light">Manage all</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>

              {/* All Projects */}
              <Link
                href="/projects"
                className="group relative overflow-hidden bg-white border-2 border-slate-200 px-6 py-5 rounded-xl hover:border-slate-300 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                      <FolderKanban className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 leading-tight">Projects</p>
                      <p className="text-xs text-slate-500 font-light">Browse all</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>

              {/* Pending Tasks */}
              <Link
                href="/tasks?status=PENDING"
                className="group relative overflow-hidden bg-white border-2 border-yellow-200/60 px-6 py-5 rounded-xl hover:border-yellow-300 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 leading-tight">Pending</p>
                      <p className="text-xs text-slate-500 font-light">In progress</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/40 p-8 border border-white/80">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-slate-200/60 last:border-b-0">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">New task created in Marketing Project</p>
                <p className="text-xs text-slate-500 mt-1.5 font-light">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-slate-200/60 last:border-b-0">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">Task completed: Update documentation</p>
                <p className="text-xs text-slate-500 mt-1.5 font-light">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0 shadow-md"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">New project created: Website Redesign</p>
                <p className="text-xs text-slate-500 mt-1.5 font-light">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
  icon,
  gradient,
  bgGradient,
  textColor,
}: {
  title: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  gradient: string;
  bgGradient: string;
  textColor: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-2xl shadow-lg shadow-slate-200/40 p-6 border border-white/60 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">{icon}</div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="space-y-2">
          <p className={`text-sm font-medium ${textColor}`}>{title}</p>
          <p className="text-4xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
    </Link>
  );
}