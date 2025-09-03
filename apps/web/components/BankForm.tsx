'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCreateBankTransferMutation } from '@repo/store';
import { cn } from "@/lib/utils";
import { ArrowRight, Building2, CreditCard, DollarSign, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const generateToken = () =>
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

const BankForm = () => {
    const { data: session } = useSession();
    const [createBankTransfer] = useCreateBankTransferMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        amount: '',
        bankName: '',
        accountNumber: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear errors when user starts typing
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const formatAmount = (value: string) => {
        // Remove non-digits
        const numbers = value.replace(/\D/g, '');
        // Format with commas
        return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const openBankPopup = (url: string, title = 'Bank Transfer', w = 520, h = 720) => {
        const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0;
        const dualScreenTop = window.screenTop ?? window.screenY ?? 0;

        const innerWidth = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
        const innerHeight = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;

        const left = Math.max(0, Math.round(dualScreenLeft + (innerWidth - w) / 2));
        const top = Math.max(0, Math.round(dualScreenTop + (innerHeight - h) / 2));

        const features = [
            'popup=yes',
            'toolbar=no',
            'location=no',
            'status=no',
            'menubar=no',
            'scrollbars=yes',
            'resizable=yes',
            `width=${w}`,
            `height=${h}`,
            `top=${top}`,
            `left=${left}`,
            'noopener=yes',
            'noreferrer=yes',
        ].join(',');

        const win = window.open(url, title, features);
        if (win && typeof win.focus === 'function') win.focus();
        return win;
    };

    const submitOnRamp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const { amount, bankName, accountNumber } = formData;

        if (!amount || !bankName || !accountNumber) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        // Remove commas from amount for processing
        const cleanAmount = amount.replace(/,/g, '');

        if (isNaN(Number(cleanAmount)) || Number(cleanAmount) <= 0) {
            setError("Please enter a valid amount");
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
                amount: cleanAmount,
            };

            const { data } = await createBankTransfer(body);

            if (data?.success && data.transaction?.id) {
                setSuccess("Transaction initiated. Opening transfer window...");

                // Reset form
                setFormData({ amount: '', bankName: '', accountNumber: '' });

                const url = `http://localhost:3001/transfer?token=${token}&id=${data.transaction.id}&info=${accountNumber}`;

                // Open centered popup (520x720). Adjust as needed.
                const popup = openBankPopup(url, 'Bank Transfer', 520, 720);
                if (!popup) {
                    setError("Popup blocked. Please allow popups and try again.");
                    setSuccess(null);
                }

                setTimeout(() => {
                    setSuccess(null);
                }, 5000);
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
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            {/* <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-white">Bank Transfer</h2>
                        <p className="text-xs sm:text-sm text-zinc-400">Deposit funds to your wallet</p>
                    </div>
                </div>
            </div> */}

            {/* Status Messages */}
            {error && (
                <div className="mb-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-400">{success}</p>
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={submitOnRamp}
                className="bg-white/5 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
                {/* Amount Field */}
                <div className="space-y-2">
                    <label htmlFor="amount" className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <DollarSign className="w-4 h-4 text-zinc-400" />
                        Amount
                    </label>
                    <div className="relative">
                        <input
                            id="amount"
                            type="text"
                            value={formData.amount}
                            onChange={(e) => handleInputChange('amount', formatAmount(e.target.value))}
                            className={cn(
                                `w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 ${formData.amount && 'indent-2'}`,
                                "text-white placeholder-zinc-400 text-sm sm:text-base",
                                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ",
                                "transition-all duration-75",
                                error && error.includes('amount') && "border-red-500/50 focus:ring-red-500/50"
                            )}
                            placeholder="Enter amount (e.g., 1,000)"
                            required
                        />
                        {formData.amount && <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <span className="text-zinc-400 text-sm sm:text-base">₹</span>
                        </div>}
                        {/* <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                            <div className="w-px h-4 bg-zinc-600"></div>
                        </div> */}
                        {/* <div className="pl-12"> */}
                        {/* This div creates space for the currency symbol */}
                        {/* </div> */}
                    </div>
                    <p className="text-xs text-zinc-500">Minimum amount: ₹1</p>
                </div>

                {/* Bank Name Field */}
                <div className="space-y-2">
                    <label htmlFor="bankName" className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <Building2 className="w-4 h-4 text-zinc-400" />
                        Bank Name
                    </label>
                    <input
                        id="bankName"
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                        className={cn(
                            "w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3",
                            "text-white placeholder-zinc-400 text-sm sm:text-base",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                            "transition-all duration-200"
                        )}
                        placeholder="e.g., State Bank of India"
                        required
                    />
                </div>

                {/* Account Number Field */}
                <div className="space-y-2">
                    <label htmlFor="accountNumber" className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <CreditCard className="w-4 h-4 text-zinc-400" />
                        Account Number
                    </label>
                    <input
                        id="accountNumber"
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                        className={cn(
                            "w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3",
                            "text-white placeholder-zinc-400 text-sm sm:text-base font-mono tracking-wider",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                            "transition-all duration-200"
                        )}
                        placeholder="Enter account number"
                        required
                    />
                    <p className="text-xs text-zinc-500">Your bank account number (numbers only)</p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                        "w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg",
                        "py-3 sm:py-3.5 px-4 text-sm sm:text-base font-medium",
                        "hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                        "transition-all duration-200 flex items-center justify-center gap-2",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600"
                    )}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Initiate Transfer
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-400 flex items-start gap-2">
                        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>
                            You'll be redirected to a secure payment window to complete your transfer.
                            Keep this window open until the transaction is completed.
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default BankForm;