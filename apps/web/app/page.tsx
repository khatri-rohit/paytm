import { getServerSession } from 'next-auth';
import { authOptions } from './lib/auth';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/auth/signin');
  }
};

export default Page;