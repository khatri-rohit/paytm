"use client";

import TransactionHistory from '@repo/ui/transactionhistroy';
import { Circle, History, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/getFormatTimeFormat';
import { useGetTransactionHistoryQuery } from '@repo/store';


const ShowTransactionHistory = () => {
    // const base = process.env.NEXT_PUBLIC_APP_URL ?? '';
    // const [transactionHistory, setTransactionHistory] = useState([]);
    // const [loading, setLoading] = useState(true);
    const { data, isFetching, isError, refetch } = useGetTransactionHistoryQuery(null);
    console.log("Transaction History:", data);

    // const getTransactionHistory = async () => {
    //     setLoading(true);
    //     // const response = await fetch(`${base}/api/transaction-history`, {
    //     //     method: "GET",
    //     //     headers: {

    //     //     },
    //     // });

    //     const data = await response.json().catch(() => ({ success: false, data: [] }));
    //     console.log(data);

    //     if (data.success) {
    //         setTransactionHistory(data.data);
    //     }
    //     setLoading(false);
    // };

    // useEffect(() => {
    //     getTransactionHistory();
    // }, []);

    return (
        <TransactionHistory
            currencySymbol='₹'
            icon={<History className="h-5 w-5 text-gray-600" />}
            data={data?.data as any}
            refresh={refetch}
            refreshIcon={<RefreshCcw className='h-3 w-3 text-gray-600' />}
            formatDateTime={formatDateTime}
            failed={isError}
            loading={isFetching}
            LoadingIcon={<Circle className='animate-spin h-10 w-10 text-gray-600' />}
        />
    );
};

export default ShowTransactionHistory;