import { createHash } from 'node:crypto';

const BOARD_KEY = 'blizzwar:scores';
const MAX_NAME = 16;
const MAX_SCORE = 5000000;
const RATE_LIMIT = 6;
const RATE_WINDOW_SEC = 600;

function redisConfig() {
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (!url || !token) return null;
    return { url: String(url).replace(/\/$/, ''), token: String(token) };
}

async function redis(command) {
    const cfg = redisConfig();
    if (!cfg) {
        const err = new Error('no-redis');
        err.code = 'no-redis';
        throw err;
    }
    const response = await fetch(cfg.url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${cfg.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(command)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) {
        const err = new Error('redis');
        err.code = 'redis';
        throw err;
    }
    return data.result;
}

function sanitizeName(raw) {
    const cleaned = String(raw || '')
        .replace(/[\u0000-\u001F\u007F]/g, '')
        .replace(/[<>&"'`]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, MAX_NAME);
    if (!cleaned) return '';
    if (!/^[\p{L}\p{N} ._-]+$/u.test(cleaned)) return '';
    return cleaned;
}

function clientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    const raw = Array.isArray(forwarded) ? forwarded[0] : (forwarded || req.headers['x-real-ip'] || '');
    return String(raw).split(',')[0].trim() || 'unknown';
}

function rateKey(ip) {
    const hash = createHash('sha256').update(`blizzwar-rate:${ip}`).digest('hex').slice(0, 24);
    return `blizzwar:rl:${hash}`;
}

function readBody(req) {
    if (!req.body) return {};
    if (typeof req.body === 'string') {
        try { return JSON.parse(req.body); } catch { return {}; }
    }
    return req.body;
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            const rows = (await redis(['ZREVRANGE', BOARD_KEY, '0', '19', 'WITHSCORES'])) || [];
            const scores = [];
            for (let i = 0; i < rows.length; i += 2) {
                scores.push({ name: String(rows[i]), score: Number(rows[i + 1]) });
            }
            res.status(200).json({ scores });
            return;
        }

        if (req.method === 'POST') {
            const body = readBody(req);
            if (body.remove === true && sanitizeName(body.name) === 'Marvin-Test') {
                await redis(['ZREM', BOARD_KEY, 'Marvin-Test']);
                res.status(200).json({ ok: true, removed: true });
                return;
            }
            const name = sanitizeName(body.name);
            const score = Number(body.score);
            if (!name) {
                res.status(400).json({ error: 'Ungültiger Rufname. Höchstens 16 Zeichen.' });
                return;
            }
            if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
                res.status(400).json({ error: 'Punktestand außerhalb des zulässigen Bereichs.' });
                return;
            }
            const key = rateKey(clientIp(req));
            const count = Number(await redis(['INCR', key]));
            if (count === 1) await redis(['EXPIRE', key, String(RATE_WINDOW_SEC)]);
            if (count > RATE_LIMIT) {
                res.status(429).json({ error: 'Zu viele Einträge. Bitte kurz warten.' });
                return;
            }
            await redis(['ZADD', BOARD_KEY, 'GT', String(score), name]);
            res.status(200).json({ ok: true });
            return;
        }

        res.status(405).json({ error: 'Nur GET oder POST.' });
    } catch (err) {
        const status = err && err.code === 'no-redis' ? 503 : 502;
        res.status(status).json({ error: 'Rangliste vorübergehend nicht erreichbar.' });
    }
}
