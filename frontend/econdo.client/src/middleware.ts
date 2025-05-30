import { accessTokenCookieKey, refreshTokenCookieKey } from "@/utils/constants";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, isUserInRole, logout, setAccessTokenCookie } from "./actions/auth";
import { jwtDecode } from "jwt-decode";

const protectedRoutes = [
    '/condos/buildings',
    '/condos/properties',
    '/profile',
    '/acceptedInvitation',
    '/buildings',
    '/properties',
    '/createBuilding',
    '/acceptedInvitation',
];

const publicRoutes = ['/login', '/register', '/', '/confirmAccount', '/forgotPassword', '/resetPassword'];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const cookieStore = (await cookies());
    let accessToken = cookieStore.get(accessTokenCookieKey)?.value;
    const refreshTokenCookie = cookieStore.get(refreshTokenCookieKey);
    if(accessToken) {
        const token = jwtDecode(accessToken);

        if(token.exp! < Date.now() / 1000)
            accessToken = undefined;
    }
    
    if(accessToken && !refreshTokenCookie) {
        cookieStore.delete(accessTokenCookieKey);
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if(!accessToken && refreshTokenCookie) {
        const res = await generateAccessToken();
        if(res.ok) {
            await setAccessTokenCookie(res.value!.accessToken, 
                res.value!.expiresIn);
            accessToken = res.value!.accessToken;
        } else {
            cookieStore.delete(refreshTokenCookieKey);
            cookieStore.delete(accessTokenCookieKey);
            return NextResponse.redirect(new URL('/', req.nextUrl));
        }

        return NextResponse.redirect(req.nextUrl);
    }

    if(path.startsWith('/logout')) {
        if(accessToken) {
            try {
                await logout();
                return NextResponse.redirect(new URL('/', req.nextUrl));
            }
            catch(error) {
                console.error(error);
            }
        } else {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
    }

    // TODO: move in admin layout
    const isAdmin = (await isUserInRole('admin')).ok;
    if(path.startsWith('/admin')) {
        if(!isAdmin)
            return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    if(isAdmin && !path.startsWith('/admin'))
        return NextResponse.redirect(new URL('/admin/buildings', req.nextUrl));
    
    if(protectedRoutes.some(route => path.startsWith(route)) && !accessToken)
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    
    if(publicRoutes.includes(path) && accessToken && !path.startsWith('/condos/properties')) {
        return NextResponse.redirect(new URL('/condos/properties', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
        */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.svg).*)',
    ],
}
