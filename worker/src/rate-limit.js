// ── Rate limiting via Cloudflare KV ──
// Per-IP sliding window + global daily budget.

export async function checkRateLimit(ip, env) {
  // If KV is not configured, skip rate limiting (development mode)
  if (!env.RATE_LIMIT) return { limited: false };

  const perIpLimit = parseInt(env.PER_IP_LIMIT) || 10;
  const windowSec = parseInt(env.PER_IP_WINDOW_SECONDS) || 600;
  const dailyBudget = parseInt(env.DAILY_BUDGET) || 500;

  const now = Date.now();
  const dayKey = `global:${new Date().toISOString().slice(0, 10)}`;

  // Check global daily budget
  const dailyCount = parseInt(await env.RATE_LIMIT.get(dayKey)) || 0;
  if (dailyCount >= dailyBudget) {
    return { limited: true, reason: 'Daily limit reached. Try again tomorrow.' };
  }

  // Check per-IP limit
  const ipKey = `ip:${ip}`;
  const ipData = await env.RATE_LIMIT.get(ipKey, 'json');

  if (ipData) {
    const elapsed = (now - ipData.windowStart) / 1000;
    if (elapsed < windowSec) {
      if (ipData.count >= perIpLimit) {
        const waitMin = Math.ceil((windowSec - elapsed) / 60);
        return { limited: true, reason: `Rate limit reached. Try again in ${waitMin} minute${waitMin > 1 ? 's' : ''}.` };
      }
      // increment
      await env.RATE_LIMIT.put(ipKey, JSON.stringify({
        count: ipData.count + 1,
        windowStart: ipData.windowStart,
      }), { expirationTtl: windowSec });
    } else {
      // window expired, reset
      await env.RATE_LIMIT.put(ipKey, JSON.stringify({
        count: 1,
        windowStart: now,
      }), { expirationTtl: windowSec });
    }
  } else {
    // first request
    await env.RATE_LIMIT.put(ipKey, JSON.stringify({
      count: 1,
      windowStart: now,
    }), { expirationTtl: windowSec });
  }

  // increment daily counter
  await env.RATE_LIMIT.put(dayKey, String(dailyCount + 1), { expirationTtl: 86400 });

  return { limited: false };
}
