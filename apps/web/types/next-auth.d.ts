// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            isNewUser?: boolean;
            // Add any other custom properties you want to include
            // number?: string
            // role?: string
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        isNewUser?: boolean;
        // Add any other custom properties
        // number?: string
        // role?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        isNewUser?: boolean;
        // Add any other custom properties
        // number?: string
        // role?: string
    }
}