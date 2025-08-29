import * as React from 'react';

interface P2PItem {
    id: number | string;
    amount: string | number;
    timestamp?: string | Date;
    fromUserId?: number | string;
    senderName?: string | null;
    receiverName?: string | null;
}

interface P2PHistoryProps {
    icon: React.ReactNode;
    data?: P2PItem[];
    userId: string | number;
    formatDateTime: (date: Date) => string;
    failed?: boolean;
}

const P2PHistory = ({ icon, data = [], userId, formatDateTime, failed }: P2PHistoryProps) => {
    const items = Array.isArray(data) ? data : [];

    return (
        <aside className="ui:w-full ui:h-full">
            <div className="ui:sticky ui:top-4 ui:rounded-xl ui:border ui:bg-white ui:p-5 ui:shadow-sm">
                <div className="ui:mb-3 ui:flex ui:items-center ui:gap-2">
                    {icon}
                    <h2 className="ui:text-sm ui:font-medium text-gray-600">Transaction History</h2>
                </div>

                {items.length === 0 ? (
                    <div className="ui:rounded-md ui:border ui:border-dashed ui:p-6 ui:text-center">
                        <p className="ui:text-sm ui:text-gray-600">No transactions yet</p>
                        <p className="ui:mt-1 ui:text-xs ui:text-gray-500">Your recent transfers will appear here.</p>
                        {failed && (
                            <p className="ui:mt-3 ui:text-xs ui:text-red-600">Failed to load transaction history.</p>
                        )}
                    </div>
                ) : (
                    <ul className="ui:mt-4">
                        {items.map((item) => {
                            const isDebit = String(item?.fromUserId) === String(userId);
                            const label = isDebit ? 'Debit' : 'Credit';
                            const name = isDebit ? item?.receiverName : item?.senderName;
                            const title = name || label;
                            const dateStr = item?.timestamp ? formatDateTime(new Date(item.timestamp)) : '';
                            const signedAmount = `${isDebit ? '-' : '+'}${item?.amount}`;
                            return (
                                <li key={item?.id} className="ui:py-2 ui:border-b ui:border-gray-200">
                                    <div className="ui:flex ui:justify-between ui:items-center">
                                        <div className="ui:flex ui:flex-col">
                                            <span className="ui:text-sm ui:font-medium ui:text-slate-800">{title}</span>
                                            <span className="ui:text-xs ui:text-gray-500">{dateStr}</span>
                                        </div>
                                        <span className={`ui:text-sm ui:font-medium ${isDebit ? 'ui:text-red-600' : 'ui:text-green-600'}`}>
                                            {signedAmount}
                                        </span>
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
