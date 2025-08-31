import * as React from 'react';

interface P2PItem {
    id: number | string;
    amount: string | number;
    timestamp?: string | Date;
    fromUserId?: number | string;
    senderName?: string | null;
    receiverName?: string | null;
    status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | string;
}

interface P2PHistoryProps {
    icon: React.ReactNode;
    data: P2PItem[];
    userId: string | number;
    formatDateTime: (date: Date) => string;
    failed: boolean;
    refresh: () => void;
    refreshIcon: React.ReactNode;
    isLoading: boolean;
    isFetching: boolean;
    LoadingIcon: React.ReactNode;
}

const P2PHistory = ({ icon, data = [], userId, formatDateTime, failed, refresh, refreshIcon, isLoading, isFetching, LoadingIcon }: P2PHistoryProps) => {
    const items = Array.isArray(data) ? data : [];

    return (
        <aside className="ui:w-full ui:h-full">
            <div className="ui:sticky ui:top-4 ui:rounded-xl ui:border ui:bg-white ui:p-5 ui:shadow-sm">
                <div className="ui:mb-3 ui:flex ui:items-center ui:justify-between ui:gap-2">
                    <div className='ui:flex ui:items-center ui:gap-2'>
                        {icon}
                        <h2 className="ui:text-sm ui:font-medium text-gray-600">Transfers</h2>
                    </div>
                    <div>
                        <button onClick={refresh} className={`ui:p-1 ui:rounded-md ui:bg-gray-100 ui:hover:bg-gray-200 ui:cursor-pointer ${isFetching ? 'ui:animate-spin' : ''}`} aria-label="Refresh transfers" title='Refresh'>
                            {refreshIcon}
                        </button>
                    </div>
                </div>

                {isLoading && (
                    <div className="ui:py-4 ui:text-center ui:min-h-[500px] ui:flex ui:items-center ui:justify-center">
                        {LoadingIcon}
                    </div>
                )}

                {!isLoading && items.length === 0 ? (
                    <div className="ui:rounded-md ui:border ui:border-dashed ui:p-6 ui:text-center">
                        <p className="ui:text-sm ui:text-gray-600">No transactions yet</p>
                        <p className="ui:mt-1 ui:text-xs ui:text-gray-500">Your recent transfers will appear here.</p>
                        {failed && (
                            <p className="ui:mt-3 ui:text-xs ui:text-red-600">Failed to load transaction history.</p>
                        )}
                    </div>
                ) : (
                    <ul className="ui:mt-4 ui:min-h-[500px] ui:overflow-auto ui:pr-0">
                        {items.map((item) => {
                            const isDebit = String(item?.fromUserId) === String(userId);
                            const label = isDebit ? 'Debit' : 'Credit';
                            const name = isDebit ? item?.receiverName : item?.senderName;
                            const title = name || label;
                            const dateStr = item?.timestamp ? formatDateTime(new Date(item.timestamp)) : '';
                            const signedAmount = `${isDebit ? '-' : '+'}${item?.amount}`;
                            const status = (item?.status || '').toString().toUpperCase();
                            const statusLabel = status === 'COMPLETED' ? 'Completed' : status === 'FAILED' ? 'Failed' : status === 'PENDING' ? 'Pending' : status === 'CANCELLED' ? 'Cancelled' : '';
                            const statusClass = status === 'COMPLETED'
                                ? 'ui:border-green-200 ui:bg-green-50 ui:text-green-700'
                                : status === 'FAILED'
                                    ? 'ui:border-red-200 ui:bg-red-50 ui:text-red-700'
                                    : status === 'PENDING'
                                        ? 'ui:border-amber-200 ui:bg-amber-50 ui:text-amber-700'
                                        : 'ui:border-slate-200 ui:bg-slate-50 ui:text-slate-700';
                            return (
                                <li key={item?.id} className="ui:py-2 ui:border-b ui:border-gray-200">
                                    <div className="ui:flex ui:justify-between ui:items-center">
                                        <div className="ui:flex ui:flex-col">
                                            <span className="ui:text-sm ui:font-medium ui:text-slate-800">{title}</span>
                                            <span className="ui:text-xs ui:text-gray-500">{dateStr}</span>
                                        </div>
                                        <div className="ui:flex ui:items-center ui:gap-2">
                                            <span className={`ui:text-sm ui:font-medium ${status === 'PENDING'
                                                ? 'ui:text-amber-600'
                                                : status === 'COMPLETED' && !isDebit
                                                    ? 'ui:text-green-600'
                                                    : 'ui:text-red-600'
                                                }`}>
                                                {(status === 'FAILED') && '⚠️'} {signedAmount}
                                            </span>
                                            {statusLabel && (
                                                <span className={`ui:inline-flex ui:items-center ui:rounded-full ui:border ui:px-2 ui:py-0.5 ui:text-[10px] ${statusClass}`}>
                                                    {statusLabel}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </aside>
    );
};

export default P2PHistory;
