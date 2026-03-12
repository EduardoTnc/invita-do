import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize a Supabase admin client to bypass RLS when updating user profiles
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    if (!sig || !webhookSecret) {
      console.error('Missing stripe signature or webhook secret');
      return NextResponse.json({ error: 'Webhook secret/signature missing' }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook Error: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;
      const status = subscription.status;

      let tier = 'FREE';
      if (status === 'active') {
        tier = 'PREMIUM'; // Add logic here to determine PREMIUM vs ENTERPRISE based on price ID
      }

      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ subscription_tier: tier })
        .eq('stripe_customer_id', stripeCustomerId);

      if (error) {
        console.error('Error updating user subscription tier', error);
        return NextResponse.json({ error: 'DB Update Failed' }, { status: 500 });
      }
      break;
    }

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // We could capture the user_id from client_reference_id or metadata and link the stripe_customer_id
      if (session.customer && session.client_reference_id) {
        await supabaseAdmin
            .from('profiles')
            .update({ stripe_customer_id: session.customer as string })
            .eq('id', session.client_reference_id);
      }
      break;
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
