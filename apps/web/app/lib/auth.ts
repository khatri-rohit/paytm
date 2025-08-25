import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@repo/db';

type User = {
    id: string;
    number: string;
    name: string | null;
    password: string;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
} | any;


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                number: { label: 'number', type: 'text', placeholder: 'xxxxxxxxxx' },
                password: { label: 'password', type: 'password', placeholder: '********' }
            },
            async authorize(credentials: Record<any, string> | undefined): Promise<User | null> {
                if (!credentials) {
                    return null; // or handle the case when credentials are undefined
                }
                try {
                    const { number, password } = credentials;

                    const user = await prisma.user.findUnique({
                        where: {
                            number: number
                        }
                    });
                    console.log(user);

                    if (user) {
                        if (user.password === password) {
                            return user;
                        }
                    }

                    return null;
                } catch (error) {
                    const err = error as Error;
                    console.log(err.message);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        signUp: '/auth/signup',
        newUser: '/auth/new-user',
    },
    callbacks: {
        async jwt({ token, user }: { token: any; user: any; }) {
            // When user signs in, add custom properties to token
            if (user) {
                token.id = user.id;
                // Add any other custom properties
                // token.number = user.number
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any; }) {
            // Add custom properties to session
            if (token && session.user) {
                session.user.id = token.id as string;
                // Add any other custom properties
                // session.user.number = token.number as string
            }
            console.log(session);
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET
};
