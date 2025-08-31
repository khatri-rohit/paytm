"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import P2PTransferForm from "@repo/ui/p2ptranfer-form";
import { toast } from "sonner";
import { useCreateP2PTransferMutation } from '@repo/store';

const P2PTransation = () => {
    const { status } = useSession();
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [createP2PTransfer] = useCreateP2PTransferMutation();



    const transferMoney = async (formData: FormData) => {
        setError(null);
        if (status !== "authenticated") {
            setError("You must be logged in to perform this action.");
            return;
        }

        try {
            setSubmitting(true);
            const amountValue = formData.get("amount");
            const numberValue = formData.get("number");
            const passwordValue = formData.get("password");
            const descriptionValue = formData.get("description");

            if (!amountValue || !numberValue || !passwordValue) {
                setError("All required fields must be filled.");
                return;
            }

            const amount = Number(amountValue);
            const number = numberValue.toString();
            const password = passwordValue.toString();
            const description = descriptionValue?.toString() || "";

            if (isNaN(amount) || amount <= 0) {
                setError("Please enter a valid amount.");
                return;
            }

            console.log({ amount, number, password, description });
            // const response = await fetch("/api/bank/transfer", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ amount, number, password, description }),
            // });

            const { data } = await createP2PTransfer({ amount, number, password, description });
            console.log(data);
            if (!data?.success) {
                toast.error("Transfer failed", {
                    description: data?.error || "An error occurred during the transfer.", style: {
                        backgroundColor: "#ff2424",
                        color: "white",
                    }
                });
            }
            if (data?.success) {
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