import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const twoFactorService = {
  /**
   * Generate a new 2FA secret for a user
   */
  generateSecret(email: string): { secret: string; otpauthUrl: string } {
    const secret = speakeasy.generateSecret({
      name: `SaaS Ticketing (${email})`,
      issuer: 'SaaS Ticketing',
      length: 32,
    });

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url || '',
    };
  },

  /**
   * Generate QR code data URL from otpauth URL
   */
  async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
      return qrCodeDataUrl;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  },

  /**
   * Verify a 2FA token
   */
  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps before/after for clock skew
    });
  },

  /**
   * Generate backup codes for 2FA recovery
   */
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric codes
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  },
};
