// utils/jwt.js
import { createHmac, timingSafeEqual } from 'node:crypto';

export function signToken(payload) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const signature = createHmac('sha256', process.env.JWT_SECRET || 'secret_key')
        .update(signingInput)
        .digest('base64url');

    return `${signingInput}.${signature}`;
}

export function verifyToken(token) {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = createHmac('sha256', process.env.JWT_SECRET || 'secret_key')
        .update(signingInput)
        .digest('base64url');

    
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
    
    
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
}