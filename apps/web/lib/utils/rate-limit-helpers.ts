/**
 * Extract client IP address from request headers
 * Supports various proxy and CDN headers in priority order
 */
export function getClientIp(headers: Map<string, string> | Headers): string {
  // Convert Headers to Map if needed
  const headerMap =
    headers instanceof Headers
      ? new Map(Array.from(headers.entries()))
      : headers;

  // Priority order for IP detection
  const ipSources = [
    'x-forwarded-for', // Standard proxy header
    'x-real-ip', // Nginx
    'cf-connecting-ip', // Cloudflare
    'x-vercel-forwarded-for', // Vercel
  ];

  for (const source of ipSources) {
    const value = headerMap.get(source);
    if (value) {
      // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
      // We want the first one (the original client)
      const ip = value.split(',')[0]?.trim();
      if (ip) {
        return ip;
      }
    }
  }

  return 'unknown';
}

/**
 * Format retry-after time in a human-readable way
 * @param seconds Number of seconds until retry is allowed
 * @returns Formatted string like "5 minutes" or "45 seconds"
 */
export function formatRetryAfter(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  return `${seconds} second${seconds === 1 ? '' : 's'}`;
}
