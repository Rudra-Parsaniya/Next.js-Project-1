import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Layout,
  Shield,
  Zap,
  Users,
  Target,
  Sparkles,
  Clock
} from "lucide-react";
import Background from "./components/Background";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden selection:bg-blue-500/30">
      <Background />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ProFlow</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-medium bg-white text-zinc-950 rounded-full hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8 animate-fade-in">
            <Sparkles className="w-3 h-3" />
            <span>Smart Project Management</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent max-w-4xl">
            Streamline your workflow with precision and speed.
          </h1>

          <p className="text-lg lg:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            Organize projects, track tasks, and collaborate effortlessly. The all-in-one workspace designed for modern teams who value productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-xl shadow-blue-600/20"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Simple placeholders for "Trust" section */}
            <div className="flex items-center gap-2 font-bold text-xl"><Zap className="w-6 h-6 text-yellow-500" /> INSTANT</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Shield className="w-6 h-6 text-blue-500" /> SECURE</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Target className="w-6 h-6 text-red-500" /> FOCUS</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Users className="w-6 h-6 text-green-500" /> COLLAB</div>
          </div>
        </section>

        {/* Features / About Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<Layout className="w-8 h-8 text-blue-500" />}
              title="Intuitive Planning"
              description="Visualize your projects with our modern Kanban boards and list views. Stay organized without the clutter."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-500" />}
              title="Blazing Fast"
              description="Built for speed. Real-time updates and lightning-fast interactions keep you in the flow of work."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-emerald-500" />}
              title="Privacy First"
              description="Your data is encrypted and secure. We prioritize your privacy so you can focus on what matters most."
            />
          </div>
        </section>

        {/* Daily Schedule Section (Replaces CTA) */}
        <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  <Clock className="w-3 h-3" />
                  <span>Coming Soon: Daily Planning</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Master Your Daily <span className="text-amber-400">Routine</span>.
                </h2>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  Go beyond simple checklists. Map out your entire day with our upcoming Daily Schedule tracker. Align your projects with your available hours to maximize impact and minimize stress.
                </p>
                <ul className="space-y-4">
                  <ScheduleFeature icon={<Target className="w-5 h-5 text-amber-400" />} text="Hourly Time Blocking" />
                  <ScheduleFeature icon={<Zap className="w-5 h-5 text-amber-400" />} text="Priority-Based Sequencing" />
                  <ScheduleFeature icon={<Sparkles className="w-5 h-5 text-amber-400" />} text="Routine Templates" />
                </ul>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50" />
              <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                <div className="space-y-4">
                  <ScheduleItem time="09:00 AM" task="Deep Work: Project Architecture" color="bg-blue-500" />
                  <ScheduleItem time="11:30 AM" task="Team Sync & Review" color="bg-emerald-500" />
                  <ScheduleItem time="02:00 PM" task="Component Implementation" color="bg-indigo-500" />
                  <ScheduleItem time="04:30 PM" task="Daily Wrap-up" color="bg-zinc-700" opacity="opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-zinc-500 text-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <p>© 2026 ProFlow. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">about ProFlow</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-900/60 hover:border-blue-500/30 transition-all duration-300">
      <div className="mb-6 p-4 bg-zinc-800/50 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}

function ScheduleFeature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 text-zinc-300">
      <div className="p-1 rounded-md bg-amber-500/10">
        {icon}
      </div>
      <span className="font-medium">{text}</span>
    </li>
  );
}

function ScheduleItem({ time, task, color, opacity = "opacity-100" }: { time: string; task: string; color: string; opacity?: string }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 ${opacity}`}>
      <span className="text-xs font-mono text-zinc-500 w-20">{time}</span>
      <div className={`w-1 h-8 rounded-full ${color}`} />
      <span className="text-sm font-medium text-zinc-200">{task}</span>
    </div>
  );
}
