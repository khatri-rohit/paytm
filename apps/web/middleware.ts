export { default } from "next-auth/middleware";

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // Define route patterns
    const isAuthRoute = pathname.startsWith('/auth/');
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isRootRoute = pathname === '/';

    // Authenticated user logic
    if (token) {
        if (isAuthRoute || isRootRoute) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Unauthenticated user logic
    if (isAuthRoute) {
        return NextResponse.next();
    }

    if (isProtectedRoute || isRootRoute) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
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