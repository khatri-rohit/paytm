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
    currencySymbol?: string;
}

const P2PHistory = ({
    icon,
    data = [],
    userId,
    formatDateTime,
    failed,
    refresh,
    refreshIcon,
    isLoading,
    isFetching,
    LoadingIcon,
    currencySymbol = '₹'
}: P2PHistoryProps) => {
    const items = Array.isArray(data) ? data : [];

    const debit = items.reduce((acc, item) =>
        String(item?.fromUserId) === String(userId) ? acc + Number(item.amount) : acc, 0
    );
    const credit = items.reduce((acc, item) =>
        String(item?.fromUserId) !== String(userId) ? acc + Number(item.amount) : acc, 0
    );

    function formatAmount(amount: string) {
        const [intPart, decimalPart] = amount.toString().split('.');
        const intWithCommas = intPart?.split('').reverse().reduce((acc: any, digit: any, index: any) => {
            if (index > 0 && index % 3 === 0) {
                acc.push(',');
            }
            acc.push(digit);
            return acc;
        }, []).reverse().join('');

        return decimalPart ? `${intWithCommas}.${decimalPart}` : intWithCommas;
    }

    const getStatusStyles = (status: string) => {
        const upperStatus = status.toUpperCase();
        switch (upperStatus) {
            case 'COMPLETED':
                return 'ui:border-green-200 ui:bg-green-50 ui:text-green-700 dark:ui:border-green-800 dark:ui:bg-green-950/30 dark:ui:text-green-400';
            case 'FAILED':
                return 'ui:border-red-200 ui:bg-red-50 ui:text-red-700 dark:ui:border-red-800 dark:ui:bg-red-950/30 dark:ui:text-red-400';
            case 'PENDING':
                return 'ui:border-amber-200 ui:bg-amber-50 ui:text-amber-700 dark:ui:border-amber-800 dark:ui:bg-amber-950/30 dark:ui:text-amber-400';
            case 'CANCELLED':
                return 'ui:border-gray-200 ui:bg-gray-50 ui:text-gray-700 dark:ui:border-gray-600 dark:ui:bg-gray-800/50 dark:ui:text-gray-400';
            default:
                return 'ui:border-slate-200 ui:bg-slate-50 ui:text-slate-700 dark:ui:border-slate-600 dark:ui:bg-slate-800/50 dark:ui:text-slate-400';
        }
    };

    const getAmountColor = (status: string, isDebit: boolean) => {
        const upperStatus = status.toUpperCase();
        if (upperStatus === 'FAILED') return 'ui:text-red-600 dark:ui:text-red-400';
        if (upperStatus === 'PENDING') return 'ui:text-amber-600 dark:ui:text-amber-400';
        return isDebit ? 'ui:text-red-600 dark:ui:text-red-400' : 'ui:text-green-600 dark:ui:text-green-400';
    };

    return (
        <aside className="ui:w-full ui:bg-white dark:ui:bg-slate-900/90 ui:border dark:ui:border-slate-700 ui:rounded-xl ui:backdrop-blur-sm">
            <div className="ui:sticky ui:top-4 ui:p-3 sm:ui:p-4 lg:ui:p-5 ui:shadow-sm ui:flex ui:flex-col ui:h-full">
                {/* Header - Responsive */}
                <div className="ui:mb-3 ui:flex ui:items-center ui:justify-between ui:gap-2">
                    <div className='ui:flex ui:items-center ui:gap-2 ui:min-w-0'>
                        <div className="ui:flex-shrink-0">
                            {icon}
                        </div>
                        <h2 className="ui:text-sm sm:ui:text-base ui:font-medium ui:text-gray-600 dark:ui:text-gray-300 ui:truncate">
                            <span className="sm:ui:hidden">P2P</span>
                            <span className="ui:hidden sm:ui:inline">P2P Transfers</span>
                        </h2>
                    </div>
                    <button
                        onClick={refresh}
                        className='ui:p-1.5 sm:ui:p-2 ui:rounded-md ui:bg-gray-100 dark:ui:bg-gray-800 ui:hover:bg-gray-200 dark:ui:hover:bg-gray-700 ui:cursor-pointer ui:transition-colors ui:flex-shrink-0'
                        aria-label="Refresh transfers"
                        title='Refresh'
                    >
                        <span className={`ui:block ${isFetching ? 'ui:animate-spin' : ''}`}>
                            {refreshIcon}
                        </span>
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="ui:h-full ui:text-center ui:flex ui:items-center ui:justify-center ui:min-h-[200px] sm:ui:min-h-[300px]">
                        <div className="ui:flex ui:flex-col ui:items-center ui:gap-3">
                            {LoadingIcon}
                            <span className="ui:text-sm ui:text-gray-500 dark:ui:text-gray-400">Loading transactions...</span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && items.length === 0 ? (
                    <div className="ui:h-full ui:rounded-md ui:border ui:border-dashed ui:border-gray-300 dark:ui:border-gray-600 ui:p-4 sm:ui:p-6 ui:text-center ui:flex ui:flex-col ui:items-center ui:justify-center ui:min-h-[200px]">
                        <div className="ui:space-y-2">
                            <p className="ui:text-sm sm:ui:text-base ui:text-gray-600 dark:ui:text-gray-300">No transactions yet</p>
                            <p className="ui:text-xs sm:ui:text-sm ui:text-gray-500 dark:ui:text-gray-400">Your recent transfers will appear here.</p>
                            {failed && (
                                <p className="ui:mt-3 ui:text-xs sm:ui:text-sm ui:text-red-600 dark:ui:text-red-400">
                                    Failed to load transaction history.
                                </p>
                            )}
                        </div>
                    </div>
                ) : !isLoading && items.length > 0 ? (
                    <div className="ui:flex ui:flex-col ui:h-full ui:min-h-0">
                        {/* Transaction List */}
                        <div className="ui:flex-1 ui:min-h-0 ui:max-h-[300px] sm:ui:max-h-[400px] lg:ui:max-h-[500px] ui:overflow-auto ui:pr-1 ui:space-y-1">
                            {items.map((item) => {
                                const isDebit = String(item?.fromUserId) === String(userId);
                                const label = isDebit ? 'Debit' : 'Credit';
                                const name = isDebit ? item?.receiverName : item?.senderName;
                                const title = name || label;
                                const dateStr = item?.timestamp ? formatDateTime(new Date(item.timestamp)) : '';
                                const signedAmount = `${isDebit ? '-' : '+'}${item?.amount}`;
                                const status = (item?.status || '').toString().toUpperCase();
                                const statusLabel = status === 'COMPLETED' ? 'Completed'
                                    : status === 'FAILED' ? 'Failed'
                                        : status === 'PENDING' ? 'Pending'
                                            : status === 'CANCELLED' ? 'Cancelled' : '';
                                const statusClass = getStatusStyles(status);
                                const amountColor = getAmountColor(status, isDebit);

                                return (
                                    <div key={item?.id} className="ui:py-3 ui:border-b ui:border-gray-200 dark:ui:border-gray-700 ui:last:border-b-0">
                                        <div className="ui:flex ui:justify-between ui:items-start ui:gap-3">
                                            {/* Left Content */}
                                            <div className="ui:flex ui:flex-col ui:min-w-0 ui:flex-1 ui:space-y-1">
                                                <div className="ui:flex ui:items-start ui:justify-between ui:gap-2">
                                                    <span className="ui:text-sm sm:ui:text-base ui:font-medium ui:text-slate-800 dark:ui:text-slate-200 ui:truncate">
                                                        {title}
                                                    </span>
                                                    {/* Mobile: Show amount here */}
                                                    <div className="ui:flex sm:ui:hidden ui:items-center ui:gap-2 ui:flex-shrink-0">
                                                        <span className={`ui:text-sm ui:font-medium ${amountColor}`}>
                                                            {status === 'FAILED' && '⚠️ '}{signedAmount}
                                                        </span>
                                                        {statusLabel && (
                                                            <span className={`ui:inline-flex ui:items-center ui:rounded-full ui:border ui:px-1.5 ui:py-0.5 ui:text-[9px] ${statusClass}`}>
                                                                {statusLabel}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="ui:text-xs ui:text-gray-500 dark:ui:text-gray-400">
                                                    {dateStr}
                                                </span>
                                            </div>

                                            {/* Desktop: Amount and Status */}
                                            <div className="ui:hidden sm:ui:flex ui:items-center ui:gap-2 ui:flex-shrink-0">
                                                <span className={`ui:text-sm sm:ui:text-base ui:font-medium ${amountColor}`}>
                                                    {status === 'FAILED' && '⚠️ '}{signedAmount}
                                                </span>
                                                {statusLabel && (
                                                    <span className={`ui:inline-flex ui:items-center ui:rounded-full ui:border ui:px-2 ui:py-0.5 ui:text-[10px] sm:ui:text-xs ${statusClass}`}>
                                                        {statusLabel}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary - Responsive */}
                        <div className="ui:mt-4 ui:rounded-md ui:border ui:border-dashed ui:border-gray-300 dark:ui:border-gray-600 ui:p-3 sm:ui:p-4 ui:text-center ui:bg-gray-50/50 dark:ui:bg-gray-800/50 ui:flex-shrink-0">
                            <div className="ui:flex ui:flex-col sm:ui:flex-row ui:items-center ui:justify-center ui:gap-3 sm:ui:gap-6">
                                <div className="ui:flex ui:items-center ui:gap-2">
                                    <span className="ui:text-sm sm:ui:text-base ui:font-medium ui:text-slate-800 dark:ui:text-slate-200">
                                        Debit:
                                    </span>
                                    <span className="ui:text-sm sm:ui:text-base ui:font-semibold ui:text-red-600 dark:ui:text-red-400">
                                        {currencySymbol} {formatAmount(debit.toString())}
                                    </span>
                                </div>
                                <div className="ui:flex ui:items-center ui:gap-2">
                                    <span className="ui:text-sm sm:ui:text-base ui:font-medium ui:text-slate-800 dark:ui:text-slate-200">
                                        Credit:
                                    </span>
                                    <span className="ui:text-sm sm:ui:text-base ui:font-semibold ui:text-green-600 dark:ui:text-green-400">
                                        {currencySymbol} {formatAmount(credit.toString())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </aside>
    );
};

export default P2PHistory;