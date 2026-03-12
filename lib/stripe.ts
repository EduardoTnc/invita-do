import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  appInfo: {
    name: 'invita-do',
    version: '2.1.0',
  },
});
