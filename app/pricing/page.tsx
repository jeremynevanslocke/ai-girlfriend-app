'use client'

import { useState } from 'react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: 'border-gray-200',
    button: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    badge: null,
    features: [
      '20 messages per day',
      '3 standard characters',
      'SFW chat only',
      '2 AI images per day',
      'Basic chat history',
    ],
    locked: [
      'Unlimited messages',
      'Explicit mode',
      'All characters',
      'Unlimited images',
      'Permanent memory',
    ],
    priceId: null,
    href: '/characters',
    cta: 'Get Started Free',
  },
  {
    name: 'Premium',
    price: '$14.99',
    period: 'per month',
    color: 'border-pink-400 ring-2 ring-pink-400',
    button: 'bg-pink-500 hover:bg-pink-600 text-white',
    badge: 'Most Popular',
    features: [
      'Unlimited messages',
      'All characters',
      'Explicit mode unlocked',
      '20 AI images per day',
      '7-day chat memory',
      '100 credits per month',
      'Fast response speed',
    ],
    locked: [],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    href: null,
    cta: 'Upgrade to Premium',
  },
  {
    name: 'Ultimate',
    price: '$29.99',
    period: 'per month',
    color: 'border-amber-400',
    button: 'bg-amber-500 hover:bg-amber-600 text-white',
    badge: 'Best Value',
    features: [
      'Everything in Premium',
      'Unlimited AI images',
      'Permanent memory',
      '500 credits per month',
      'Priority response speed',
      'Early access to new characters',
      'VIP support',
    ],
    locked: [],
    priceId: process.env.NEXT_PUBLIC_STRIPE_ULTIMATE_PRICE_ID,
    href: null,
    cta: 'Upgrade to Ultimate',
  },
]

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  async function handleUpgrade(planName: string, priceId: string) {
    setLoadingPlan(planName)

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId })
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Something went wrong. Please try again.')
      setLoadingPlan(null)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <Link href="/characters">
          <h1 className="text-2xl font-black">
            <span className="text-black">Dream</span>
            <span className="text-pink-500">companion</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/characters" className="text-gray-500 hover:text-gray-700 text-sm transition">Browse</Link>
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 text-sm transition">Account</Link>
        </div>
      </nav>

      {/* Header */}
      <section className="text-center px-6 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">Unlock unlimited conversations, explicit content, and AI-generated images. Cancel anytime.</p>
      </section>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-20 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-white rounded-2xl border-2 ${plan.color} p-8 flex flex-col relative`}>

            {/* Badge */}
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Plan Name & Price */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-400 text-sm mb-1">/{plan.period}</span>
              </div>
            </div>

            {/* Features */}
            <div className="flex-1 mb-6">
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
                {plan.locked.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-gray-300">✗</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            {plan.href ? (
              <Link
                href={plan.href}
                className={`block text-center py-3 rounded-xl font-semibold transition ${plan.button}`}
              >
                {plan.cta}
              </Link>
            ) : (
              <button
                onClick={() => plan.priceId && handleUpgrade(plan.name, plan.priceId)}
                disabled={loadingPlan === plan.name}
                className={`py-3 rounded-xl font-semibold transition disabled:opacity-50 ${plan.button}`}
              >
                {loadingPlan === plan.name ? 'Loading...' : plan.cta}
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Trust Badges */}
      <section className="text-center pb-16 px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
          <span>🔒 Secure payments via Stripe</span>
          <span>❌ Cancel anytime</span>
          <span>🔞 18+ only</span>
          <span>🛡️ Private and encrypted</span>
        </div>
      </section>

    </main>
  )
}