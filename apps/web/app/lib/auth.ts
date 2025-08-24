import CredentialsProvider from 'next-auth/providers/credentials';

type User = {
    id: string; // Add the required 'id' field
    name?: string;
    email?: string;
    number: string;
    password: string;
};


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'signup',
            credentials: {
                name: { label: 'name', type: 'text', placeholder: '' },
                email: { label: 'email', type: 'text', placeholder: '' },
                number: { label: 'number', type: 'text', placeholder: '' },
                password: { label: 'password', type: 'password', placeholder: '' }
            },
            async authorize(credentials: Record<"name" | "email" | "number" | "password", string> | undefined): Promise<User | null> {
                console.log("New user");
                if (!credentials) {
                    return null; // or handle the case when credentials are undefined
                }

                const { name, email, number, password } = credentials;
                console.log(credentials);
                return {
                    id: "user1",
                    name,
                    email,
                    number,
                    password
                };
            },
        }),
        CredentialsProvider({
            name: 'signin',
            credentials: {
                number: { label: 'number', type: 'text', placeholder: '' },
                password: { label: 'password', type: 'password', placeholder: '' }
            },
            async authorize(credentials: Record<"number" | "password", string> | undefined): Promise<User | null> {
                console.log("Existing user");
                if (!credentials) {
                    return null; // or handle the case when credentials are undefined
                }

                const { number, password } = credentials;
                console.log(credentials);
                return {
                    id: "user1",
                    number,
                    password
                };
            },
        }),
    ],
    // pages: {
    //     signIn: "/auth/signin",
    //     signOut: "/",
    // },
    secret: process.env.NEXTAUTH_SECRET
};
