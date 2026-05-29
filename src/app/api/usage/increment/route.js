import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../utils/authOptions.js';
import { prisma } from '../../../../utils/db.js';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required to increment usage' }, { status: 401 });
    }

    const userId = session.user.id;
    const isPro = session.user.subscriptionStatus === 'active';

    const limit = isPro ? 999999 : 5;
    const today = new Date().toISOString().split('T')[0];

    // Find current usage count
    const usage = await prisma.usageLimit.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    const currentCount = usage ? usage.count : 0;

    if (currentCount >= limit) {
      return NextResponse.json({
        allowed: false,
        error: 'Daily conversion limit reached. Please upgrade to Pro.',
        limit,
        count: currentCount,
      }, { status: 403 });
    }

    // Increment count using Prisma upsert
    const updatedUsage = await prisma.usageLimit.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        count: {
          increment: 1,
        },
        lastUsedAt: new Date(),
      },
      create: {
        userId,
        date: today,
        count: 1,
        lastUsedAt: new Date(),
      },
    });

    return NextResponse.json({
      allowed: true,
      count: updatedUsage.count,
      limit,
      remaining: Math.max(0, limit - updatedUsage.count),
    });
  } catch (error) {
    console.error('Usage increment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
