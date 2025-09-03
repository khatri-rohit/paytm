"use client";

import { useEffect, useRef, useState } from "react";
import TransferForm from "@/components/Tranferform";

type OnRampTransaction = {
    id: number;
    createdAt: string; // JSON dates arrive as strings
    updatedAt: string;
    userId: number;
    token: string;
    amount: string;
    proccesing?: string;
    bankId?: string;
};

export default function Transfer() {
    const [onRampTransaction, setOnRampTransaction] = useState<OnRampTransaction | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Cache URL params for retry
    const paramsRef = useRef<{ token: string; transactionId: string; bankId: string; } | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get("token") || "";
        const transactionId = searchParams.get("id") || "";
        const bankId = searchParams.get("info") || "";

        if (!token || !transactionId || !bankId) {
            setError("Invalid or missing transaction parameters.");
            setLoading(false);
            return;
        }

        paramsRef.current = { token, transactionId, bankId };

        const controller = new AbortController();

        const fetchTransaction = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/transaction`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token, transactionId, bankId }),
                    signal: controller.signal,
                });

                const data = await response.json();
                if (response.ok && data?.success) {
                    const payload = data.data ?? {};
                    setOnRampTransaction({
                        ...payload,
                        id: Number(transactionId),
                        token,
                        bankId,
                        createdAt: String(payload.createdAt ?? new Date().toISOString()),
                        updatedAt: String(payload.updatedAt ?? new Date().toISOString()),
                        amount: String(payload.amount ?? "0"),
                    });
                } else {
                    setError(data?.error || "Failed to validate transaction.");
                }
            } catch (err: any) {
                if (err?.name !== "AbortError") {
                    setError("Error validating transaction. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
        return () => controller.abort();
    }, []);

    const retry = async () => {
        if (!paramsRef.current) return;
        setError(null);
        setOnRampTransaction(null);
        setLoading(true);

        try {
            const response = await fetch(`/api/transaction`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paramsRef.current),
            });
            const data = await response.json();
            if (response.ok && data?.success) {
                const { token, transactionId, bankId } = paramsRef.current;
                const payload = data.data ?? {};
                setOnRampTransaction({
                    ...payload,
                    id: Number(transactionId),
                    token,
                    bankId,
                    createdAt: String(payload.createdAt ?? new Date().toISOString()),
                    updatedAt: String(payload.updatedAt ?? new Date().toISOString()),
                    amount: String(payload.amount ?? "0"),
                });
                setError(null);
            } else {
                setError(data?.error || "Failed to validate transaction.");
            }
        } catch {
            setError("Error validating transaction. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] grid place-items-center">
                <div className="animate-pulse text-gray-500">Validating transaction…</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-6">
                <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="text-red-700 font-medium mb-2">Transaction validation failed</div>
                    <div className="text-sm text-red-800 mb-4">{error}</div>
                    <div className="flex gap-2">
                        <button
                            onClick={retry}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => window.close()}
                            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                            Close window
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!onRampTransaction) {
        return null;
    }

    return <TransferForm onRampTransaction={onRampTransaction} />;
}