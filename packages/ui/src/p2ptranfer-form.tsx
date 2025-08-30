
"use client";

import React from "react";

type Props = {
    transferFn: (formData: FormData) => Promise<void>;
};

const P2PTransferForm: React.FC<Props> = ({ transferFn }) => {
    const [number, setNumber] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [submitting, setSubmitting] = React.useState(false);

    const validate = () => {
        const next: Record<string, string> = {};
        const trimmedNumber = number.trim();
        const trimmedAmount = amount.trim();

        // Recipient validation: 10+ digits OR contains '@' (UPI heuristic)
        if (!trimmedNumber) {
            next.number = "Enter phone number or UPI ID";
        } else if (!(/^[0-9]{10,}$/.test(trimmedNumber) || /.+@.+/.test(trimmedNumber))) {
            next.number = "Invalid number or UPI ID";
        }

        // Amount validation: positive with up to 2 decimals
        if (!trimmedAmount) {
            next.amount = "Enter amount";
        } else if (!/^\d+(\.\d{1,2})?$/.test(trimmedAmount)) {
            next.amount = "Invalid amount format";
        } else if (parseFloat(trimmedAmount) <= 0) {
            next.amount = "Amount must be greater than 0";
        }

        // Password validation
        if (!password.trim()) {
            next.password = "Enter your password";
        } else if (password.length < 6) {
            next.password = "Password must be at least 6 characters";
        }

        // Description validation (optional, max 140 chars)
        if (description && description.length > 140) {
            next.description = "Description must be 140 characters or less";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // if (!validate()) return;

        try {
            setSubmitting(true);
            const fd = new FormData();
            fd.set("number", number.trim());
            fd.set("amount", amount.trim());
            fd.set("password", password);
            if (description.trim()) fd.set("description", description.trim());
            await transferFn(fd);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="ui:bg-white ui:shadow-sm ui:border ui:border-gray-200 ui:rounded-xl ui:p-6 ui:max-w-2xl ui:w-full">
            <div className="ui:mb-4">
                <h2 className="ui:text-lg ui:font-semibold ui:text-gray-900">Send money</h2>
                <p className="ui:text-xs ui:text-gray-500">Transfers are instant and secure.</p>
            </div>

            <form className="ui:space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="ui:grid ui:grid-cols-1 md:ui:grid-cols-2 ui:gap-4">
                    <div>
                        <label htmlFor="number" className="ui:block ui:text-sm ui:font-medium ui:text-gray-700 ui:mb-1">
                            Phone number or UPI ID
                        </label>
                        <input
                            type="text"
                            id="number"
                            name="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className={
                                "ui:text-black ui:block ui:w-full ui:px-3 ui:py-2 ui:border ui:rounded-md ui:shadow-sm focus:ui:ring-blue-500 focus:ui:border-blue-500 " +
                                (errors.number ? "ui:border-red-500" : "ui:border-gray-300")
                            }
                            required
                            placeholder="9876543210 or user@bank"
                            aria-invalid={!!errors.number}
                            aria-describedby={errors.number ? "number-error" : undefined}
                            autoComplete="off"
                        />
                        {errors.number && (
                            <p id="number-error" className="ui:mt-1 ui:text-xs ui:text-red-600">{errors.number}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="amount" className="ui:block ui:text-sm ui:font-medium ui:text-gray-700 ui:mb-1">
                            Amount
                        </label>
                        <div className="ui:relative ui:mt-1 ui:rounded-md ui:shadow-sm">
                            <div className="ui:absolute ui:inset-y-0 ui:left-0 ui:pl-3 ui:flex ui:items-center ui:pointer-events-none">
                                <span className="ui:text-gray-500">₹</span>
                            </div>
                            <input
                                type="text"
                                inputMode="decimal"
                                id="amount"
                                name="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={
                                    "ui:text-black ui:block ui:w-full ui:pl-7 ui:pr-3 ui:py-2 ui:border ui:rounded-md ui:shadow-sm focus:ui:ring-blue-500 focus:ui:border-blue-500 " +
                                    (errors.amount ? "ui:border-red-500" : "ui:border-gray-300")
                                }
                                required
                                placeholder="0.00"
                                aria-invalid={!!errors.amount}
                                aria-describedby={errors.amount ? "amount-error" : undefined}
                                autoComplete="off"
                            />
                        </div>
                        {errors.amount && (
                            <p id="amount-error" className="ui:mt-1 ui:text-xs ui:text-red-600">{errors.amount}</p>
                        )}
                    </div>
                </div>

                <div className="ui:grid ui:grid-cols-1 md:ui:grid-cols-2 ui:gap-4 ui:border-t ui:border-gray-200 ui:pt-4">
                    <div className="md:ui:col-span-2">
                        <label htmlFor="description" className="ui:block ui:text-sm ui:font-medium ui:text-gray-700 ui:mb-1">
                            Message / Description <span className="ui:text-gray-400">(optional)</span>
                        </label>
                        <div className="ui:relative">
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={
                                    "ui:text-black ui:block ui:w-full ui:resize-y ui:px-3 ui:py-2 ui:border ui:rounded-md ui:shadow-sm focus:ui:ring-blue-500 focus:ui:border-blue-500 " +
                                    (errors.description ? "ui:border-red-500" : "ui:border-gray-300")
                                }
                                placeholder="Add a note for the recipient (max 140 chars)"
                                aria-invalid={!!errors.description}
                                aria-describedby={errors.description ? "description-error" : undefined}
                            />
                            <div className="ui:absolute ui:right-2 ui:bottom-2 ui:text-[10px] ui:text-gray-400">{description.length}/140</div>
                        </div>
                        {errors.description && (
                            <p id="description-error" className="ui:mt-1 ui:text-xs ui:text-red-600">{errors.description}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="ui:block ui:text-sm ui:font-medium ui:text-gray-700 ui:mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={
                                "ui:block ui:w-full ui:px-3 ui:py-2 ui:border ui:rounded-md ui:shadow-sm focus:ui:ring-blue-500 focus:ui:border-blue-500 ui:text-black " +
                                (errors.password ? "ui:border-red-500" : "ui:border-gray-300")
                            }
                            required
                            placeholder="Enter your password"
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        {errors.password && (
                            <p id="password-error" className="ui:mt-1 ui:text-xs ui:text-red-600">{errors.password}</p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="ui:w-full ui:flex ui:items-center ui:justify-center ui:gap-2 ui:py-2 ui:px-4 ui:border ui:border-transparent ui:rounded-md ui:shadow-sm ui:text-sm ui:font-medium ui:text-white ui:bg-blue-600 hover:ui:bg-blue-700 focus:ui:outline-none focus:ui:ring-2 focus:ui:ring-offset-2 focus:ui:ring-blue-500 disabled:ui:opacity-60 disabled:hover:ui:bg-blue-600"
                >
                    {submitting && (
                        <span className="ui:inline-block ui:size-4 ui:animate-spin ui:rounded-full ui:border-2 ui:border-white ui:border-t-transparent" />
                    )}
                    Transfer Money
                </button>

                <p className="ui:text-[11px] ui:text-gray-500 ui:text-center">
                    By continuing, you authorize a one-time P2P transfer. Transfers may be subject to bank limits.
                </p>
            </form>
        </div>
    );
};

export default P2PTransferForm;