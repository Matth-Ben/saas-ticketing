import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';
import { generateTokens } from '../utils/jwt';

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'freelance' | 'agency' | 'enterprise';
}

export const authService = {
  async registerUser(data: RegisterData) {
    const { email, password, firstName, lastName, role = 'freelance' } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email déjà utilisé');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        organizationId: true,
      },
    });

    // Generate tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      organizationId: user.organizationId || undefined,
    });

    return {
      user,
      ...tokens,
    };
  },

  async loginUser(email: string, password: string) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        sessionCount: {
          increment: 1,
        },
      },
    });

    // Generate tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      organizationId: user.organizationId || undefined,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
      },
      ...tokens,
    };
  },

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },

  async generateResetToken(): Promise<string> {
    // Generate a random token
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  },

  async requestPasswordReset(email: string): Promise<{ token: string; user: any }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      throw new Error('USER_NOT_FOUND');
    }

    // Generate reset token
    const resetToken = await this.generateResetToken();

    // Hash the token before storing (security best practice)
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Set token expiration (1 hour from now)
    const resetPasswordExpires = new Date();
    resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 1);

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires,
      },
    });

    return { token: resetToken, user };
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find users with non-expired reset tokens
    const users = await prisma.user.findMany({
      where: {
        resetPasswordToken: { not: null },
        resetPasswordExpires: { gte: new Date() },
      },
    });

    // Find the user with matching token
    let matchedUser = null;
    for (const user of users) {
      if (user.resetPasswordToken) {
        const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
        if (isValidToken) {
          matchedUser = user;
          break;
        }
      }
    }

    if (!matchedUser) {
      throw new Error('Token invalide ou expiré');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: matchedUser.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  },
};

