"use client"

// ponytail: basic forgot password recovery request. No complex route dependencies.
import React, { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`, // ponytail: fallback redirect to login screen
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }

      setSuccessMsg('Instructions to reset your password have been sent to your email.')
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while resetting password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Reset Password</h1>
        <p className="text-sm text-slate-400">
          Enter your registered email address to receive password reset instructions
        </p>
      </div>

      {successMsg ? (
        <div className="flex flex-col gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">
            {successMsg}
          </div>
          <Link
            href="/login"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg text-center transition-all"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@institute.com"
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-2">
            <Link
              href="/login"
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-center focus:outline-none transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
