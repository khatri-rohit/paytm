"use server";

import { authOptions } from '@/app/lib/auth';
import P2PTransation from '@/components/P2PTransation';
import P2PHistory from "@repo/ui/p2phistory";
import { History } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { formatDateTime } from '@/lib/getFormatTimeFormat';

const P2PTransfer = async () => {
    const session = await getServerSession(authOptions);
    const cookie = (await headers()).get('cookie') ?? '';
    const base = process.env.NEXT_PUBLIC_APP_URL ?? '';
    const response = await fetch(`${base}/api/p2ptransaction`, {
        method: "GET",
        headers: { cookie },
        next: { tags: ['p2p-transfer'] }
    });

    const data = await response.json().catch(() => ({ success: false, data: [] }));
    // console.log(data);
    // change schema to categories data into debit and credit for UI histroy

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold">P2P Transfer</h1>
                <p className="text-sm text-muted-foreground">Send money securely to a contact or UPI ID.</p>
            </div>

            <div className="flex justify-around gap-6">
                <div className="flex-1 flex justify-center items-center">
                    <P2PTransation />
                </div>

                {/* Right: History placeholder */}
                <div className="flex-1 h-full">
                    <P2PHistory data={data?.data}
                        icon={<History className="h-5 w-5 text-gray-600" />}
                        failed={data.success === false}
                        userId={session?.user.id as string}
                        formatDateTime={formatDateTime} />
                </div>
            </div>
        </div>
    );
};

export default P2PTransfer;