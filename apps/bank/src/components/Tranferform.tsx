"use client";

import { processpayment } from "@/lib/actions/processpayment";
import { useMemo, useState } from "react";

type OnRampTransaction = {
    id: number;
    amount: string;
    token: string;
    userId?: number;
    bankId?: string;
    proccesing?: string;
};

const formatCurrency = (amount: string, currency = "INR", locale = "en-IN") => {
    const n = Number(amount || 0);
    try {
        return new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);
    } catch {
        return `₹ ${n.toFixed(2)}`;
    }
};

const TransferForm = ({ onRampTransaction }: { onRampTransaction: OnRampTransaction; }) => {
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const maskedToken = useMemo(() => {
        const t = onRampTransaction.token || "";
        if (t.length <= 8) return "••••";
        return `${t.slice(0, 4)}••••${t.slice(-4)}`; // do not expose full token
    }, [onRampTransaction.token]);

    const amountFormatted = useMemo(
        () => formatCurrency(onRampTransaction.amount),
        [onRampTransaction.amount]
    );

    const makePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const success = await processpayment(onRampTransaction);
            if (success) {
                window.close();
            } else {
                setError("Problem processing payment. Please try again.");
            }
        } catch (err: any) {
            setError(err?.message || "Unexpected error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const cancel = () => {
        // Optional: call an API to mark as declined before closing
        window.close();
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4 text-black">
            <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h1 className="text-lg font-semibold">Confirm bank transfer</h1>
                    <p className="text-xs text-gray-500 mt-1">
                        You’re authorizing a one-time debit from your bank.
                    </p>
                </div>

                <form onSubmit={makePayment} className="px-6 py-5 space-y-5">
                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="col-span-2 rounded-lg bg-gray-50 p-4">
                            <div className="text-gray-600">Amount</div>
                            <div className="text-2xl font-bold">{amountFormatted}</div>
                            <div className="text-xs text-gray-500 mt-1">This amount cannot be changed.</div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3">
                            <div className="text-gray-600">Transaction ID</div>
                            <div className="font-medium">#{onRampTransaction.id}</div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3">
                            <div className="text-gray-600">Bank</div>
                            <div className="font-medium">{onRampTransaction.bankId || "—"}</div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 col-span-2">
                            <div className="text-gray-600">Security token</div>
                            <div className="font-mono text-sm">{maskedToken}</div>
                        </div>
                    </div>

                    {/* Hidden inputs if needed by server action in future */}
                    <input type="hidden" name="id" value={onRampTransaction.id} />
                    <input type="hidden" name="amount" value={onRampTransaction.amount} />
                    <input type="hidden" name="token" value={onRampTransaction.token} />
                    <input type="hidden" name="bankId" value={onRampTransaction.bankId || ""} />

                    <div className="text-xs text-gray-500">
                        By clicking Confirm, you authorize the bank to debit the amount shown above for this
                        transaction. Do not share OTP/PIN with anyone.
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                            {submitting ? "Processing…" : "Confirm transfer"}
                        </button>
                        <button
                            type="button"
                            onClick={cancel}
                            disabled={submitting}
                            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferForm;