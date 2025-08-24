"use client";

import { useSession } from 'next-auth/react';

const Home = () => {
    const { data: session, status } = useSession();

    return (
        <main>
            <h1>Dashboard</h1>
            <p>Status: {status}</p>
            <p>Session: {JSON.stringify(session)}</p>
        </main>
    );
};

export default Home;