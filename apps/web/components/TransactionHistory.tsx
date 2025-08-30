"use client";

import TransactionHistory from '@repo/ui/transactionhistroy';
import { History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/getFormatTimeFormat';


const ShowTransactionHistory = () => {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? '';
    const [transactionHistory, setTransactionHistory] = useState([]);

    const getTransactionHistory = async () => {
        const response = await fetch(`${base}/api/transaction-history`, {
            method: "GET",
            headers: {

            },
        });

        const data = await response.json().catch(() => ({ success: false, data: [] }));
        console.log(data);

        if (data.success) {
            setTransactionHistory(data.data);
        }
    };

    useEffect(() => {
        getTransactionHistory();
    }, []);

    return (
        <TransactionHistory
            icon={<History className="h-5 w-5 text-gray-600" />}
            data={transactionHistory}
            formatDateTime={formatDateTime}
            failed={false}
        />
    );
};

export default ShowTransactionHistory;