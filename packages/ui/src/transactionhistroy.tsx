"use client";

interface TransactionHistoryProps {
    icon: React.ReactNode;
    LoadingIcon: React.ReactNode;
    data?: HistoryItem[];
    formatDateTime: (date: Date) => string;
    failed?: boolean;
    loading?: boolean;
}

type TransactionType = 'CREDIT' | 'DEBIT' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'ON_RAMP' | string;
type EntryType = 'CREDIT' | 'DEBIT' | string;

interface HistoryItem {
    id: number | string;
    userId?: number | string;
    amount: string | number;
    transactionType: TransactionType;
    entryType?: EntryType;
    description?: string | null;
    createdAt?: string | Date;
}

const TransactionHistory = ({ LoadingIcon, icon, data = [], formatDateTime, failed, loading }: TransactionHistoryProps) => {
    const items = Array.isArray(data) ? data : [];
    return (
        <aside className="ui:w-full ui:h-full">
            <div className="ui:sticky ui:top-4 ui:rounded-xl ui:border ui:bg-white ui:p-5 ui:shadow-sm">
                <div className="ui:mb-3 ui:flex ui:items-center ui:gap-2">
                    {icon}
                    <h2 className="ui:text-sm ui:font-medium text-gray-600">Transaction History</h2>
                </div>

                {loading && (
                    <div className="ui:py-4 ui:text-center ui:min-h-[500px] ui:flex ui:items-center ui:justify-center">
                        {LoadingIcon}
                    </div>
                )}

                {!loading && items.length === 0 ? (
                    <div className="ui:rounded-md ui:border ui:border-dashed ui:p-6 ui:text-center">
                        <p className="ui:text-sm ui:text-gray-600">No transactions yet</p>
                        <p className="ui:mt-1 ui:text-xs ui:text-gray-500">Your recent transfers will appear here.</p>
                        {failed && (
                            <p className="ui:mt-3 ui:text-xs ui:text-red-600">Failed to load transaction history.</p>
                        )}
                    </div>
                ) : (
                    <div className="ui:mt-4 ui:max-h-[500px] ui:overflow-auto ui:pr-0 ui:-mr-5">
                        <ul className="ui:pr-5">
                            {items.map((item) => {
                                const entry = (item?.entryType || '').toString().toUpperCase();
                                const type = (item?.transactionType || '').toString().toUpperCase();
                                const inferredEntry: EntryType = entry === 'CREDIT' || entry === 'DEBIT'
                                    ? entry
                                    : (type === 'CREDIT' || type === 'TRANSFER_IN' || type === 'ON_RAMP') ? 'CREDIT' : 'DEBIT';
                                const isDebit = inferredEntry === 'DEBIT';
                                const typeLabel = type === 'CREDIT' ? 'Credit'
                                    : type === 'DEBIT' ? 'Debit'
                                        : type === 'TRANSFER_IN' ? 'Transfer In'
                                            : type === 'TRANSFER_OUT' ? 'Transfer Out'
                                                : type === 'ON_RAMP' ? 'On Ramp' : type === 'P2P_TRANSFER' ? 'P2P Transfer' : 'Transaction';
                                const dateStr = item?.createdAt ? formatDateTime(new Date(item.createdAt as any)) : '';
                                const signedAmount = `${isDebit ? '-' : '+'}${item?.amount}`;
                                return (
                                    <li key={item?.id} className="ui:py-2 ui:border-b ui:border-gray-200">
                                        <div className="ui:flex ui:justify-between ui:items-center">
                                            <div className="ui:flex ui:flex-col">
                                                <span className="ui:text-sm ui:font-medium ui:text-slate-800">{typeLabel}</span>
                                                <span className="ui:text-[11px] ui:text-gray-500">{dateStr}</span>
                                            </div>
                                            <span className={`ui:text-sm ui:font-medium ${isDebit ? 'ui:text-red-600' : 'ui:text-green-600'}`}>
                                                {signedAmount}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default TransactionHistory;