"use client";

import { authOptions } from '@/app/lib/auth';
import P2PTransation from '@/components/P2PTransation';
import P2PHistory from "@repo/ui/p2phistory";
import { Circle, History, RefreshCcw, Send } from 'lucide-react';
import { formatDateTime } from '@/lib/getFormatTimeFormat';
import { useSession } from 'next-auth/react';
import { useGetP2PHistoryQuery } from '@repo/store';

const P2PTransfer = () => {
    const session = useSession();
    const { data, isLoading, isError, refetch, isFetching } = useGetP2PHistoryQuery(null);

    return (
        <div>
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-white">Send Money</h2>
                        <p className="text-xs sm:text-sm text-zinc-400">Transfers are instant and secure</p>
                    </div>
                </div>
            </div>

            {/* Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 h-full">
                {/* Transfer Form */}
                <div className="order-2 lg:order-1 flex justify-center items-start">
                    <div className="w-full max-w-md">
                        <P2PTransation />
                    </div>
                </div>

                {/* History Section */}
                <div className="order-1 lg:order-2 min-h-[400px] sm:min-h-[500px]">
                    <P2PHistory
                        data={data?.data as any}
                        icon={<History className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />}
                        failed={isError}
                        userId={session.data?.user.id as string}
                        formatDateTime={formatDateTime}
                        refreshIcon={<RefreshCcw className='h-3 w-3 text-gray-600' />}
                        refresh={refetch}
                        isLoading={isLoading}
                        isFetching={isFetching}
                        LoadingIcon={<Circle className='animate-spin h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-gray-600' />}
                    />
                </div>
            </div>
        </div>
    );
};

export default P2PTransfer;