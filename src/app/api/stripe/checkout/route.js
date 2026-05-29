import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../utils/authOptions.js';
import { stripe } from '../../../../utils/stripe.js';
import { prisma } from '../../../../utils/db.js';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { priceId } = await req.json();
    if (priceId !== undefined && priceId !== null && typeof priceId !== 'string') {
      return NextResponse.json({ error: 'Price ID must be a string' }, { status: 400 });
    }
    const userId = session.user.id;
    const userEmail = session.user.email;

    // Developer Mock Fallback (if Stripe keys are missing)
    if (!process.env.STRIPE_API_KEY) {
      console.warn("Stripe API key is missing. Mocking subscription checkout flow...");
      
      // Update DB to Active subscription immediately
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          stripePriceId: priceId || "mock_pro_tier",
          status: "active",
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        create: {
          userId,
          stripePriceId: priceId || "mock_pro_tier",
          status: "active",
          stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return NextResponse.json({ url: `/dashboard?checkout=success&mock=true` });
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Fetch user and check if they have a stripe customer id
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    let stripeCustomerId = dbUser?.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      // Create customer on Stripe
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;

      // Update db with stripe customer ID
      await prisma.subscription.upsert({
        where: { userId },
        update: { stripeCustomerId },
        create: { userId, stripeCustomerId },
      });
    }

    // Create session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?checkout=canceled`,
      metadata: { userId },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
