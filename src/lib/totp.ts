import { randomBytes, createHmac, createCipheriv, createDecipheriv } from 'node:crypto';

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
// Base32 helpers (RFC 4648) — needed for TOTP secret encoding
// ---------------------------------------------------------------------------

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buf: Buffer): string {
  let result = '';
  let bits   = 0;
  let value  = 0;

  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) result += BASE32[(value << (5 - bits)) & 31];
  return result;
}

function base32Decode(encoded: string): Buffer {
  const str   = encoded.toUpperCase().replace(/=+$/, '');
  const bytes: number[] = [];
  let bits  = 0;
  let value = 0;

  for (const char of str) {
    const idx = BASE32.indexOf(char);
    if (idx === -1) throw new Error(`Invalid base32 character: ${char}`);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

// ---------------------------------------------------------------------------
// TOTP helpers (RFC 6238 / HOTP RFC 4226)
// ---------------------------------------------------------------------------

function hotp(secretBase32: string, counter: bigint): number {
  const key         = base32Decode(secretBase32);
  const counterBuf  = Buffer.alloc(8);
  counterBuf.writeBigInt64BE(counter);

  const hmac  = createHmac('sha1', key);
  hmac.update(counterBuf);
  const hash  = hmac.digest();

  const offset = hash[hash.length - 1] & 0x0f;
  const otp    =
    (((hash[offset]     & 0x7f) << 24) |
     ((hash[offset + 1] & 0xff) << 16) |
     ((hash[offset + 2] & 0xff) << 8)  |
      (hash[offset + 3] & 0xff)) % 1_000_000;

  return otp;
}

/** Generate a new random TOTP secret (base32, 20 bytes). */
export function generateTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

/**
 * Build the otpauth:// URI that authenticator apps expect.
 */
export function buildOtpauthUri(secret: string, email: string): string {
  const issuer = 'Magna Arts Council';
  const label  = encodeURIComponent(`${issuer}:${email}`);
  return (
    `otpauth://totp/${label}` +
    `?secret=${secret}` +
    `&issuer=${encodeURIComponent(issuer)}` +
    `&algorithm=SHA1&digits=6&period=30`
  );
}

/**
 * Verify a 6-digit TOTP code against a base32 secret.
 * Accepts codes from the previous, current, and next time step (±1 window).
 */
export function verifyTotpCode(code: string, secret: string): boolean {
  const codeNum = parseInt(code, 10);
  if (isNaN(codeNum) || code.length !== 6) return false;

  const now     = BigInt(Math.floor(Date.now() / 1000));
  const counter = now / 30n;

  for (let delta = -1n; delta <= 1n; delta++) {
    if (hotp(secret, counter + delta) === codeNum) return true;
  }

  return false;
}
