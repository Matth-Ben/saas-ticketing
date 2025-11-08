import { Router } from 'express';
// TODO: Import controllers
// import { createCheckoutSession, createPortalSession, handleWebhook, getSubscription } from '../controllers/stripeController';
// TODO: Import middleware
// import { authenticate } from '../middleware/auth';
// TODO: Import webhook signature verification middleware
// import { verifyStripeWebhook } from '../middleware/stripeWebhook';

const router = Router();

// TODO: Implement routes
// POST /api/stripe/checkout - Create Stripe checkout session
// POST /api/stripe/portal - Create customer portal session
// POST /api/stripe/webhook - Handle Stripe webhooks (no auth required, signature verified)
// GET /api/stripe/subscription - Get current subscription

// router.post('/webhook', verifyStripeWebhook, handleWebhook);
// router.use(authenticate);

router.get('/health', (req, res) => {
  res.json({ message: 'Stripe routes - TODO: Implement' });
});

export default router;

