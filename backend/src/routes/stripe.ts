import { Router } from 'express';
import { createCheckoutSession, createPortalSession, handleWebhook, getSubscription } from '../controllers/stripeController';
import { authenticate } from '../middleware/auth';
// TODO: Import webhook signature verification middleware
// import { verifyStripeWebhook } from '../middleware/stripeWebhook';

const router = Router();

// Webhook route (no auth required, signature verified)
// router.post('/webhook', verifyStripeWebhook, handleWebhook);

// Protected routes
router.use(authenticate);

// POST /api/stripe/checkout - Create Stripe checkout session
router.post('/checkout', createCheckoutSession);

// POST /api/stripe/portal - Create customer portal session
router.post('/portal', createPortalSession);

// GET /api/stripe/subscription - Get current subscription
// router.get('/subscription', getSubscription);

export default router;

