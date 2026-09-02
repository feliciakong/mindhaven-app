import React from 'react';
import { signInWithGoogle } from '../lib/firebase';
import { Sparkles, ArrowRight, BookOpen, ShieldCheck, HeartPulse } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 selection:bg-teal-100 bg-gradient-to-b from-sky-100 to-emerald-50">
      {/* Navigation Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Sparkles size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-teal-950">MindHaven</span>
        </div>

        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold tracking-wide transition-all shadow-sm"
        >
          <span>Sign In with Google</span>
          <ArrowRight size={14} />
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto text-center my-auto py-10 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/80 border border-teal-200/60 text-teal-900 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles size={14} className="text-teal-700" />
          <span>MindHaven • Your Trusted Reflection Companion</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-teal-950 leading-tight mb-4">
          A quiet space for your thoughts, guided by intuitive AI.
        </h1>

        <p className="text-sm md:text-base text-teal-900/70 max-w-2xl mx-auto leading-relaxed mb-8">
          MindHaven combines continuous Socratic reflection with private cloud storage, 
          transforming daily thoughts into meaningful self-discoveries and actionable clarity.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Workspace Preview Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/80 shadow-xl max-w-xl mx-auto text-left">
          <div className="flex items-center justify-between border-b border-teal-100 pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold text-teal-800/60 uppercase tracking-wider">MindHaven Workspace</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100/60">
              <p className="text-xs font-semibold text-teal-900">Today's Reflection</p>
              <p className="text-xs text-teal-700/80 mt-1">"Taking time to step back helped me organize my goals..."</p>
            </div>
            <div className="flex items-center gap-4 pt-1 text-xs text-teal-800/70 font-medium">
              <span className="flex items-center gap-1"><BookOpen size={14} className="text-teal-600" /> Daily Journal</span>
              <span className="flex items-center gap-1"><HeartPulse size={14} className="text-teal-600" /> Insights</span>
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-teal-600" /> Private Cloud</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-teal-900/50 py-4">
        © MindHaven. Minimalist AI Reflection Sanctuary.
      </footer>
    </div>
  );
}
