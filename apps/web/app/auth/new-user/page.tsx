"use client";

import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const NewUser = () => {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();

    const [amount, setAmount] = useState(0);
    const [bankName, setBankName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            throw new Error('User is not logged in');
        }

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
                    userId: session.user.id,
                    amount: amount,
                    bankName: bankName,
                    isNewUser: false
                })
            });

            const result = await res.json();
            if (result.success) {
                await updateSession({ isNewUser: false });
                router.push('/dashboard');
            } else {
                alert(`Error is creating account.\n${JSON.stringify(result)}`);
                throw new Error(result);
            }

        } catch (error) {
            const err = error as Error;
            console.log(err.message);
            throw new Error(err.message);
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