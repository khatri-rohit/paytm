"use client";

// import { prisma } from '@repo/db';
import { RootState, useAppSelector } from '@repo/store';
import { TurborepoLogo } from '@repo/ui/turborepo-logo';

const Page = () => {
  const User = useAppSelector((state: RootState) => {
    return state;
  });

  // const User = await prisma.user.findFirst();
  const openNewWindow = () => {
    window.open(
      'http://localhost:3001',
      '_blank',
      'width=800,height=600,resizable=yes,scrollbars=yes'
    );
  };
  return (
    <main className='min-h-screen p-24'>
      <TurborepoLogo />
      <p className="text-3xl">
        PayTM User {User?.name ?? "No user added yet"}
        {/* {User.then((data) => data.name) || "No User"} */}
      </p>
      <button className='bg-blue-500 text-white px-4 py-2 rounded-md'
        onClick={openNewWindow}>
        Done
      </button>
    </main>
  );
};

export default Page;