import { body } from 'express-validator';

export const validateRegister = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .isIn(['freelance', 'agency', 'enterprise'])
    .withMessage('Invalid role'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateForgotPassword = [
  body('email').isEmail().withMessage('Invalid email'),
];

export const validateResetPassword = [
  body('token').notEmpty().withMessage('Token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

