"use client";

import { processpayment } from '@/lib/actions/processpayment';
import { useState } from 'react';

const TransferForm = ({ amount, onRampTransactionId }: { amount: string, onRampTransactionId: number; }) => {
    const [error, setError] = useState<string | null>(null);

    const makePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await processpayment(amount, onRampTransactionId);
        if (success) {
            window.close();
        } else {
            setError('Problem processing payment\nPlease try again');
        }
    };

    return (
        <div>
            {error && <div className="text-red-500 text-2xl">{error}</div>}
            <form onSubmit={makePayment}>
                <input type="text" name="amount" placeholder="Enter Amount" value={amount} />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Pay
                </button>
            </form>
        </div>
    );
};

export default TransferForm;