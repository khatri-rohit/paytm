"use server";

import ChartComponent from '@/components/Chart';
import ShowTransactionHistory from '@/components/TransactionHistory';

const Home = async () => {
    return (
        <section className="h-full">
            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 h-full">
                {/* Chart Section */}
                <div className='order-2 lg:order-1 min-h-[300px] sm:min-h-[400px]'>
                    <div className="h-full p-3 sm:p-4 lg:p-6">
                        <ChartComponent />
                    </div>
                </div>

                {/* Transaction History Section */}
                <div className='order-1 lg:order-2 min-h-[400px] sm:min-h-[500px] p-3 sm:p-4 lg:p-6'>
                    <ShowTransactionHistory />
                </div>
            </div>
        </section>
    );
};

export default Home;