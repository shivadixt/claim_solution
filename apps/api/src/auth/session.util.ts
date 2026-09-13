import { randomBytes, createHash } from 'crypto';

export const SESSION_EXPIRY_DAYS = 7;
export const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function getSessionExpiryDate(): Date {
  return new Date(Date.now() + SESSION_EXPIRY_MS);
}
