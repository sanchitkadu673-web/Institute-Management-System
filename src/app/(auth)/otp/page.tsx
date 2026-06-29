"use client"

// ponytail: state-collapsed OTP flow. Handles sending the SMS OTP and verifying in the same view.
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getRoleFromSession, redirectToDashboard } from '@/lib/auth'

export default function OtpPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')
    setLoading(true)

    try {
      // E.164 phone formatting constraint check
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }

      setOtpSent(true)
      setInfoMsg(`OTP code sent to ${formattedPhone}`)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: code,
        type: 'sms',
      })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
        return
      }

      if (data?.user) {
        const roles = data.user.app_metadata?.roles || data.user.user_metadata?.roles
        if (Array.isArray(roles) && roles.length > 1) {
          localStorage.setItem('lms_available_roles', JSON.stringify(roles))
          router.push('/role-select')
        } else {
          const role = getRoleFromSession(data.user)
          router.push(redirectToDashboard(role))
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error verifying code.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {otpSent ? 'Verify OTP' : 'OTP Sign In'}
        </h1>
        <p className="text-sm text-slate-400">
          {otpSent
            ? 'Enter the verification code sent to your device'
            : 'Enter your phone number to receive a temporary login code'}
        </p>
      </div>

      {infoMsg && (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-lg">
          {infoMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
          {errorMsg}
        </div>
      )}

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+919876543210"
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Sending code...' : 'Send Verification Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300" htmlFor="code">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOtpSent(false)}
              disabled={loading}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg focus:outline-none transition-all disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </div>
        </form>
      )}

      <div className="text-center text-sm text-slate-400">
        Prefer passwords?{' '}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          Sign in with Password
        </Link>
      </div>
    </div>
  )
}
