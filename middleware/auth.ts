import { NextRequest } from 'next/server';
import { verifyToken, TokenPayload } from '@/lib/jwt';

export function getAuthToken(request: NextRequest): string | null {
  const authCookie = request.cookies.get('auth_token');
  return authCookie?.value || null;
}

export function getUserFromToken(token: string): TokenPayload | null {
  try {
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: NextRequest): TokenPayload {
  const token = getAuthToken(request);
  
  if (!token) {
    throw new Error('Unauthorized');
  }

  const user = getUserFromToken(token);
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export function requireAdmin(request: NextRequest): TokenPayload {
  const user = requireAuth(request);
  
  if (user.role !== 'admin') {
    throw new Error('Forbidden - Admin access required');
  }

  return user;
}

