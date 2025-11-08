'use client';

import React from 'react';
// TODO: Import Stripe Elements
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
  planId: string;
  billingPeriod: 'month' | 'year';
}

export function StripeCheckout({ planId, billingPeriod }: StripeCheckoutProps) {
  // TODO: Implement Stripe checkout
  // TODO: Create checkout session
  // TODO: Redirect to Stripe Checkout

  return (
    <div>
      <p>TODO: Implement Stripe checkout</p>
    </div>
  );
}

