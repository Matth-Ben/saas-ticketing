import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AuthRequest } from '../middleware/auth';
import { authService } from '../services/authService';
import { verifyToken, generateTokens } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email invalide' });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    // Register user
    const result = await authService.registerUser({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'Email déjà utilisé') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Login user
    const result = await authService.loginUser(email, password);

    res.json(result);
  } catch (error: any) {
    if (error.message === 'Email ou mot de passe incorrect') {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Note: For now, logout is handled client-side by removing tokens
    // TODO: Implement token blacklist/invalidation when needed
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Refresh token requis' });
    }

    // Verify refresh token
    const payload = verifyToken(token, true);

    // Generate new access token
    const { generateTokens } = await import('../utils/jwt');
    const { accessToken } = generateTokens({
      id: payload.id,
      email: payload.email,
      role: payload.role,
      organizationId: payload.organizationId,
    });

    res.json({ accessToken });
  } catch (error: any) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    try {
      // Request password reset
      const { token, user } = await authService.requestPasswordReset(email);

      // Send email with reset link
      const { emailService } = await import('../services/emailService');
      await emailService.sendPasswordResetEmail(email, token);

      // Always return success (don't reveal if user exists - security best practice)
      res.json({
        message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation'
      });
    } catch (error: any) {
      // Even if user not found, return success message (security best practice)
      if (error.message === 'USER_NOT_FOUND') {
        return res.json({
          message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation'
        });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token et mot de passe requis' });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    // Reset password
    await authService.resetPassword(token, password);

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error: any) {
    if (error.message === 'Token invalide ou expiré') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Initiate Google OAuth flow
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

// Handle Google OAuth callback
export const googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: false }, (err: any, user: any) => {
    if (err || !user) {
      // Redirect to frontend with error
      const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/login?error=google_auth_failed`);
    }

    try {
      // Generate JWT tokens
      const tokens = generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        organizationId: user.organizationId || undefined,
      });

      // Redirect to frontend with tokens
      const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;

      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

