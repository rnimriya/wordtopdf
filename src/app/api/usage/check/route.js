import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../utils/authOptions.js';
import { prisma } from '../../../../utils/db.js';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        authenticated: false,
        limit: 3,
        count: 0,
        remaining: 3,
      });
    }

    const userId = session.user.id;
    const isPro = session.user.subscriptionStatus === 'active';

    const limit = isPro ? 999999 : 5;
    const today = new Date().toISOString().split('T')[0];

    const usage = await prisma.usageLimit.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    const count = usage ? usage.count : 0;
    const remaining = Math.max(0, limit - count);

    return NextResponse.json({
      authenticated: true,
      subscriptionStatus: session.user.subscriptionStatus,
      isPro,
      limit,
      count,
      remaining,
    });
  } catch (error) {
    console.error('Usage check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
