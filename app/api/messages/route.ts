import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const FREE_LIMIT = 20

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('messages_today, last_reset, plan')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const today = new Date().toISOString().split('T')[0]
  const lastReset = profile.last_reset

  // Reset counter if it's a new day
  if (lastReset !== today) {
    await supabase
      .from('profiles')
      .update({ messages_today: 0, last_reset: today })
      .eq('id', user.id)

    return NextResponse.json({ 
      messages_today: 0, 
      limit: FREE_LIMIT,
      plan: profile.plan,
      can_message: true 
    })
  }

  const canMessage = profile.plan !== 'free' || profile.messages_today < FREE_LIMIT

  return NextResponse.json({
    messages_today: profile.messages_today,
    limit: FREE_LIMIT,
    plan: profile.plan,
    can_message: canMessage
  })
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('messages_today, last_reset, plan')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const today = new Date().toISOString().split('T')[0]

  // Reset if new day
  if (profile.last_reset !== today) {
    await supabase
      .from('profiles')
      .update({ messages_today: 1, last_reset: today })
      .eq('id', user.id)
    return NextResponse.json({ success: true, messages_today: 1 })
  }

  // Block if free user hit limit
  if (profile.plan === 'free' && profile.messages_today >= FREE_LIMIT) {
    return NextResponse.json({ error: 'limit_reached' }, { status: 403 })
  }

  // Increment message count
  await supabase
    .from('profiles')
    .update({ messages_today: profile.messages_today + 1 })
    .eq('id', user.id)

  return NextResponse.json({ success: true, messages_today: profile.messages_today + 1 })
}