
const P2PTransferForm = ({ transferFn }: { transferFn: (formData: FormData) => Promise<void>; }) => {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await transferFn(formData);
    };

    return (
        <div className="ui:bg-white ui:shadow-md ui:rounded-lg ui:p-6 ui:max-w-md ui:mx-auto">
            <form className="ui:space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="text" className="ui:block ui:text-sm ui:font-medium ui:text-gray-700 ui:mb-1">
                        Ph. Number or UPI ID
                    </label>
                    <input
                        type="text"
                        id="number"
                        name="number"
                        className="ui:text-black ui:block ui:w-full ui:px-3 ui:py-2 ui:border ui:border-gray-300 ui:rounded-md ui:shadow-sm focus:ui:ring-blue-500 focus:ui:border-blue-500"
                        placeholder="What's this payment for?"
                    />
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
                            id="amount"
                            name="amount"
                            className="ui:text-black ui:block ui:w-full ui:pl-7 ui:pr-3 ui:py-2 ui:border ui:border-gray-300 ui:rounded-md ui:shadow-sm focus:ui:ring-blue-500 focus:ui:border-blue-500"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                <div className="ui:border-t ui:border-gray-200 ui:pt-4">
                    <label htmlFor="password" className="ui:block ui:text-sm ui:font-medium ui:text-gray-700 ui:mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="ui:block ui:w-full ui:px-3 ui:py-2 ui:border ui:border-gray-300 ui:rounded-md ui:shadow-sm focus:ui:ring-blue-500 focus:ui:border-blue-500 ui:text-black"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button
                    className="ui:w-full ui:flex ui:justify-center ui:py-2 ui:px-4 ui:border ui:border-transparent ui:rounded-md ui:shadow-sm ui:text-sm ui:font-medium ui:text-white ui:bg-blue-600 hover:ui:bg-blue-700 focus:ui:outline-none focus:ui:ring-2 focus:ui:ring-offset-2 focus:ui:ring-blue-500"
                >
                    Transfer Money
                </button>
            </form>
        </div>
    );
};

export default P2PTransferForm;