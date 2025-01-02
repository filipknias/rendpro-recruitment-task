import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const protectedRoutes = ['/'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function middleware(req: NextRequest, res: NextResponse) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookieStore = await cookies();
    const cookie = cookieStore.get('token')?.value;

    if (isProtectedRoute && !cookie) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if (isPublicRoute && cookie) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}