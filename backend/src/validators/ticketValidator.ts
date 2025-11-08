import { body } from 'express-validator';

export const validateCreateTicket = [
  body('title').notEmpty().withMessage('Ticket title is required'),
  body('description').optional().isString(),
  body('projectId').notEmpty().withMessage('Project ID is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('estimatedTime').optional().isNumeric().withMessage('Estimated time must be a number'),
];

export const validateUpdateTicket = [
  body('title').optional().notEmpty().withMessage('Ticket title cannot be empty'),
  body('description').optional().isString(),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'done'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
];

