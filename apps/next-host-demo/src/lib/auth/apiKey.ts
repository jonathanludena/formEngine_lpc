/**
 * Verify API key for server-to-server communication
 */
export function verifyApiKey(apiKey: string | null): boolean {
  const expectedKey = process.env.API_KEY;
  
  if (!expectedKey) {
    console.warn('API_KEY not configured in environment variables');
    return false;
  }
  
  return apiKey === expectedKey;
}

/**
 * Get API key from request headers
 */
export function getApiKeyFromHeaders(headers: Headers): string | null {
  return headers.get('x-api-key');
}
