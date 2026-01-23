import { NextResponse ,NextRequest} from "next/server";


import {getToken} from 'next-auth/jwt'
export async function middleware(request:NextRequest){

    const token = await getToken({req:request})
    const {pathname}  = request.nextUrl

    if(token && 
        (
            pathname.startsWith('/sign-in')||
            pathname.startsWith('/sign-up')||
            pathname.startsWith('/verify')
            
        )
    ){
         return NextResponse.redirect(new URL('/dashboard',request.url))
    }


     if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  if (token && pathname === "/") {
  return NextResponse.redirect(new URL("/dashboard", request.url))
}


  return NextResponse.next()

    }


    export const config = {
        matcher:[
            '/sign-in',
            '/sign-up',
            '/',
            '/dashboard/:path*',
            '/verify/:path*'
        
        ]
    }