
interface BankFormProps {
    // makePayment action
    makePayment: (amount: number, onRampTransactionId: number) => Promise<void>;
}

export function BankForm({ makePayment }: BankFormProps) {

    return (
        <form>
            <input type="text" name="amount" placeholder="Enter Amount" value={100} />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => makePayment(100, 1)}>
                Pay
            </button>
        </form>
    );
};
