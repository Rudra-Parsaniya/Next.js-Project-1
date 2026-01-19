// "use client";
// import { loginUser } from "./actions";

// export default function LoginPage() {
//     async function handleSubmit(formData: FormData) {
//         await loginUser(formData);
//     }

//   return (
//     <form action={handleSubmit} className="space-y-2 p-6">
//       <input name="email" placeholder="Email" required className="border p-2"/>
//       <input name="password" type="password" placeholder="Password" required className="border p-2"/>
//       <button className="bg-green-600 text-white px-4 py-2">Login</button>
//     </form>
//   );
// }

"use client";
import { loginUser } from "./actions";

export default function LoginPage() {
  async function handleSubmit(formData: FormData) {
    await loginUser(formData);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-slate-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating blob 1 - Blue */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/40 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'floatRandom1 15s ease-in-out infinite'}}></div>
        
        {/* Floating blob 2 - Green */}
        <div className="absolute -top-32 -right-40 w-96 h-96 bg-blue-600/40 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'floatRandom2 18s ease-in-out infinite'}}></div>

        {/* Floating blob 3 - Blue */}
        <div className="absolute -bottom-48 left-0 w-96 h-96 bg-blue-400/40 rounded-full mix-blend-multiply filter blur-2xl" style={{animation: 'floatRandom3 16s ease-in-out infinite'}}></div>

        {/* Floating blob 4 - Blue accent */}
        <div className="absolute -bottom-32 -right-48 w-80 h-80 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl" style={{animation: 'floatRandom4 17s ease-in-out infinite'}}></div>
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

      <div className="w-full max-w-md bg-gray-100 backdrop-blur-xl p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-white/80 relative z-10">
        
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-center text-slate-600 mb-8 font-light">
          Login to your account
        </p>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className="w-full border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="mb-6">
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition">
            Register
          </a>
        </p>

      </div>
    </main>
  );
}
