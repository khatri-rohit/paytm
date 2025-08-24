
"use client";

import { Navbar } from '@repo/ui/navbar';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const { status } = useSession();
    console.log(status);
    const router = useRouter();

    return (
        <>
            <Navbar signIn={signIn}
                isLoggedIn={status === 'authenticated'}
                signOut={() => {
                    signOut();
                    router.push('/auth/signin');
                }} />
            {children}
        </>
    );
}