"use server";

import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { formatDateTime } from '@/lib/getFormatTimeFormat';
import OnRampHistory from '@repo/ui/onramphistory';
import { History } from 'lucide-react';
import { revalidateTag } from 'next/cache';

async function createOnRamp(amount: string, bankName: string, accountNumber: string) {
    // This is a server action handler that forwards to the API. Extend validation as needed.
    const cookie = (await headers()).get('cookie') ?? '';
    const base = process.env.NEXT_PUBLIC_APP_URL ?? '';
    const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    const body = {
        userId: session.user.id,
        // Temporarily use accountNumber as bankId input; adjust once you have bank id lookup
        bankId: Number(accountNumber) || 0,
        token,
        amount
    };

    const res = await fetch(`${base}/api/ramptranc`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', cookie },
        body: JSON.stringify(body),
        next: { tags: ['on-ramp'] }
    });
    const json = await res.json();
    if (!res.ok || json?.success === false) {
        throw new Error(json?.message || 'Failed to create on-ramp');
    }
    // Refresh history list
    revalidateTag('on-ramp');
    return json;
}

export default async function BankPage() {
    const session = await getServerSession(authOptions);
    const cookie = (await headers()).get('cookie') ?? '';
    const base = process.env.NEXT_PUBLIC_APP_URL ?? '';

    const res = await fetch(`${base}/api/ramptranc`, {
        method: 'GET',
        headers: { cookie },
        next: { tags: ['on-ramp'] }
    });
    const json = await res.json().catch(() => ({ success: false, data: [] }));
    const items = Array.isArray(json?.data) ? json.data : [];
    const failed = json?.success === false;

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold">Bank Transfer</h1>
                <p className="text-sm text-muted-foreground">Deposit money from your bank account.</p>
            </div>

            <div className="flex justify-around gap-6">
                <div className="flex-1 flex justify-center items-start">
                    <form className="bg-white rounded-md shadow p-4 w-full max-w-md space-y-3" action={async (formData: FormData) => {
                        'use server';
                        const amount = String(formData.get('amount') || '');
                        const bankName = String(formData.get('bankName') || '');
                        const accountNumber = String(formData.get('accountNumber') || '');
                        await createOnRamp(amount, bankName, accountNumber);
                    }}>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-700">Amount</label>
                            <input name="amount" type="number" min="1" step="1" className="border border-gray-300 rounded-md p-2" placeholder="Enter amount" required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-700">Bank name</label>
                            <input name="bankName" type="text" className="border border-gray-300 rounded-md p-2" placeholder="e.g. SBI" required />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-700">Account number</label>
                            <input name="accountNumber" type="text" className="border border-gray-300 rounded-md p-2" placeholder="Enter account number" required />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Deposit</button>
                    </form>
                </div>

                <div className="flex-1 h-full">
                    <OnRampHistory
                        data={items}
                        icon={<History className="h-5 w-5 text-gray-600" />}
                        failed={failed}
                        formatDateTime={formatDateTime}
                    />
                </div>
            </div>
        </div>
    );
}
