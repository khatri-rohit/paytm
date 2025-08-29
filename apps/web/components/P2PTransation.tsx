"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import P2PTransferForm from "@repo/ui/p2ptranfer-form";

const P2PTransation = () => {
    const { status } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const transferMoney = async (formData: FormData) => {
        setError(null);
        if (status !== "authenticated") {
            setError("You must be logged in to perform this action.");
            return;
        }

        try {
            setSubmitting(true);
            const amount = formData.get("amount");
            const number = formData.get("number");
            const password = formData.get("password");
            const description = formData.get("description");
            console.log({ amount, number, password, description });
            const response = await fetch("/api/bank/transfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, number, password, description }),
            });
            const result = await response.json();
            console.log(result);
            if (!response.ok || result?.success === false) {
                throw new Error(result?.error || result?.message || "Transfer failed");
            }
            setError(null);
            // Optionally: show success toast or navigate
        } catch (e: any) {
            setError(e.message || "An error occurred during the transfer.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {error && (
                <div
                    role="alert"
                    className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                    {error}
                </div>
            )}

            <P2PTransferForm transferFn={transferMoney} />
        </>
    );
};

export default P2PTransation;