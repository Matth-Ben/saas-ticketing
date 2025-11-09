import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const emailService = {
  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'SaaS Ticketing'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Réinitialisation de mot de passe</h1>
              </div>
              <div class="content">
                <p>Bonjour,</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
                </div>
                <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; color: #3b82f6;">${resetUrl}</p>
                <p><strong>Ce lien expirera dans 1 heure.</strong></p>
                <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
                <p>Cordialement,<br>L'équipe ${process.env.APP_NAME || 'SaaS Ticketing'}</p>
              </div>
              <div class="footer">
                <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Bonjour,

        Vous avez demandé à réinitialiser votre mot de passe.

        Cliquez sur ce lien pour créer un nouveau mot de passe :
        ${resetUrl}

        Ce lien expirera dans 1 heure.

        Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.

        Cordialement,
        L'équipe ${process.env.APP_NAME || 'SaaS Ticketing'}
      `,
    };

    try {
      // In development, if SMTP is not configured, just log the reset URL
      if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        logger.warn('SMTP not configured. Password reset link:', resetUrl);
        logger.warn('Email would be sent to:', email);
        return;
      }

      await transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error('Error sending password reset email:', error);
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }
  },

  /**
   * Send welcome email (optional)
   */
  async sendWelcomeEmail(email: string, firstName?: string): Promise<void> {
    // TODO: Implement welcome email
    logger.info(`Welcome email would be sent to ${email}`);
  },

  /**
   * Send email verification (optional)
   */
  async sendEmailVerification(email: string, token: string): Promise<void> {
    // TODO: Implement email verification
    logger.info(`Email verification would be sent to ${email}`);
  },
};
