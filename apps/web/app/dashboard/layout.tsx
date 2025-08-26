
"use client";

import { Navbar } from '@repo/ui/navbar';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TransferLink from '../lib/tranferLink';

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const { status, data: session } = useSession();
    const router = useRouter();

    return (
        <>
            <Navbar signIn={signIn}
                isLoggedIn={status === 'authenticated'}
                signOut={() => {
                    signOut();
                    router.push('/auth/signin');
                }}
                link={<TransferLink />} />
            <h1>Dashboard</h1>
            <p>Status: {status}</p>
            <p>Session: {JSON.stringify(session)}</p>
            {children}
        </>
    );
}