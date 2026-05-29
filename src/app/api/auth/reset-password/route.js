import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db.js';
import bcrypt from 'bcryptjs';
import { rateLimit } from '../../../../utils/rateLimit.js';
import { headers } from 'next/headers';

export async function POST(req) {
  try {
    const clientIp = headers().get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // Rate limit: Max 10 reset attempts per hour per IP
    const rateLimitResult = rateLimit(clientIp, 10, 3600000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: `Too many reset attempts. Please try again in ${rateLimitResult.reset} seconds.` },
        { status: 429 }
      );
    }

    const { token, password } = await req.json();

    if (typeof token !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Token and password must be strings' }, { status: 400 });
    }

    // Validate that token is exactly 64 hex characters (32 bytes)
    const tokenRegex = /^[0-9a-fA-F]{64}$/;
    if (!tokenRegex.test(token)) {
      return NextResponse.json({ error: 'Invalid reset token format' }, { status: 400 });
    }

    const passwordTrimmed = password;

    if (!passwordTrimmed) {
      return NextResponse.json({ error: 'Password cannot be empty' }, { status: 400 });
    }

    // Enforce 8-character minimum and 72-character maximum secure threshold on backend
    if (passwordTrimmed.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    if (passwordTrimmed.length > 72) {
      return NextResponse.json({ error: 'Password must be at most 72 characters long' }, { status: 400 });
    }

    // Find user by reset token
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Check expiry limits
    if (user.resetTokenExpiry && new Date() > new Date(user.resetTokenExpiry)) {
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    // Hash new password using 12 salt rounds
    const hashedPassword = await bcrypt.hash(passwordTrimmed, 12);

    // Update credentials and clear token fields in a single transaction
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
