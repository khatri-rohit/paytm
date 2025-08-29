interface OnRampHistoryProps {
    icon: React.ReactNode;
    data?: Array<{ id: number; amount: string; createdAt?: string | Date; processing: 'PROCESSING' | 'SUCCESS'; }>;
    formatDateTime: (date: Date) => string;
    failed?: boolean;
}

const OnRampHistory = ({ icon, data = [], failed, formatDateTime }: OnRampHistoryProps) => {
    const items = Array.isArray(data) ? data : [];
    return (
        <aside className="ui:w-full ui:h-full">
            <div className="ui:sticky ui:top-4 ui:rounded-xl ui:border ui:bg-white ui:p-5 ui:shadow-sm">
                <div className="ui:mb-3 ui:flex ui:items-center ui:gap-2">
                    {icon}
                    <h2 className="ui:text-sm ui:font-medium text-gray-600">On-Ramp History</h2>
                </div>
                {items.length === 0 ? (
                    <div className="ui:rounded-md ui:border ui:border-dashed ui:p-6 ui:text-center">
                        <p className="ui:text-sm ui:text-gray-600">No deposits yet</p>
                        <p className="ui:mt-1 ui:text-xs ui:text-gray-500">Your deposits will appear here.</p>
                        {failed && (
                            <p className="ui:mt-3 ui:text-xs ui:text-red-600">Failed to load on-ramp history.</p>
                        )}
                    </div>
                ) : (
                    <ul className="ui:mt-4">
                        {items.map((item) => {
                            const dateStr = item.createdAt ? formatDateTime(new Date(item.createdAt)) : '';
                            return (
                                <li key={item.id} className="ui:py-2 ui:border-b ui:border-gray-200">
                                    <div className="ui:flex ui:justify-between ui:items-center">
                                        <div className="ui:flex ui:flex-col">
                                            <span className="ui:text-sm ui:font-medium ui:text-slate-800">Deposit</span>
                                            <span className="ui:text-xs ui:text-gray-500">{dateStr}</span>
                                        </div>
                                        <span className={`ui:text-sm ui:font-medium ui:text-green-600`}>+{item.amount}</span>
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

export default OnRampHistory;
