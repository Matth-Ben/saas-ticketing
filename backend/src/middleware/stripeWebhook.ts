import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { AppError } from './errorHandler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export const verifyStripeWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      throw new AppError('Missing stripe-signature header', 400);
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    // TODO: Verify webhook signature
    // const event = stripe.webhooks.constructEvent(
    //   req.body,
    //   signature,
    //   webhookSecret
    // );
    
    // req.body = event;
    next();
  } catch (error) {
    next(new AppError('Invalid webhook signature', 400));
  }
};

