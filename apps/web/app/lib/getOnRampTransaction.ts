"use server";
import { headers } from 'next/headers';

export const fetchOnRampHistory = async () => {
    const cookie = (await headers()).get('cookie') ?? '';
    const base = process.env.NEXT_PUBLIC_APP_URL ?? '';
    const res = await fetch(`${base}/api/ramptranc`, {
        method: 'GET',
        headers: { cookie },
        next: { tags: ['on-ramp'] }
    });
    const json = await res.json().catch(() => ({ success: false, data: [] }));
    return Array.isArray(json?.data) ? json.data : [];
};
