"use client";

import { processpayment } from '@/lib/actions/processpayment';
import { useState } from 'react';

const TransferForm = ({ onRampTransaction }: { onRampTransaction: any; }) => {
    const [error, setError] = useState<string | null>(null);

    const makePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const success = await processpayment(onRampTransaction);
            if (success) {
                window.close();
                console.log(success);
            } else {
                setError('Problem processing payment\nPlease try again');
            }
        } catch (error) {
            const err = error as Error;
            console.error(err.message);
        }
    };

    return (
        <div>
            {error && <div className="text-red-500 text-2xl">{error}</div>}
            <form onSubmit={makePayment}>
                <input type="text" name="amount" placeholder="Enter Amount" value={onRampTransaction.amount} />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Pay
                </button>
            </form>
        </div>
    );
};

export default TransferForm;