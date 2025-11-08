import { body } from 'express-validator';

export const validateCreateInvoice = [
  body('type')
    .isIn(['invoice', 'quote', 'contract'])
    .withMessage('Invalid invoice type'),
  body('projectId').notEmpty().withMessage('Project ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
];

export const validateUpdateInvoice = [
  body('type')
    .optional()
    .isIn(['invoice', 'quote', 'contract'])
    .withMessage('Invalid invoice type'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
];

