import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// ---------------------------------------------------------------------------
// Encryption helpers (AES-256-GCM)
// TOTP_ENCRYPTION_KEY must be a 64-character hex string (32 bytes) in env.
// ---------------------------------------------------------------------------

function getEncryptionKey(): Buffer {
  const hex = import.meta.env.TOTP_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error('TOTP_ENCRYPTION_KEY must be a 64-character hex string');
  }
  return Buffer.from(hex, 'hex');
}

/**
 * Encrypt a plaintext string.
 * Returns a colon-delimited string: iv:authTag:ciphertext (all hex-encoded).
 */
export function encryptSecret(plaintext: string): string {
  const key = getEncryptionKey();
  const iv  = randomBytes(12); // 96-bit IV for GCM
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':');
}

/**
 * Decrypt a string produced by encryptSecret().
 */
export function decryptSecret(stored: string): string {
  const key = getEncryptionKey();
  const [ivHex, authTagHex, encryptedHex] = stored.split(':');

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted secret format');
  }

  const decipher = createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(ivHex, 'hex'),
  );
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

// ---------------------------------------------------------------------------
// TOTP helpers
// ---------------------------------------------------------------------------

/** Generate a new random TOTP secret (base32). */
export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

/**
 * Build the otpauth:// URI that authenticator apps expect.
 * @param secret  The base32 TOTP secret
 * @param email   The admin user's email (shown in the authenticator app)
 */
export function buildOtpauthUri(secret: string, email: string): string {
  return authenticator.keyuri(email, 'Magna Arts Council', secret);
}

/**
 * Generate a QR code as a base64 PNG data URL from an otpauth:// URI.
 * Safe to embed directly in an <img src="..."> tag.
 */
export async function generateQrDataUrl(otpauthUri: string): Promise<string> {
  return QRCode.toDataURL(otpauthUri, {
    errorCorrectionLevel: 'M',
    width: 240,
    margin: 2,
  });
}

/**
 * Verify a 6-digit TOTP code against a plaintext secret.
 * Uses a ±1 window to account for clock skew.
 */
export function verifyTotpCode(code: string, secret: string): boolean {
  authenticator.options = { window: 1 };
  return authenticator.verify({ token: code, secret });
}
