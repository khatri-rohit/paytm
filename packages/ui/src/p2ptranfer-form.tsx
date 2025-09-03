"use client";

import React from "react";
import {
    ArrowRight,
    User,
    DollarSign,
    Lock,
    MessageSquare,
    Loader2,
    AlertCircle,
    Send,
    Eye,
    EyeOff
} from 'lucide-react';

type Props = {
    transferFn: (formData: FormData) => Promise<void>;
    cn: any;
};

const P2PTransferForm: React.FC<Props> = ({ transferFn, cn }) => {
    const [number, setNumber] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [submitting, setSubmitting] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

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

    const formatAmount = (value: string) => {
        // Remove non-digits and decimal points
        const numbers = value.replace(/[^\d.]/g, '');
        // Ensure only one decimal point
        const parts = numbers.split('.');
        if (parts.length > 2) {
            return parts[0] + '.' + parts.slice(1).join('');
        }
        return numbers;
    };

    const formatPhoneNumber = (value: string) => {
        // Allow UPI IDs (containing @) or phone numbers
        if (value.includes('@')) {
            return value;
        }
        // Remove non-digits for phone numbers
        return value.replace(/\D/g, '').slice(0, 10);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setSubmitting(true);
            const fd = new FormData();
            fd.set("number", number.trim());
            fd.set("amount", amount.trim());
            fd.set("password", password);
            if (description.trim()) fd.set("description", description.trim());

            await transferFn(fd);

            // Reset form on success
            setNumber("");
            setAmount("");
            setPassword("");
            setDescription("");
            setErrors({});
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header */}


            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6"
                noValidate
            >
                {/* Recipient and Amount Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number / UPI Field */}
                    <div className="space-y-2">
                        <label htmlFor="number" className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <User className="w-4 h-4 text-zinc-400" />
                            Phone / UPI ID <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            id="number"
                            name="number"
                            value={number}
                            onChange={(e) => setNumber(formatPhoneNumber(e.target.value))}
                            className={cn(
                                "w-full bg-zinc-900/50 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3",
                                "text-white placeholder-zinc-400 text-sm sm:text-base",
                                "focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50",
                                "transition-all duration-200",
                                errors.number ? "border-red-500/50" : "border-zinc-700"
                            )}
                            placeholder="9876543210 or user@paytm"
                            required
                            autoComplete="off"
                            aria-invalid={!!errors.number}
                            aria-describedby={errors.number ? "number-error" : undefined}
                        />
                        {errors.number && (
                            <p id="number-error" className="text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.number}
                            </p>
                        )}
                    </div>

                    {/* Amount Field */}
                    <div className="space-y-2">
                        <label htmlFor="amount" className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <DollarSign className="w-4 h-4 text-zinc-400" />
                            Amount <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="decimal"
                                id="amount"
                                name="amount"
                                value={amount}
                                onChange={(e) => setAmount(formatAmount(e.target.value))}
                                className={cn(
                                    "w-full bg-zinc-900/50 border rounded-lg pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3",
                                    "text-white placeholder-zinc-400 text-sm sm:text-base",
                                    "focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50",
                                    "transition-all duration-200",
                                    errors.amount ? "border-red-500/50" : "border-zinc-700"
                                )}
                                placeholder="0.00"
                                required
                                autoComplete="off"
                                aria-invalid={!!errors.amount}
                                aria-describedby={errors.amount ? "amount-error" : undefined}
                            />
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <span className="text-zinc-400 text-sm sm:text-base">₹</span>
                            </div>
                            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                                <div className="w-px h-4 bg-zinc-600"></div>
                            </div>
                        </div>
                        {errors.amount && (
                            <p id="amount-error" className="text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.amount}
                            </p>
                        )}
                    </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2 border-t border-zinc-800/60 pt-4">
                    <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <MessageSquare className="w-4 h-4 text-zinc-400" />
                        Message <span className="text-zinc-500">(Optional)</span>
                    </label>
                    <div className="relative">
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={cn(
                                "w-full bg-zinc-900/50 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3",
                                "text-white placeholder-zinc-400 text-sm sm:text-base resize-none",
                                "focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50",
                                "transition-all duration-200",
                                errors.description ? "border-red-500/50" : "border-zinc-700"
                            )}
                            placeholder="Add a note for the recipient (max 140 chars)"
                            maxLength={140}
                            aria-invalid={!!errors.description}
                            aria-describedby={errors.description ? "description-error" : undefined}
                        />
                        <div className="absolute right-2 bottom-2 text-[10px] text-zinc-500">
                            {description.length}/140
                        </div>
                    </div>
                    {errors.description && (
                        <p id="description-error" className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <Lock className="w-4 h-4 text-zinc-400" />
                        Transaction Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cn(
                                "w-full bg-zinc-900/50 border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 pr-12",
                                "text-white placeholder-zinc-400 text-sm sm:text-base",
                                "focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50",
                                "transition-all duration-200",
                                errors.password ? "border-red-500/50" : "border-zinc-700"
                            )}
                            placeholder="Enter your password"
                            required
                            minLength={6}
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-300 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p id="password-error" className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.password}
                        </p>
                    )}
                    <p className="text-xs text-zinc-500">Minimum 6 characters required</p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting}
                    className={cn(
                        "w-full bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg",
                        "py-3 sm:py-3.5 px-4 text-sm sm:text-base font-medium",
                        "hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/50",
                        "transition-all duration-200 flex items-center justify-center gap-2",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-green-600"
                    )}
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing Transfer...
                        </>
                    ) : (
                        <>
                            Transfer Money
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-400 flex items-start gap-2">
                        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>
                            By continuing, you authorize a one-time P2P transfer.
                            Transfers may be subject to bank limits and are processed instantly.
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default P2PTransferForm;