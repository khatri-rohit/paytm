'use client';

import { useSession } from 'next-auth/react';

const BankForm = () => {
    const { data: session } = useSession();

    async function submitOnRamp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const amount = String(formData.get('amount') || '');
        const bankName = String(formData.get('bankName') || '');
        const accountNumber = String(formData.get('accountNumber') || '');
        console.log(amount, bankName, accountNumber);
        if (!amount || !bankName || !accountNumber) {
            throw new Error('All fields are required');
        }

        const base = process.env.NEXT_PUBLIC_APP_URL ?? '';
        const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

        if (!session?.user?.id) throw new Error('Unauthorized');

        const body = {
            userId: session.user.id,
            bankId: Number(accountNumber),
            token,
            amount
        };

        const res = await fetch(`${base}/api/ramptranc`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', },
            body: JSON.stringify(body),
            next: { tags: ['on-ramp'] }
        });
        const result = await res.json();
        console.log(result);

        if (result.success && result.transaction?.id) {
            window.open(`http://localhost:3001/transfer?token=${token}&id=${result.transaction.id}&info=${accountNumber || ''}`, '_blank', 'noopener noreferrer height=800,width=800');
        }

        if (!res.ok || result?.success === false) {
            console.log("Failed to create on-ramp");
            console.log(result?.message || 'Failed to create on-ramp');
            alert(result?.message || 'Failed to create on-ramp');
        }
    }

    return (
        <form className="bg-white rounded-md shadow p-4 w-full max-w-md space-y-3" onSubmit={submitOnRamp}>
            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Amount</label>
                <input name="amount" type="number" min="1" step="1" className="text-black  border border-gray-300 rounded-md p-2" placeholder="Enter amount" required />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Bank name</label>
                <input name="bankName" type="text" className="text-black border border-gray-300 rounded-md p-2" placeholder="e.g. SBI" required />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Account number</label>
                <input name="accountNumber" type="text" className="text-black border border-gray-300 rounded-md p-2" placeholder="Enter account number" required />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Deposit</button>
        </form>
    );
};

export default BankForm;