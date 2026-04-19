import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const EMAIL_VERIFICATION_SECRET =
  process.env.EMAIL_VERIFICATION_SECRET ||
  process.env.JWT_SECRET ||
  'hackuni-email-verification-change-in-production';

const EMAIL_VERIFICATION_COOKIE = 'email_verification_state';
const EMAIL_VERIFICATION_TTL_MS = 10 * 60 * 1000;

interface EmailVerificationPayload {
  email: string;
  purpose: 'register';
}

interface VerificationStatePayload {
  email: string;
  code: string;
  purpose: 'register';
  sent_at: number;
  nonce: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function createEmailVerificationToken(email: string): string {
  const payload: EmailVerificationPayload = {
    email: normalizeEmail(email),
    purpose: 'register',
  };

  return jwt.sign(payload, EMAIL_VERIFICATION_SECRET, { expiresIn: '30m' });
}

export function verifyEmailVerificationToken(token: string, email: string): boolean {
  try {
    const decoded = jwt.verify(token, EMAIL_VERIFICATION_SECRET) as EmailVerificationPayload;

    return decoded.purpose === 'register' && decoded.email === normalizeEmail(email);
  } catch {
    return false;
  }
}

export function generateVerificationCode(): string {
  const value = crypto.randomInt(0, 1_000_000);
  return value.toString().padStart(6, '0');
}

export function createVerificationStateCookieValue(email: string, code: string): string {
  const payload: VerificationStatePayload = {
    email: normalizeEmail(email),
    code,
    purpose: 'register',
    sent_at: Date.now(),
    nonce: crypto.randomBytes(12).toString('hex'),
  };

  return jwt.sign(payload, EMAIL_VERIFICATION_SECRET, {
    expiresIn: Math.floor(EMAIL_VERIFICATION_TTL_MS / 1000),
  });
}

export function verifyVerificationStateCookieValue(value: string, email: string, code: string): boolean {
  try {
    const decoded = jwt.verify(value, EMAIL_VERIFICATION_SECRET) as VerificationStatePayload;
    const normalizedEmail = normalizeEmail(email);
    const normalizedCode = String(code || '').trim().replace(/\D/g, '');

    if (decoded.purpose !== 'register') return false;
    if (decoded.email !== normalizedEmail) return false;
    if (decoded.code !== normalizedCode) return false;
    if (Date.now() - decoded.sent_at > EMAIL_VERIFICATION_TTL_MS) return false;

    return true;
  } catch {
    return false;
  }
}

export function getEmailVerificationCookieName(): string {
  return EMAIL_VERIFICATION_COOKIE;
}

export function getEmailVerificationTtlSeconds(): number {
  return Math.floor(EMAIL_VERIFICATION_TTL_MS / 1000);
}

export function getEmailSenderAddress(): string {
  return process.env.EMAIL_FROM || 'AttraX <noreply@attrax.ai>';
}

export function getEmailReplyTo(): string | undefined {
  return process.env.EMAIL_REPLY_TO || undefined;
}

export function requireResendApiKey(): string {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('EMAIL_PROVIDER_NOT_CONFIGURED');
  }
  return apiKey;
}

export async function sendVerificationEmail(email: string, code: string) {
  const resendApiKey = requireResendApiKey();
  const payload = {
    from: getEmailSenderAddress(),
    to: [normalizeEmail(email)],
    reply_to: getEmailReplyTo(),
    subject: 'Your AttraX verification code',
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
        <h2 style="margin:0 0 16px;font-size:24px">Your verification code</h2>
        <p style="margin:0 0 16px;line-height:1.6">Use this 6-digit code to continue registration:</p>
        <div style="margin:0 0 20px;padding:16px 20px;background:#111;color:#fff;font-size:32px;font-weight:700;letter-spacing:0.35em;text-align:center;border-radius:12px">
          ${code}
        </div>
        <p style="margin:0 0 8px;line-height:1.6;color:#444">This code expires in 10 minutes.</p>
        <p style="margin:0;line-height:1.6;color:#666">If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`EMAIL_SEND_FAILED:${text}`);
  }

  return response.json();
}
