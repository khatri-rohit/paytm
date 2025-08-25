"use client";

import { useEffect, useState } from 'react';
import TransferForm from '@/components/Tranferform';

type OnRampTransaction = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    token: string;
    amount: string;
    proccesing: string;
};

export default function Transfer() {
    const [onRampTransaction, setOnRampTransaction] = useState<OnRampTransaction | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');
        const userId = searchParams.get('id');
        const bankId = searchParams.get('info');

        if (!token || !userId || !bankId) {
            setError('Invalid token');
            return;
        }

        const fetchTransaction = async () => {
            try {
                const response = await fetch(`/api/transaction?token=${token}&userId=${userId}&info=${bankId}`);
                const data = await response.json();
                console.log(data);
                if (data.success) {
                    setOnRampTransaction(data.data);
                } else {
                    setError(data.error || 'Failed to fetch transaction');
                }
            } catch (err) {
                console.error('Error fetching transaction:', err);
                setError('Error fetching transaction');
            }
        };

        fetchTransaction();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    if (error) {
        return <div>{error}</div>;
    }

    if (!onRampTransaction) {
        return <div>Loading...</div>;
    }

    return (
        <TransferForm onRampTransaction={onRampTransaction} />
    );
}
