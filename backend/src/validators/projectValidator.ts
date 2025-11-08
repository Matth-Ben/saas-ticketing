import { body } from 'express-validator';

export const validateCreateProject = [
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').optional().isString(),
];

export const validateUpdateProject = [
  body('name').optional().notEmpty().withMessage('Project name cannot be empty'),
  body('description').optional().isString(),
];

