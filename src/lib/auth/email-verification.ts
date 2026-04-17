import jwt from 'jsonwebtoken';

const EMAIL_VERIFICATION_SECRET =
  process.env.EMAIL_VERIFICATION_SECRET ||
  process.env.JWT_SECRET ||
  'hackuni-email-verification-change-in-production';

interface EmailVerificationPayload {
  email: string;
  purpose: 'register';
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

    return (
      decoded.purpose === 'register' &&
      decoded.email === normalizeEmail(email)
    );
  } catch {
    return false;
  }
}

export function getEmailRedirectTo(requestUrl: string): string {
  const url = new URL(requestUrl);
  return `${url.origin}/register`;
}
