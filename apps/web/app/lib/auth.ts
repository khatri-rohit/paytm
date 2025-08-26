import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@repo/db';
import { NextAuthOptions, Session } from 'next-auth';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

type User = {
    id: string;
    number: string;
    name: string | null;
    password: string;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
} | any;


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                number: { label: 'number', type: 'text', placeholder: 'xxxxxxxxxx' },
                password: { label: 'password', type: 'password', placeholder: '********' }
            },
            async authorize(credentials: Record<any, string> | undefined): Promise<User | null> {
                if (!credentials) {
                    throw new Error('Credentials are not defined');
                    return null; // or handle the case when credentials are undefined
                }
                try {
                    const { number, password } = credentials;
                    if (number && isNaN(parseInt(number))) {
                        throw new Error('Number is not a valid number');
                    }
                    if (!password) {
                        throw new Error('Password is not defined');
                    }
                    const user = await prisma.user.findUnique({
                        where: { number }
                    });
                    if (!user) {
                        throw new Error('Invalid Credentials!! User not found');
                    }
                    const isPasswordCorrect = await bcrypt.compare(password, user.password);
                    if (!isPasswordCorrect) {
                        throw new Error('Password is incorrect');
                    }
                    return user;
                } catch (error) {
                    const err = error as Error;
                    console.log(err.message);
                    throw new Error('Invalid Credentials');
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
        newUser: '/auth/new-user',
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    cookies: {
        sessionToken: {
            name: 'next-auth.session-token',
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            }
        }
    },
    callbacks: {
        async jwt({ token, user, trigger, session }: { token: JWT; user?: User | null; trigger?: "signIn" | "signUp" | "update"; session?: any; }): Promise<any> {
            if (user) {
                token.id = user.id;
                token.isNewUser = user.isNewUser;
            }

            if (trigger === 'update' && session) {
                token.isNewUser = false;
            }
            return token;
        },
        async session({ session, token, }: { session: Session; token: JWT; }): Promise<any> {
            if (token) {
                session.user.id = token.id;
                session.user.isNewUser = token.isNewUser;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};
