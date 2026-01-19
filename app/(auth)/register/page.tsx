// "use client";

// import React, { useState } from "react";
// import { registerUser } from "./actions";

// export default function RegisterPage() {
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);

//     const res = await registerUser(formData);

//     if (res?.error) {
//       setError(res.error);
//     }
//   }

//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen px-6">
//       <div className="w-full max-w-sm p-6 border rounded">
//         <h1 className="text-2xl font-bold text-center mb-4">Register</h1>

//         {error && (
//           <p className="text-red-600 text-center font-medium mb-3">{error}</p>
//         )}

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             required
//             className="border p-2 rounded"
//           />

//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             required
//             className="border p-2 rounded"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//             className="border p-2 rounded"
//           />

//           <input
//             type="text"
//             name="contactNo"
//             placeholder="Contact Number"
//             className="border p-2 rounded"
//           />

//           <input
//             type="date"
//             name="birthDate"
//             className="border p-2 rounded"
//           />

//           <input
//             type="text"
//             name="nationality"
//             placeholder="Nationality"
//             className="border p-2 rounded"
//           />

//           <select
//             name="gender"
//             className="border p-2 rounded"
//           >
//             <option value="">Select Gender</option>
//             <option value="MALE">Male</option>
//             <option value="FEMALE">Female</option>
//             <option value="OTHER">Other</option>
//           </select>

//           <button
//             type="submit"
//             className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//           >
//             Create Account
//           </button>
//         </form>


//         <p className="text-center text-sm mt-4">
//           Already have an account?{" "}
//           <a href="/login" className="text-blue-600 underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </main>
//   );
// }
"use client";

import React, { useState } from "react";
import { registerUser } from "./actions";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    if (res?.error) setError(res.error);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-slate-100 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating blob 1 - Blue */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/40 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'floatRandom1 15s ease-in-out infinite'}}></div>
        
        {/* Floating blob 2 - Green */}
        <div className="absolute -top-32 -right-40 w-96 h-96 bg-blue-400/40 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'floatRandom2 18s ease-in-out infinite'}}></div>
        
        {/* Floating blob 3 - Yellow */}
        <div className="absolute -bottom-48 left-0 w-96 h-96 bg-blue-400/40 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'floatRandom3 16s ease-in-out infinite'}}></div>

        {/* Floating blob 4 - Blue accent */}
        <div className="absolute -bottom-32 -right-48 w-80 h-80 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl" style={{animation: 'floatRandom4 17s ease-in-out infinite'}}></div>
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

      <div className="w-full max-w-lg bg-gray-100 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-white/80 relative z-10">
        
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
          Create Account
        </h1>
        <p className="text-sm text-center text-slate-600 mb-6 font-light">
          Fill in your details to get started
        </p>

        {/* Error */}
        {error && (
          <p className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mb-4 text-center font-medium">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              required
              className="w-full border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="w-full border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNo"
                placeholder="+91 9876543210"
                className="w-full border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Birth Date
              </label>
              <input
                type="date"
                name="birthDate"
                className="w-full border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nationality
            </label>
            <input
              type="text"
              name="nationality"
              placeholder="Indian"
              className="w-full border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gender
            </label>
            <select
              name="gender"
              className="w-full border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
