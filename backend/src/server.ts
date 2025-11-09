import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { configurePassport } from './config/passport';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
configurePassport();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import and mount routes
import authRoutes from './routes/auth';
import settingsRoutes from './routes/settings';
// TODO: Import other routes
// import projectRoutes from './routes/projects';
// import ticketRoutes from './routes/tickets';
// import invoiceRoutes from './routes/invoices';
// import stripeRoutes from './routes/stripe';
// import supportRoutes from './routes/support';
// import analyticsRoutes from './routes/analytics';
// import adminRoutes from './routes/admin';

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
// TODO: Mount other routes
// app.use('/api/projects', projectRoutes);
// app.use('/api/tickets', ticketRoutes);
// app.use('/api/invoices', invoiceRoutes);
// app.use('/api/stripe', stripeRoutes);
// app.use('/api/support', supportRoutes);
// app.use('/api/analytics', analyticsRoutes);
// app.use('/api/admin', adminRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

export default app;
