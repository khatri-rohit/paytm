
import { prisma } from '@repo/db';
// import { RootState, useAppSelector } from '@repo/store';
import { TurborepoLogo } from '@repo/ui/turborepo-logo';

const Page = async () => {
  // const user = useAppSelector((state: RootState) => {
  //   return state;
  // });

  const User = await prisma.user.findFirst();

  return (
    <main className='min-h-screen p-24'>
      <TurborepoLogo />
      <p className="text-3xl">
        PayTM User {User?.name ?? "No user added yet"}

        {/* {User.then((data) => data.name) || "No User"} */}
      </p>
    </main>
  );
};

export default Page;