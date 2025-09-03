"use client";

import { Building2, Circle, History, RefreshCcw } from 'lucide-react';
import OnRampHistory from '@repo/ui/onramphistory';
import BankForm from '@/components/BankForm';
import { useGetBankHistoryQuery } from '@repo/store';
import { formatDateTime } from '@/lib/getFormatTimeFormat';

export default function BankPage() {
    const { data, isLoading, isError, refetch, isFetching } = useGetBankHistoryQuery(null);

    return (
        <div className="">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-white">Bank Transfer</h2>
                        <p className="text-xs sm:text-sm text-zinc-400">Deposit funds to your wallet</p>
                    </div>
                </div>
            </div>

            {/* Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 h-full">
                {/* Bank Form */}
                <div className="order-2 lg:order-1 flex justify-center items-start">
                    <div className="w-full max-w-md">
                        <BankForm />
                    </div>
                </div>

                {/* History Section */}
                <div className="order-1 lg:order-2 min-h-[400px] sm:min-h-[500px]">
                    <div className="h-full">
                        <OnRampHistory
                            refresh={refetch}
                            data={data?.data as any}
                            refreshIcon={<RefreshCcw className='h-3 w-3 text-gray-600' />}
                            icon={<History className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />}
                            failed={isError}
                            formatDateTime={formatDateTime}
                            isLoading={isLoading}
                            isFetching={isFetching}
                            LoadingIcon={<Circle className='animate-spin h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-gray-600' />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}