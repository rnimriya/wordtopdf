import NextAuth from 'next-auth';
import { authOptions } from '../../../../utils/authOptions.js';

// Resolve double-default wrapper mismatch under Next ESM
const nextAuthHandler = NextAuth.default || NextAuth;
const handler = nextAuthHandler(authOptions);

export { handler as GET, handler as POST };
