import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authService } from '../services/authService';
import { verifyToken } from '../utils/jwt';

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

// TODO: Implement logout function
export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Invalidate refresh token if using token blacklist
    // TODO: Return success
    res.json({ message: 'Logout - TODO: Implement' });
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

// TODO: Implement forgotPassword function
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Find user by email
    // TODO: Generate reset token
    // TODO: Send email with reset link
    // TODO: Return success (don't reveal if user exists)
    res.json({ message: 'Forgot password - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement resetPassword function
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Verify reset token
    // TODO: Hash new password
    // TODO: Update user password
    // TODO: Invalidate reset token
    // TODO: Return success
    res.json({ message: 'Reset password - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

// TODO: Implement googleAuth function
export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Handle Google OAuth callback
    // TODO: Create or find user
    // TODO: Generate JWT tokens
    // TODO: Return user and tokens
    res.json({ message: 'Google auth - TODO: Implement' });
  } catch (error) {
    next(error);
  }
};

