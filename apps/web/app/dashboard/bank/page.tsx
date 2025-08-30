"use server";

import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { History, RefreshCcw } from 'lucide-react';
import { formatDateTime } from '@/lib/getFormatTimeFormat';
import { fetchOnRampHistory } from '../../lib/getOnRampTransaction';
import OnRampHistory from '@repo/ui/onramphistory';
import BankForm from '@/components/BankForm';

export default async function BankPage() {
    // const session = await getServerSession(authOptions);
    // const cookie = (await headers()).get('cookie') ?? '';
    // const base = process.env.NEXT_PUBLIC_APP_URL ?? '';

    const items = await fetchOnRampHistory();
    const failed = items.length === 0;

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                <h1 className="text-xl font-semibold">Bank Transfer</h1>
                <p className="text-sm text-muted-foreground">Deposit money from your bank account.</p>
            </div>

            <div className="flex justify-around gap-6">
                <div className="flex-1 flex justify-center items-start">
                    <BankForm />
                </div>

                <div className="flex-1 h-full">
                    <OnRampHistory
                        refresh={fetchOnRampHistory}
                        data={items}
                        refreshIcon={<RefreshCcw className='h-3 w-3 text-gray-600' />}
                        icon={<History className="h-5 w-5 text-gray-600" />}
                        failed={failed}
                        formatDateTime={formatDateTime}
                    />
                </div>
            </div>
        </div>
    );
}
