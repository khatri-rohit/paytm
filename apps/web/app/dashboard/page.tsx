"use server";

import ChartComponent from '@/components/Chart';
import ShowTransactionHistory from '@/components/TransactionHistory';

const Home = async () => {


    return (
        <section className="p-4 h-full">
            <div className="flex items-start justify-between gap-6 p-6 rounded-lg shadow-md">
                <div className='flex-1'>
                    <ChartComponent />
                </div>
                <div className='flex-1 h-full'>
                    <ShowTransactionHistory />
                </div>
            </div>
        </section>
    );
};

export default Home;