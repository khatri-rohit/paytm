"use client";

interface TransactionHistoryProps {
    icon: React.ReactNode;
    LoadingIcon: React.ReactNode;
    refreshIcon: React.ReactNode;
    data: HistoryItem[];
    formatDateTime: (date: Date) => string;
    failed: boolean;
    loading: boolean;
    refresh: () => void;
    currencySymbol: string;
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

const TransactionHistory = ({
    currencySymbol = '₹',
    LoadingIcon,
    icon,
    data = [],
    formatDateTime,
    failed,
    loading,
    refresh,
    refreshIcon
}: TransactionHistoryProps) => {
    const items = Array.isArray(data) ? data : [];

    const debit = items.reduce((acc, item) =>
        (item.entryType === 'DEBIT' ? acc + Number(item.amount) : acc), 0
    );
    const credit = items.reduce((acc, item) =>
        (item.entryType === 'CREDIT' ? acc + Number(item.amount) : acc), 0
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

    const getTypeLabel = (type: string) => {
        const upperType = type.toUpperCase();
        switch (upperType) {
            case 'CREDIT': return 'Credit';
            case 'DEBIT': return 'Debit';
            case 'TRANSFER_IN': return 'Transfer In';
            case 'TRANSFER_OUT': return 'Transfer Out';
            case 'ON_RAMP': return 'On Ramp';
            case 'P2P_TRANSFER': return 'P2P Transfer';
            default: return 'Transaction';
        }
    };

    const getTypeIcon = (type: string, isDebit: boolean) => {
        const upperType = type.toUpperCase();
        if (upperType.includes('TRANSFER') || upperType.includes('P2P')) {
            return isDebit ? '↗️' : '↙️';
        }
        return isDebit ? '📤' : '📥';
    };

    return (
        <aside className="ui:w-full ui:h-full">
            <div className="ui:sticky ui:top-4 ui:rounded-xl ui:border ui:bg-white dark:ui:bg-slate-900/90 dark:ui:border-slate-700 ui:p-3 sm:ui:p-4 lg:ui:p-5 ui:shadow-sm ui:backdrop-blur-sm">
                {/* Header - Responsive */}
                <div className="ui:mb-3 ui:flex ui:items-center ui:justify-between ui:gap-2">
                    <div className='ui:flex ui:items-center ui:gap-2 ui:min-w-0'>
                        <div className="ui:flex-shrink-0">
                            {icon}
                        </div>
                        <h2 className="ui:text-sm sm:ui:text-base ui:font-medium ui:text-gray-600 dark:ui:text-gray-300 ui:truncate">
                            <span className="sm:ui:hidden">History</span>
                            <span className="ui:hidden sm:ui:inline">Transaction History</span>
                        </h2>
                    </div>
                    <button
                        onClick={refresh}
                        className='ui:p-1.5 sm:ui:p-2 ui:rounded-md ui:bg-gray-100 dark:ui:bg-gray-800 ui:hover:bg-gray-200 dark:ui:hover:bg-gray-700 ui:cursor-pointer ui:transition-colors ui:flex-shrink-0'
                        aria-label="Refresh transfers"
                        title='Refresh'
                    >
                        <span className={`ui:block ${loading ? 'ui:animate-spin' : ''}`}>
                            {refreshIcon}
                        </span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="ui:py-8 sm:ui:py-12 ui:text-center ui:min-h-[300px] sm:ui:min-h-[400px] lg:ui:min-h-[500px] ui:flex ui:items-center ui:justify-center">
                        <div className="ui:flex ui:flex-col ui:items-center ui:gap-3">
                            {LoadingIcon}
                            <span className="ui:text-sm ui:text-gray-500 dark:ui:text-gray-400">Loading transactions...</span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && items.length === 0 ? (
                    <div className="ui:rounded-md ui:border ui:border-dashed ui:border-gray-300 dark:ui:border-gray-600 ui:p-4 sm:ui:p-6 ui:text-center">
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
                ) : !loading && items.length > 0 ? (
                    <>
                        {/* Transaction List - Responsive */}
                        <div className="ui:mt-4 ui:max-h-[300px] sm:ui:max-h-[350px] lg:ui:max-h-[450px] ui:overflow-auto ui:pr-1 ui:space-y-1">
                            {items.map((item) => {
                                const entry = (item?.entryType || '').toString().toUpperCase();
                                const type = (item?.transactionType || '').toString().toUpperCase();
                                const inferredEntry: EntryType = entry === 'CREDIT' || entry === 'DEBIT'
                                    ? entry
                                    : (type === 'CREDIT' || type === 'TRANSFER_IN' || type === 'ON_RAMP') ? 'CREDIT' : 'DEBIT';
                                const isDebit = inferredEntry === 'DEBIT';
                                const typeLabel = getTypeLabel(type);
                                const typeIcon = getTypeIcon(type, isDebit);
                                const dateStr = item?.createdAt ? formatDateTime(new Date(item.createdAt as any)) : '';
                                const signedAmount = `${isDebit ? '-' : '+'}${item?.amount}`;
                                const amountColor = isDebit ? 'ui:text-red-600 dark:ui:text-red-400' : 'ui:text-green-600 dark:ui:text-green-400';

                                return (
                                    <div key={item?.id} className="ui:py-3 ui:border-b ui:border-gray-200 dark:ui:border-gray-700 ui:last:border-b-0">
                                        <div className="ui:flex ui:justify-between ui:items-start ui:gap-3">
                                            {/* Left Content */}
                                            <div className="ui:flex ui:items-start ui:gap-3 ui:min-w-0 ui:flex-1">
                                                {/* Icon - Hidden on small screens */}
                                                <div className="ui:hidden sm:ui:flex ui:items-center ui:justify-center ui:w-8 ui:h-8 ui:rounded-full ui:bg-gray-100 dark:ui:bg-gray-800 ui:text-sm ui:flex-shrink-0">
                                                    {typeIcon}
                                                </div>

                                                <div className="ui:flex ui:flex-col ui:min-w-0 ui:flex-1 ui:space-y-1">
                                                    <div className="ui:flex ui:items-center ui:gap-2">
                                                        {/* Mobile: Show icon inline */}
                                                        <span className="ui:text-sm sm:ui:hidden">{typeIcon}</span>
                                                        <span className="ui:text-sm sm:ui:text-base ui:font-medium ui:text-slate-800 dark:ui:text-slate-200 ui:truncate">
                                                            {typeLabel}
                                                        </span>
                                                        {/* Mobile: Show amount here */}
                                                        <div className="ui:flex sm:ui:hidden ui:ml-auto ui:flex-shrink-0">
                                                            <span className={`ui:text-sm ui:font-medium ${amountColor}`}>
                                                                {signedAmount}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Description - if available */}
                                                    {item.description && (
                                                        <span className="ui:text-xs ui:text-gray-500 dark:ui:text-gray-400 ui:truncate">
                                                            {item.description}
                                                        </span>
                                                    )}

                                                    <span className="ui:text-[11px] sm:ui:text-xs ui:text-gray-500 dark:ui:text-gray-400">
                                                        {dateStr}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Desktop: Amount */}
                                            <div className="ui:hidden sm:ui:flex ui:flex-shrink-0">
                                                <span className={`ui:text-sm sm:ui:text-base ui:font-medium ${amountColor}`}>
                                                    {signedAmount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary - Responsive */}
                        <div className="ui:mt-4 ui:rounded-md ui:border ui:border-dashed ui:border-gray-300 dark:ui:border-gray-600 ui:p-3 sm:ui:p-4 ui:text-center ui:bg-gray-50/50 dark:ui:bg-gray-800/50">
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
                    </>
                ) : null}
            </div>
        </aside>
    );
};

export default TransactionHistory;