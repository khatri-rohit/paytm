"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import P2PTransferForm from "@repo/ui/p2ptranfer-form";
import { toast } from "sonner";

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
                toast.error("Transfer failed", {
                    description: result?.message || "An error occurred during the transfer.", style: {
                        backgroundColor: "#ff2424",
                        color: "white",
                    }
                });
            }
            if (response.ok && result?.success) {
                toast.success("Transfer successful!", {
                    description: "Your transfer was completed successfully.", style: {
                        backgroundColor: "#4caf50",
                        color: "white",
                    }
                });
            }
            setError(null);
        } catch (e: any) {
            setError(e.message || "An error occurred during the transfer.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <P2PTransferForm transferFn={transferMoney} />
    );
};

export default P2PTransation;