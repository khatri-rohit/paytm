"use client";

import { authOptions } from '@/app/lib/auth';
import P2PTransation from '@/components/P2PTransation';
import P2PHistory from "@repo/ui/p2phistory";
import { Circle, History, RefreshCcw } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { formatDateTime } from '@/lib/getFormatTimeFormat';
import { useSession } from 'next-auth/react';
import { useGetP2PHistoryQuery } from '@repo/store';

const P2PTransfer = () => {
    const session = useSession();
    // Fetch P2P history using the new RTK Query hook
    const { data, isLoading, isError, refetch, isFetching } = useGetP2PHistoryQuery(null);
    console.log("P2P History:", data);

    // const session = await getServerSession(authOptions);
    // const cookie = (await headers()).get('cookie') ?? '';
    // const base = process.env.NEXT_PUBLIC_APP_URL ?? '';
    // const response = await fetch(`${base}/api/p2ptransaction`, {
    //     method: "GET",
    //     headers: { cookie },
    //     next: { tags: ['p2p-transfer'] }
    // });

    // const data = await response.json().catch(() => ({ success: false, data: [] }));
    // console.log(data);
    // change schema to categories data into debit and credit for UI histroy

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold">P2P Transfer</h1>
                <p className="text-sm text-muted-foreground">Send money securely to a contact or UPI ID.</p>
            </div>

            <div className="flex items-start justify-around gap-6">
                <div className="flex-1 flex justify-center items-center">
                    <P2PTransation />
                </div>

                {/* Right: History placeholder */}
                <div className="flex-1">
                    <P2PHistory data={data?.data as any}
                        icon={<History className="h-5 w-5 text-gray-600" />}
                        failed={isError}
                        userId={session.data?.user.id as string}
                        formatDateTime={formatDateTime}
                        refreshIcon={<RefreshCcw className='h-3 w-3 text-gray-600' />}
                        refresh={refetch}
                        isLoading={isLoading}
                        isFetching={isFetching}
                        LoadingIcon={<Circle className='animate-spin h-10 w-10 text-gray-600' />} />
                </div>
            </div>
        </div>
    );
};

export default P2PTransfer;