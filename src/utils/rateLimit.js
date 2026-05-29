const rateLimitMap = new Map();

/**
 * Simple in-memory sliding window rate limiter
 * @param {string} ip - IP address to rate limit
 * @param {number} limit - Maximum number of requests allowed in the window
 * @param {number} windowMs - Window duration in milliseconds (default: 1 hour)
 * @returns {object} - { allowed: boolean, remaining: number, reset: number }
 */
export function rateLimit(ip, limit = 10, windowMs = 3600000) {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip);
  // Filter out expired timestamps
  const activeTimestamps = timestamps.filter(t => now - t < windowMs);
  
  if (activeTimestamps.length >= limit) {
    const nextReset = activeTimestamps[0] + windowMs;
    return {
      allowed: false,
      remaining: 0,
      reset: Math.ceil((nextReset - now) / 1000) // seconds remaining
    };
  }

  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);

  // Periodically clean up the map to prevent memory leaks
  if (rateLimitMap.size > 2000) {
    const cleanupNow = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      const filtered = val.filter(t => cleanupNow - t < windowMs);
      if (filtered.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, filtered);
      }
    }
  }

  return {
    allowed: true,
    remaining: limit - activeTimestamps.length,
    reset: Math.ceil(windowMs / 1000)
  };
}
