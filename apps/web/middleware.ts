export { default } from "next-auth/middleware";

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    const { pathname } = request.nextUrl;

    // Define route patterns
    const isAuthRoute = pathname.startsWith('/auth/');
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isNewUserRoute = pathname === '/auth/new-user';
    const isRootRoute = pathname === '/';

    // Authenticated user logic
    if (token) {
        // New user should only access new-user page
        if (token.isNewUser && !isNewUserRoute && !pathname.startsWith('/api/')) {
            return NextResponse.redirect(new URL('/auth/new-user', request.url));
        }

        // Completed users shouldn't access new-user page
        if (!token.isNewUser && isNewUserRoute) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Redirect from auth routes to dashboard
        if (isAuthRoute && !isNewUserRoute) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Redirect from root to dashboard
        if (isRootRoute) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        // Unauthenticated user logic
        if (isProtectedRoute || isNewUserRoute) {
            return NextResponse.redirect(new URL('/auth/signin', request.url));
        }

        if (isRootRoute) {
            return NextResponse.redirect(new URL('/auth/signin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/auth/:path*'
    ]
};