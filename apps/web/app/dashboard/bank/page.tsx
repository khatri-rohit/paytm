"use client";

import { Circle, History, RefreshCcw } from 'lucide-react';
import OnRampHistory from '@repo/ui/onramphistory';
import BankForm from '@/components/BankForm';
import { useGetBankHistoryQuery } from '@repo/store';
import { formatDateTime } from '@/lib/getFormatTimeFormat';

export default function BankPage() {
    // const session = await getServerSession(authOptions);
    // const cookie = (await headers()).get('cookie') ?? '';
    // const base = process.env.NEXT_PUBLIC_APP_URL ?? '';

    const { data, isLoading, isError, refetch, isFetching } = useGetBankHistoryQuery(null);
    console.log("Bank History:", data);

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold">Bank Transfer</h1>
                <p className="text-sm text-muted-foreground">
                    Send money from your bank account.
                </p>
            </div>

            <div className="flex justify-around gap-6">
                <div className="flex-1 flex justify-center items-start">
                    <BankForm />
                </div>

                <div className="flex-1 h-full">
                    <OnRampHistory
                        refresh={refetch}
                        data={data?.data as any}
                        refreshIcon={<RefreshCcw className='h-3 w-3 text-gray-600' />}
                        icon={<History className="h-5 w-5 text-gray-600" />}
                        failed={isError}
                        formatDateTime={formatDateTime}
                        isLoading={isLoading}
                        isFetching={isFetching}
                        LoadingIcon={<Circle className='animate-spin h-10 w-10 text-gray-600' />}
                    />
                </div>
            </div>
        </div>
    );
}
