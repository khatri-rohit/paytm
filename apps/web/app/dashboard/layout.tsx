
"use client";

import { Navbar } from '@repo/ui/navbar';
import { signIn, signOut, useSession } from 'next-auth/react';


export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const { status } = useSession();

    return (
        <>
            <Navbar signIn={signIn}
                isLoggedIn={status === 'authenticated'}
                signOut={signOut} />
            {children}
        </>
    );
}