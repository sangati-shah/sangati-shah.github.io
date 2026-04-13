// ── Cloudflare Worker: AI Theme Generator ──
// Uses Workers AI (free) with Llama, Mistral, and Gemma models.
// No external API keys needed.

import { SYSTEM_PROMPT, validateTheme } from './schema.js';
import { checkRateLimit } from './rate-limit.js';

const MODEL_MAP = {
  llama: '@cf/meta/llama-3.1-8b-instruct',
  mistral: '@cf/mistral/mistral-7b-instruct-v0.2',
  gemma: '@cf/google/gemma-7b-it',
};

function corsHeaders(origin, allowedOrigins) {
  const origins = allowedOrigins.split(',').map(s => s.trim());
  const allowed = origins.includes(origin) || origins.includes('*');
  return {
    'Access-Control-Allow-Origin': allowed ? origin : origins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS || '*');

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Only POST to /api/theme
    const url = new URL(request.url);
    if (url.pathname !== '/api/theme' || request.method !== 'POST') {
      return new Response('Not found', { status: 404, headers: cors });
    }

    try {
      // Parse body
      let body;
      try {
        body = await request.json();
      } catch {
        return new Response('Invalid JSON', { status: 400, headers: cors });
      }

      const { model, prompt } = body;

      // Validate model
      if (!model || !MODEL_MAP[model]) {
        return new Response('Invalid model. Use: llama, mistral, or gemma.', { status: 400, headers: cors });
      }

      // Validate prompt
      if (!prompt || typeof prompt !== 'string') {
        return new Response('Prompt is required.', { status: 400, headers: cors });
      }

      // Sanitize prompt: strip control chars, limit length
      const cleanPrompt = prompt.replace(/[\x00-\x1f\x7f]/g, '').trim().slice(0, 200);
      if (!cleanPrompt) {
        return new Response('Prompt is empty after sanitization.', { status: 400, headers: cors });
      }

      // Rate limiting
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateCheck = await checkRateLimit(ip, env);
      if (rateCheck.limited) {
        return new Response(JSON.stringify({ error: rateCheck.reason }), {
          status: 429,
          headers: { 'Content-Type': 'application/json', ...cors },
        });
      }

      // Call Workers AI
      const modelId = MODEL_MAP[model];
      const aiResponse = await env.AI.run(modelId, {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: cleanPrompt },
        ],
        max_tokens: 1024,
        temperature: 0.8,
      });

      // Extract response text
      const responseText = aiResponse.response || aiResponse.result?.response || '';

      // Try to parse JSON from response
      let parsed;
      try {
        // Try direct parse first
        parsed = JSON.parse(responseText);
      } catch {
        // Try to extract JSON from text (model might wrap it)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch {
            return new Response(JSON.stringify({ error: 'Failed to generate a valid theme. Try a different prompt.' }), {
              status: 502,
              headers: { 'Content-Type': 'application/json', ...cors },
            });
          }
        } else {
          return new Response(JSON.stringify({ error: 'Failed to generate a valid theme. Try a different prompt.' }), {
            status: 502,
            headers: { 'Content-Type': 'application/json', ...cors },
          });
        }
      }

      // Validate against schema
      const validated = validateTheme(parsed);
      if (!validated) {
        return new Response(JSON.stringify({ error: 'Generated theme was malformed. Try again.' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...cors },
        });
      }

      return new Response(JSON.stringify(validated), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...cors },
      });

    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'Internal server error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }
  },
};
