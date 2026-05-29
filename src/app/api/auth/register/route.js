import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db.js';
import bcrypt from 'bcryptjs';
import { rateLimit } from '../../../../utils/rateLimit.js';
import { headers } from 'next/headers';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    const clientIp = headers().get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // Rate limit: Max 5 registration attempts per hour per IP
    const rateLimitResult = rateLimit(clientIp, 5, 3600000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${rateLimitResult.reset} seconds.` },
        { status: 429 }
      );
    }

    const { name, email, password } = await req.json();

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password must be strings' }, { status: 400 });
    }

    if (name !== undefined && name !== null && typeof name !== 'string') {
      return NextResponse.json({ error: 'Name must be a string' }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();
    const passwordTrimmed = password;

    if (!emailNormalized || !passwordTrimmed) {
      return NextResponse.json({ error: 'Email and password cannot be empty' }, { status: 400 });
    }

    if (emailNormalized.length > 254) {
      return NextResponse.json({ error: 'Email must be less than 254 characters' }, { status: 400 });
    }

    if (name && name.length > 100) {
      return NextResponse.json({ error: 'Name must be less than 100 characters' }, { status: 400 });
    }

    // 1. Email structure regex verification
    if (!emailRegex.test(emailNormalized)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // 2. Strong Password length constraint (Min 8, Max 72 to prevent Bcrypt CPU DoS)
    if (passwordTrimmed.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    if (passwordTrimmed.length > 72) {
      return NextResponse.json({ error: 'Password must be at most 72 characters long' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(passwordTrimmed, 12); // Increased salt rounds for extra security

    // Create user and initial subscription record in a transaction
    const user = await prisma.user.create({
      data: {
        name: name ? name.trim() : null,
        email: emailNormalized,
        password: hashedPassword,
        subscription: {
          create: {
            status: 'inactive',
          },
        },
      },
    });

    return NextResponse.json({ message: 'User registered successfully', userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
