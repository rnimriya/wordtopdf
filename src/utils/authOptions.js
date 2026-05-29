import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './db.js';
import bcrypt from 'bcryptjs';

// Resolve double-default wrapper mismatch under Next ESM
const Credentials = CredentialsProvider.default || CredentialsProvider;

export const authOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error('No user found with this email');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      if (token?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          include: { subscription: true }
        });
        
        if (dbUser && dbUser.subscription) {
          token.subscriptionStatus = dbUser.subscription.status;
          token.stripePriceId = dbUser.subscription.stripePriceId;
        } else {
          token.subscriptionStatus = 'inactive';
          token.stripePriceId = null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.subscriptionStatus = token.subscriptionStatus || 'inactive';
        session.user.stripePriceId = token.stripePriceId || null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};
