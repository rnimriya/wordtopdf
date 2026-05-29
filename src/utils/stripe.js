import Stripe from 'stripe';

// Use a placeholder key during build time if env variable is not set
const stripeKey = process.env.STRIPE_API_KEY || 'sk_test_mock_key_for_build';

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
});
