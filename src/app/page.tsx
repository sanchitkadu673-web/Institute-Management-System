"use client"

// ponytail: check session on mount and redirect. Simple client-side routing fallback.
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getRoleFromSession, redirectToDashboard } from '@/lib/auth'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Check selected role first, then fall back to session role
          const selectedRole = localStorage.getItem('lms_selected_role')
          if (selectedRole) {
            router.push(redirectToDashboard(selectedRole))
          } else {
            const role = getRoleFromSession(user)
            router.push(redirectToDashboard(role))
          }
        } else {
          router.push('/login')
        }
      } catch {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-slate-400 text-sm tracking-wide font-medium">Checking authentication...</span>
      </div>
    </div>
  )
}
