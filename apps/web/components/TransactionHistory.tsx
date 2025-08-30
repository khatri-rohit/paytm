"use client";

import TransactionHistory from '@repo/ui/transactionhistroy';
import { Circle, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/getFormatTimeFormat';


const ShowTransactionHistory = () => {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? '';
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const getTransactionHistory = async () => {
        setLoading(true);
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
        setLoading(false);
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
            loading={loading}
            LoadingIcon={<Circle className='animate-spin h-10 w-10 text-gray-600' />}
        />
    );
};

export default ShowTransactionHistory;