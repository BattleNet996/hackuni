/**
 * API Client Helper
 * Ensures authentication token is included in all API requests
 */

/**
 * Get the authentication token from localStorage or cookies
 */
export function getAuthToken(): string | null {
  // Try localStorage first (fallback)
  const localToken = localStorage.getItem('token');
  if (localToken) {
    return localToken;
  }

  // Try to get from cookies
  const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
  if (match) {
    return match[2];
  }

  return null;
}

/**
 * Enhanced fetch wrapper that includes authentication
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authentication token if available
  if (token) {
    // Try multiple methods to ensure the token is received
    (headers as any)['x-auth-token'] = token;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Always include cookies
  });

  return response;
}

/**
 * API error handler
 */
export function handleApiError(response: Response, data?: any): Error {
  if (data?.error?.message) {
    return new Error(data.error.message);
  }
  return new Error(`API Error: ${response.status} ${response.statusText}`);
}
