import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceRoleClient } from '@/app/lib/supabase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const subscriptionId = session.subscription as string

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0].price.id

    let plan = 'premium'
    if (priceId === process.env.STRIPE_ULTIMATE_PRICE_ID) {
      plan = 'ultimate'
    }

    await supabase
      .from('profiles')
      .update({
        plan,
        stripe_customer_id: session.customer as string,
        subscription_id: subscriptionId,
      })
      .eq('id', userId)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    await supabase
      .from('profiles')
      .update({ plan: 'free', subscription_id: null })
      .eq('stripe_customer_id', subscription.customer as string)
  }

  return NextResponse.json({ received: true })
}
