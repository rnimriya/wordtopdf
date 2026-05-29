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

    const userId = session.user.id;

    // Fetch user and check if they have a stripe customer id
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    const stripeCustomerId = dbUser?.subscription?.stripeCustomerId;

    // Developer Mock Fallback
    if (!process.env.STRIPE_API_KEY || !stripeCustomerId) {
      console.warn("Stripe customer ID or API key missing. Mocking billing portal toggle...");
      
      const currentStatus = dbUser?.subscription?.status || "inactive";
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await prisma.subscription.update({
        where: { userId },
        data: {
          status: newStatus,
          stripeCurrentPeriodEnd: newStatus === "active" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
        }
      });

      return NextResponse.json({ url: "/dashboard?portal=mock_success" });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Stripe portal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
