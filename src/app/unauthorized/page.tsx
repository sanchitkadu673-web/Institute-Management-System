"use client"

// ponytail: simple unauthorized 403 landing page. Kept clean and responsive.
import React from 'react'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8 sm:p-10 text-center max-w-[420px] text-white">
        <span className="text-5xl select-none block mb-4">🚫</span>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Access Denied</h1>
        <p className="text-slate-400 text-sm mb-6">
          You do not have permission to access this resource. Please make sure you are signed in with the correct account role.
        </p>
        <Link
          href="/login"
          className="inline-block w-full py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all text-sm"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  )
}
