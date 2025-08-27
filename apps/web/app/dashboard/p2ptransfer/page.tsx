
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import P2PTransferForm from '@repo/ui/p2ptranfer-form';

const P2PTransfer = () => {

    const session = useSession();
    const [error, setError] = useState<string | null>(null);

    const transferMoney = async (formData: FormData) => {
        if (!session) {
            setError('You must be logged in to perform this action.');
            return;
        }
        const amount = formData.get('amount');
        const number = formData.get('number');
        const password = formData.get('password');
        console.log(amount, number, password);

        const response = await fetch('http://localhost:3000/api/bank/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                number: number,
                password: password
            })
        });
        const result = await response.json();
        console.log(result);
        // Perform the money transfer logic here
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">P2P Transfer Page</h1>
            <p>This is the P2P Transfer page.</p>
            {error && <p className="text-red-500">{error}</p>}
            <P2PTransferForm transferFn={transferMoney} />
        </div>
    );
};

export default P2PTransfer;