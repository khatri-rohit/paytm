"use client";

import { Navbar } from '@repo/ui/navbar';
import { signIn, signOut, useSession } from 'next-auth/react';

const Page = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <Navbar isLoggedIn={status === 'authenticated'} signIn={signIn} signOut={signOut} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-500 text-white">
        <p className='text-5xl'>Status: {status}</p>
        <p className='text-5xl'>Session: {JSON.stringify(session)}</p>
      </div>
    </div>
  );
};

export default Page;