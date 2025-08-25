"use client";

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const NewUser = () => {
    const session = getSession();
    const router = useRouter();

    const [amount, setAmount] = useState(0);
    const [bankName, setBankName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = await session;

        if (amount <= 0 || bankName.length === 0) {
            return;
        }
        try {
            const res = await fetch('http://localhost:5500/api/bank/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user?.user.id,
                    amount: amount,
                    bankName: bankName
                })
            });
            const result = await res.json();
            if (result.success) {
                router.push('/dashboard');
            } else {
                alert(`Error is creating account.\n${JSON.stringify(result)}`);
                throw new Error(result);
            }

        } catch (error) {
            const err = error as Error;
            console.log(err.message);
        }
    };

    return (
        <div>
            <form className='bg-blue-500 text-white p-4 rounded-md' onSubmit={handleSubmit}>
                <input type="text" name="amount" placeholder="amount" value={amount} onChange={(e) => {
                    setAmount(parseInt(e.target.value));
                }} />
                <input type="text" name="bankName" placeholder="Bank Name" className='border border-gray-300 rounded-md p-2 w-40'
                    value={bankName} onChange={(e) => {
                        setBankName(e.target.value);
                    }} />
                <button type="submit" className='bg-blue-500 text-white py-2 px-4 rounded-md'>
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default NewUser;