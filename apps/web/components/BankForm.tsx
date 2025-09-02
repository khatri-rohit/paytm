'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCreateBankTransferMutation } from '@repo/store';
import { cn } from "@/lib/utils";

const generateToken = () =>
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

const BankForm = () => {
    const { data: session } = useSession();
    const [createBankTransfer] = useCreateBankTransferMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const submitOnRamp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const amount = String(formData.get("amount") || "");
        const bankName = String(formData.get("bankName") || "");
        const accountNumber = String(formData.get("accountNumber") || "");

        if (!amount || !bankName || !accountNumber) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        if (!session?.user?.id) {
            setError("You must be logged in.");
            setLoading(false);
            return;
        }

        const token = generateToken();

        try {
            const body = {
                userId: session.user.id,
                bankId: Number(accountNumber),
                token,
                amount,
            };

            const { data } = await createBankTransfer(body);

            if (data?.success && data.transaction?.id) {
                setSuccess("Transaction initiated. Opening transfer window...");
                window.open(
                    `http://localhost:3001/transfer?token=${token}&id=${data.transaction.id}&info=${accountNumber}`,
                    "_blank",
                    "noopener noreferrer,height=800,width=800"
                );
                setTimeout(() => {
                    setSuccess(null);
                }, 3000);
            } else {
                setError(data?.message || "Failed to create transaction.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={submitOnRamp}
            className="bg-white rounded-lg shadow-md p-6 w-full max-w-md space-y-5"
        >
            <h2 className="text-lg font-medium text-gray-800">Deposit Funds</h2>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <div className="space-y-1 text-black">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount
                </label>
                <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="1"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    required
                />
            </div>

            <div className="space-y-1 text-black">
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                    Bank Name
                </label>
                <input
                    id="bankName"
                    name="bankName"
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., SBI"
                    required
                />
            </div>

            <div className="space-y-1 text-black">
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                    Account Number
                </label>
                <input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter account number"
                    required
                />
            </div>

            <button
                type="submit"
                className={cn(
                    "w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition",
                    loading && "opacity-50 cursor-not-allowed"
                )}
                disabled={loading}
            >
                {loading ? "Processing..." : "Deposit"}
            </button>
        </form>
    );
};

export default BankForm;
