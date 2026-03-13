'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function DashboardPage() {
  const [profile, setProfile] = useState<{
    email: string
    plan: string
    credits_balance: number
    messages_today: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('plan, credits_balance, messages_today')
        .eq('id', user.id)
        .single()
      if (data) {
        setProfile({
          email: user.email || '',
          plan: data.plan,
          credits_balance: data.credits_balance,
          messages_today: data.messages_today,
        })
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  function getPlanBadge(plan: string) {
    if (plan === 'ultimate') return { label: 'Ultimate', color: 'bg-amber-100 text-amber-700' }
    if (plan === 'premium') return { label: 'Premium', color: 'bg-purple-100 text-purple-700' }
    return { label: 'Free', color: 'bg-gray-100 text-gray-600' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    )
  }

  const badge = getPlanBadge(profile?.plan || 'free')

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <Link href="/characters">
          <h1 className="text-2xl font-black">
            <span className="text-black">Dream</span>
            <span className="text-pink-500">companion</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/characters" className="text-gray-500 hover:text-gray-700 text-sm transition">Browse</Link>
          <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 text-sm transition">Log out</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">My Account</h2>
          <p className="text-gray-500">{profile?.email}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Current Plan</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>{badge.label}</span>
          </div>
          {profile?.plan === 'free' ? (
            <div>
              <p className="text-gray-500 text-sm mb-4">You are on the free plan. Upgrade to unlock unlimited messages, explicit content, and more.</p>
              <Link href="/pricing" className="block text-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold transition">Upgrade to Premium</Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 text-sm mb-4">You have full access to all features including unlimited messages and explicit content.</p>
              <a href="https://billing.stripe.com/p/login/test_00000" target="_blank" rel="noopener noreferrer" className="block text-center border border-gray-200 hover:border-gray-300 text-gray-600 py-3 rounded-xl font-semibold transition text-sm">Manage Subscription</a>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-gray-500 text-sm mb-1">Messages Today</p>
            <p className="text-3xl font-bold text-gray-900">{profile?.messages_today}</p>
            {profile?.plan === 'free' && <p className="text-xs text-gray-400 mt-1">of 20 free</p>}
            {profile?.plan !== 'free' && <p className="text-xs text-green-500 mt-1">Unlimited</p>}
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-gray-500 text-sm mb-1">Credits Balance</p>
            <p className="text-3xl font-bold text-gray-900">{profile?.credits_balance}</p>
            <Link href="/pricing" className="text-xs text-pink-500 hover:text-pink-600 mt-1 block transition">Buy credits</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
          <div className="flex flex-col gap-3">
            <Link href="/characters" className="flex items-center justify-between text-gray-600 hover:text-gray-900 transition">
              <span className="text-sm">Browse Companions</span>
              <span className="text-gray-400">›</span>
            </Link>
            <div className="border-t border-gray-100" />
            <Link href="/pricing" className="flex items-center justify-between text-gray-600 hover:text-gray-900 transition">
              <span className="text-sm">View Pricing Plans</span>
              <span className="text-gray-400">›</span>
            </Link>
            <div className="border-t border-gray-100" />
            <Link href="/privacy" className="flex items-center justify-between text-gray-600 hover:text-gray-900 transition">
              <span className="text-sm">Privacy Policy</span>
              <span className="text-gray-400">›</span>
            </Link>
            <div className="border-t border-gray-100" />
            <Link href="/terms" className="flex items-center justify-between text-gray-600 hover:text-gray-900 transition">
              <span className="text-sm">Terms of Service</span>
              <span className="text-gray-400">›</span>
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 text-sm transition">Log out of my account</button>
        </div>
      </div>
    </main>
  )
}
