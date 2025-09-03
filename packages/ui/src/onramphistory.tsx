interface OnRampHistoryProps {
    icon: React.ReactNode;
    data?: Array<{
        id: number;
        amount: string;
        createdAt: string | Date;
        processing: 'PROCESSING' | 'SUCCESS';
        bankName: string;
        accountLast4: string; // last 4 digits
    }>;
    formatDateTime: (date: Date) => string;
    failed: boolean;
    refresh: () => void;
    refreshIcon?: React.ReactNode;
    // Optional: currency symbol to prefix (₹, $, etc.)
    currencySymbol?: string;
    isLoading: boolean;
    isFetching: boolean;
    LoadingIcon: React.ReactNode;
}

const OnRampHistory = ({
    icon,
    data = [],
    failed,
    formatDateTime,
    refresh,
    refreshIcon,
    currencySymbol = '₹',
    isLoading,
    isFetching,
    LoadingIcon
}: OnRampHistoryProps) => {
    const items = Array.isArray(data) ? data : [];

    const withCurrency = (val: string) => {
        const trimmed = val?.trim?.() ?? '';
        if (!currencySymbol) return trimmed?.startsWith('-') ? trimmed : `-${trimmed}`;
        const hasSymbol = trimmed.startsWith(currencySymbol) || trimmed.startsWith(`-${currencySymbol}`);
        const negative = trimmed.startsWith('-');
        const raw = negative ? trimmed.slice(1) : trimmed;
        const prefixed = hasSymbol ? trimmed.replace(currencySymbol, '').replace('-', '') : raw;
        return `-${currencySymbol}${prefixed.trim()}`;
    };

    const getStatus = (item: 'PROCESSING' | 'SUCCESS') => {
        if (item === 'SUCCESS') return 'COMPLETED';
        return 'PENDING';
    };

    const amount = items.reduce((acc, item) =>
        getStatus(item?.processing) === 'COMPLETED' ? acc + Number(item.amount) : acc, 0
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

    const statusStyle = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return {
                    badge: 'ui:bg-green-50 ui:text-green-700 ui:border ui:border-green-200 dark:ui:bg-green-950/30 dark:ui:text-green-400 dark:ui:border-green-800',
                    amount: 'ui:text-slate-800 dark:ui:text-slate-200'
                };
            case 'FAILED':
                return {
                    badge: 'ui:bg-red-50 ui:text-red-700 ui:border ui:border-red-200 dark:ui:bg-red-950/30 dark:ui:text-red-400 dark:ui:border-red-800',
                    amount: 'ui:text-red-600 dark:ui:text-red-400'
                };
            default:
                return {
                    badge: 'ui:bg-amber-50 ui:text-amber-700 ui:border ui:border-amber-200 dark:ui:bg-amber-950/30 dark:ui:text-amber-400 dark:ui:border-amber-800',
                    amount: 'ui:text-amber-600 dark:ui:text-amber-400'
                };
        }
    };

    const maskAccount = (last4?: string) => (last4 ? `•••• ${last4}` : '');

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
                            <span className="sm:ui:hidden">Transfers</span>
                            <span className="ui:hidden sm:ui:inline">Bank Transfers</span>
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
                    <div className="ui:py-8 sm:ui:py-12 ui:text-center ui:min-h-[200px] sm:ui:min-h-[300px] ui:flex ui:items-center ui:justify-center">
                        <div className="ui:flex ui:flex-col ui:items-center ui:gap-3">
                            {LoadingIcon}
                            <span className="ui:text-sm ui:text-gray-500 dark:ui:text-gray-400">Loading transfers...</span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && items.length === 0 ? (
                    <div className="ui:rounded-md ui:border ui:border-dashed ui:border-gray-300 dark:ui:border-gray-600 ui:p-4 sm:ui:p-6 ui:text-center">
                        <div className="ui:space-y-2">
                            <p className="ui:text-sm sm:ui:text-base ui:text-gray-600 dark:ui:text-gray-300">No transfers yet</p>
                            <p className="ui:text-xs sm:ui:text-sm ui:text-gray-500 dark:ui:text-gray-400">Your bank transfers will appear here.</p>
                            {failed && (
                                <p className="ui:mt-3 ui:text-xs sm:ui:text-sm ui:text-red-600 dark:ui:text-red-400">
                                    Failed to load transfers.
                                </p>
                            )}
                        </div>
                    </div>
                ) : !isLoading && items.length > 0 ? (
                    <>
                        {/* Transaction List - Responsive */}
                        <div className="ui:mt-4 ui:max-h-[300px] sm:ui:max-h-[400px] lg:ui:max-h-[500px] ui:overflow-y-auto ui:space-y-1 ui:-mr-3 ui:p-2 ui:pr-3">
                            {items.map((item) => {
                                const status = getStatus(item?.processing);
                                const { badge, amount } = statusStyle(status);
                                const dateStr = item.createdAt ? formatDateTime(new Date(item.createdAt)) : '';
                                const subtitleParts = [item.bankName, maskAccount(item.accountLast4), dateStr].filter(Boolean);

                                return (
                                    <div key={item.id} className="ui:py-3 ui:border-b ui:border-gray-200 dark:ui:border-gray-700 ui:last:border-b-0">
                                        <div className="ui:flex ui:justify-between ui:items-start ui:gap-3">
                                            {/* Left Content */}
                                            <div className="ui:min-w-0 ui:flex-1 ui:space-y-1">
                                                <div className="ui:flex ui:items-center ui:gap-2 ui:flex-wrap">
                                                    <span className="ui:text-sm sm:ui:text-base ui:font-medium ui:text-slate-800 dark:ui:text-slate-200 ui:truncate ui:flex-shrink-0">
                                                        To: External account
                                                    </span>
                                                    <span className={`ui:text-[10px] sm:ui:text-xs ui:px-2 ui:py-0.5 ui:rounded-full ui:whitespace-nowrap ${badge}`}>
                                                        {status === 'COMPLETED' ? 'Completed' : 'Pending'}
                                                    </span>
                                                </div>

                                                {/* Mobile: Stack subtitle items */}
                                                <div className="ui:block sm:ui:hidden ui:space-y-0.5">
                                                    {item.bankName && (
                                                        <div className="ui:text-xs ui:text-gray-500 dark:ui:text-gray-400">
                                                            {item.bankName}
                                                        </div>
                                                    )}
                                                    <div className="ui:text-xs ui:text-gray-500 dark:ui:text-gray-400 ui:flex ui:gap-2">
                                                        {maskAccount(item.accountLast4) && (
                                                            <span>{maskAccount(item.accountLast4)}</span>
                                                        )}
                                                        {dateStr && (
                                                            <span>{dateStr}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Desktop: Single line subtitle */}
                                                <div className="ui:hidden sm:ui:block">
                                                    <span className="ui:text-xs ui:text-gray-500 dark:ui:text-gray-400 ui:truncate">
                                                        {subtitleParts.join(' • ')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="ui:flex-shrink-0 ui:text-right">
                                                <span className={`ui:text-sm sm:ui:text-base ui:font-medium ${amount}`}>
                                                    {withCurrency(item.amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Total Summary - Responsive */}
                        <div className="ui:mt-4 ui:rounded-md ui:border ui:border-dashed ui:border-gray-300 dark:ui:border-gray-600 ui:p-3 sm:ui:p-4 ui:text-center ui:bg-gray-50/50 dark:ui:bg-gray-800/50">
                            <div className="ui:flex ui:flex-col sm:ui:flex-row sm:ui:items-center sm:ui:justify-center ui:gap-1 sm:ui:gap-2">
                                <span className="ui:text-sm sm:ui:text-base ui:font-medium ui:text-slate-800 dark:ui:text-slate-200">
                                    Total Transaction Amount:
                                </span>
                                <span className="ui:text-lg sm:ui:text-xl ui:font-semibold ui:text-gray-700 dark:ui:text-gray-300">
                                    {currencySymbol}{formatAmount(amount.toString())}
                                </span>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </aside>
    );
};

export default OnRampHistory;