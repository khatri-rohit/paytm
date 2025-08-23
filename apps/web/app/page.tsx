"use client";

import { RootState, useAppSelector } from '@repo/store';
import { TurborepoLogo } from '@repo/ui/turborepo-logo';

const Page = () => {
  const user = useAppSelector((state: RootState) => {
    return state;
  });

  return (
    <main className='min-h-screen p-24'>
      <TurborepoLogo />
      <p className="text-3xl">
        PayTM User {user.name}
      </p>
    </main>
  );
};

export default Page;