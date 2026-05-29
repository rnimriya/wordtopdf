import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db.js';
import crypto from 'crypto';
import { rateLimit } from '../../../../utils/rateLimit.js';
import { headers } from 'next/headers';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    const clientIp = headers().get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // Rate limit: Max 3 forgot password requests per hour per IP
    const rateLimitResult = rateLimit(clientIp, 3, 3600000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: `Too many password reset requests. Please try again in ${rateLimitResult.reset} seconds.` },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (typeof email !== 'string') {
      return NextResponse.json({ error: 'Email must be a string' }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    if (!emailNormalized) {
      return NextResponse.json({ error: 'Email cannot be empty' }, { status: 400 });
    }

    if (emailNormalized.length > 254) {
      return NextResponse.json({ error: 'Email must be less than 254 characters' }, { status: 400 });
    }

    // Validate email format
    if (!emailRegex.test(emailNormalized)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (!user) {
      // Return generic success to prevent email enumeration attacks
      return NextResponse.json({ message: 'If an account exists with this email, a reset link has been generated.' });
    }

    // Generate secure token and 1-hour expiry
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    console.log(`[DEVELOPER PASSWORD RESET URL]: ${resetUrl}`);

    return NextResponse.json({ 
      message: 'A password reset link has been generated successfully.',
      resetUrl: process.env.NODE_ENV === 'development' || !process.env.STRIPE_API_KEY ? resetUrl : null
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
