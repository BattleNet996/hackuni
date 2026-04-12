import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hackuni-default-secret-change-in-production';

export interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Generate JWT token for user
 */
export function generateToken(userId: string): string {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
  };

  return jwt.sign(payload, JWT_SECRET);
}

/**
 * Verify JWT token and return user ID
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return { userId: decoded.userId };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
