"use client"

// ponytail: multi-role selector UI. Fallbacks to login if localStorage is empty.
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { redirectToDashboard, UserRole } from '@/lib/auth'

export default function RoleSelectPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<UserRole[]>([])

  useEffect(() => {
    const savedRolesStr = localStorage.getItem('lms_available_roles')
    if (!savedRolesStr) {
      router.push('/login')
      return
    }

    try {
      const parsedRoles = JSON.parse(savedRolesStr)
      if (Array.isArray(parsedRoles) && parsedRoles.length > 0) {
        setRoles(parsedRoles)
      } else {
        router.push('/login')
      }
    } catch {
      router.push('/login')
    }
  }, [router])

  const handleRoleSelection = (role: UserRole) => {
    // Save selected role in session if necessary, then redirect
    localStorage.setItem('lms_selected_role', role)
    router.push(redirectToDashboard(role))
  }

  const roleMetaMap: Record<UserRole, { title: string; desc: string; icon: string }> = {
    admin: {
      title: 'Administrator',
      desc: 'Manage users, roles, and settings',
      icon: '⚙️',
    },
    faculty: {
      title: 'Faculty Member',
      desc: 'Manage courses, batches, and teaching schedules',
      icon: '👩‍🏫',
    },
    student: {
      title: 'Student Portal',
      desc: 'Access classes, grades, and resources',
      icon: '🎓',
    },
    parent: {
      title: 'Parent Portal',
      desc: 'Track academic progress and pay fees',
      icon: '👨‍👩‍👧‍👦',
    },
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Select Your Role</h1>
        <p className="text-sm text-slate-400">
          Your account is associated with multiple roles. Select one to proceed.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {roles.map((role) => {
          const meta = roleMetaMap[role] || {
            title: role.toUpperCase(),
            desc: 'Access role-specific functions',
            icon: '👤',
          }
          return (
            <button
              key={role}
              onClick={() => handleRoleSelection(role)}
              className="w-full text-left p-4 bg-slate-900/50 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/30 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-4 group"
            >
              <span className="text-2xl select-none">{meta.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {meta.title}
                </div>
                <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  {meta.desc}
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-indigo-400 font-bold transition-all transform group-hover:translate-x-1">
                &rarr;
              </span>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('lms_available_roles')
          router.push('/login')
        }}
        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-center transition-all text-xs"
      >
        Sign Out / Switch Account
      </button>
    </div>
  )
}
