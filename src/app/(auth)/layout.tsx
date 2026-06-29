// ponytail: glassmorphic shell for auth sub-screens. Standard layout to keep CSS and pages minimal.
import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden px-4">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <main className="w-full max-w-[420px] relative z-10 transition-all duration-300">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 sm:p-10 text-white animate-in fade-in zoom-in-95 duration-300">
          {children}
        </div>
      </main>
    </div>
  )
}
