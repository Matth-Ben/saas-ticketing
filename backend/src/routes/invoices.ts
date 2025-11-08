import { Router } from 'express';
// TODO: Import controllers
// import { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice, signInvoice } from '../controllers/invoiceController';
// TODO: Import middleware
// import { authenticate } from '../middleware/auth';
// TODO: Import validators
// import { validateCreateInvoice, validateUpdateInvoice } from '../validators/invoiceValidator';

const router = Router();

// TODO: Implement routes
// GET /api/invoices?projectId=xxx - Get invoices (optionally filtered by project)
// GET /api/invoices/:id - Get single invoice
// POST /api/invoices - Create new invoice/quote/contract
// PUT /api/invoices/:id - Update invoice
// DELETE /api/invoices/:id - Delete invoice
// POST /api/invoices/:id/sign - Sign invoice (for client link)
// POST /api/invoices/:id/validate - Validate quote and create tickets

// router.use(authenticate);

router.get('/health', (req, res) => {
  res.json({ message: 'Invoice routes - TODO: Implement' });
});

export default router;

