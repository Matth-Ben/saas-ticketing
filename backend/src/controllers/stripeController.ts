import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import Stripe from 'stripe';
import { prisma } from '../utils/prisma';
import { PLANS } from '../config/plans';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

export const createCheckoutSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { planId, billingPeriod } = req.body as { planId: string; billingPeriod: 'month' | 'year' };

    // Validate plan
    const plan = PLANS[planId];
    if (!plan) {
      return res.status(400).json({ message: 'Plan invalide' });
    }

    // Validate billing period
    if (billingPeriod !== 'month' && billingPeriod !== 'year') {
      return res.status(400).json({ message: 'Période de facturation invalide' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Calculate price
    const unitAmount = billingPeriod === 'month' ? plan.priceMonthly : plan.priceYearly;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${plan.name} - ${billingPeriod === 'month' ? 'Mensuel' : 'Annuel'}`,
              description: plan.description,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: billingPeriod,
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 15, // 15 jours d'essai gratuit
        metadata: {
          userId,
          planId,
        },
      },
      success_url: `${process.env.CORS_ORIGIN}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CORS_ORIGIN}/pricing`,
      metadata: {
        userId,
        planId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

export const createPortalSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    // Get user with Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // If user doesn't have a Stripe customer ID, create one
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CORS_ORIGIN}/settings?tab=billing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement handleWebhook function
export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Get webhook event from Stripe
    // TODO: Handle different event types:
    //   - customer.subscription.created
    //   - customer.subscription.updated
    //   - customer.subscription.deleted
    //   - invoice.payment_succeeded
    //   - invoice.payment_failed
    // TODO: Update subscription in database
    // TODO: Handle trial expiration
    // TODO: Return success
    res.json({ message: 'Handle webhook - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement getSubscription function
export const getSubscription = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Get user from request
    // TODO: Fetch subscription from database
    // TODO: Return subscription details
    res.json({ message: 'Get subscription - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

