import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const access_token = request.cookies.get('access_token'); // HttpOnly cookie
    const refresh_token = request.cookies.get('refresh_token');
  
    if (!access_token) {
        return NextResponse.redirect(new URL('/user/login', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
  matcher: ['/notes', '/notes/:path*', '/user/:path*'], // protect these routes
};
