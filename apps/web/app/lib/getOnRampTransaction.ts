"use server";
import { headers } from 'next/headers';

export const fetchOnRampHistory = async () => {
    const cookie = (await headers()).get('cookie') ?? '';
    const base = process.env.VERCEL_URL ?? 'http://localhost:3000';
    const res = await fetch(`${base}/api/ramptranc`, {
        method: 'GET',
        headers: { cookie },
        next: { tags: ['on-ramp'] }
    });
    const json = await res.json().catch(() => ({ success: false, data: [] }));
    return Array.isArray(json?.data) ? json.data : [];
};
