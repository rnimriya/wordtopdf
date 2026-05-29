import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '../../../../utils/stripe.js';
import { prisma } from '../../../../utils/db.js';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') || '';

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object;

  switch (event.type) {
    case 'checkout.session.completed': {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      const userId = session.metadata?.userId;

      if (userId) {
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          create: {
            userId,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          }
        });
      }
      break;
    }
    case 'invoice.payment_succeeded': {
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            status: subscription.status,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
      }
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = session;
      
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = session;
      
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: 'canceled',
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
    }
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
