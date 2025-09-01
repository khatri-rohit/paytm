// ...existing code...
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

const OnRampHistory = ({ icon, data = [], failed, formatDateTime, refresh, refreshIcon, currencySymbol = '₹', isLoading, isFetching, LoadingIcon }: OnRampHistoryProps) => {
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

    const amount = items.reduce((acc, item) => getStatus(item?.processing) === 'COMPLETED' ? acc + Number(item.amount) : acc, 0);

    const statusStyle = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return { badge: 'ui:bg-green-50 ui:text-green-700 ui:border ui:border-green-200', amount: 'ui:text-slate-800' };
            case 'FAILED':
                return { badge: 'ui:bg-red-50 ui:text-red-700 ui:border ui:border-red-200', amount: 'ui:text-red-600' };
            default:
                return { badge: 'ui:bg-amber-50 ui:text-amber-700 ui:border ui:border-amber-200', amount: 'ui:text-amber-600' };
        }
    };

    const maskAccount = (last4?: string) => (last4 ? `•••• ${last4}` : '');

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
                    <div className="ui:py-4 ui:text-center ui:min-h-[200px] ui:flex ui:items-center ui:justify-center">
                        {LoadingIcon}
                    </div>
                )}

                {!isLoading && items.length === 0 ? (
                    <div className="ui:rounded-md ui:border ui:border-dashed ui:p-6 ui:text-center">
                        <p className="ui:text-sm ui:text-gray-600">No transfers yet</p>
                        <p className="ui:mt-1 ui:text-xs ui:text-gray-500">Your bank transfers will appear here.</p>
                        {failed && (
                            <p className="ui:mt-3 ui:text-xs ui:text-red-600">Failed to load transfers.</p>
                        )}
                    </div>
                ) : (
                    <ul className="ui:mt-4 ui:space-y-3 ui:max-h-[500px] ui:overflow-y-auto ui:pr-1">
                        {items.map((item) => {
                            const status = getStatus(item?.processing);
                            const { badge, amount } = statusStyle(status);
                            const dateStr = item.createdAt ? formatDateTime(new Date(item.createdAt)) : '';
                            const subtitleParts = [item.bankName, maskAccount(item.accountLast4), dateStr].filter(Boolean);
                            const subtitle = subtitleParts.join(' • ');
                            return (
                                <li key={item.id} className="ui:py-2 ui:border-b ui:border-gray-200">
                                    <div className="ui:flex ui:justify-between ui:items-center ui:gap-3">
                                        <div className="ui:min-w-0 ui:flex-1">
                                            <div className="ui:flex ui:items-center ui:gap-2">
                                                <span className="ui:text-sm ui:font-medium ui:text-slate-800 truncate">
                                                    To: External account
                                                </span>
                                                <span className={`ui:text-[10px] ui:px-2 ui:py-0.5 ui:rounded-full ${badge}`}>
                                                    {status === 'COMPLETED' ? 'Completed' : 'Pending'}
                                                </span>
                                            </div>
                                            <span className="ui:block ui:text-xs ui:text-gray-500 ui:mt-0.5 truncate">
                                                {subtitle}
                                            </span>
                                        </div>
                                        <span className={`ui:text-sm ui:font-medium ${amount}`}>
                                            {withCurrency(item.amount)}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {!isLoading && items.length > 0 && (
                    <div className="ui:rounded-md ui:border ui:border-dashed ui:p-2 ui:text-center ui:text-black">
                        <p className="ui:mt-1 ui:text-lg ui:text-gray-500">
                            <span className="ui:font-medium ui:text-slate-800">Total Transaction Amount: </span>
                            <span className="ui:text-gray-500">{(amount)}</span>
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default OnRampHistory;
// ...existing code...