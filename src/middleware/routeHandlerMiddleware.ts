import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { CustomMiddleware } from './middlewareType';
import { serverSupabase } from '@/utils/supabase/server';

export const routeHandlerMiddleware = (middleware: CustomMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const supabase = serverSupabase();
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      // 로그인 한 유저
      if (request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      } else if (request.nextUrl.pathname.startsWith('/join')) {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      }
    } else {
      // 로그인 안한 유저
      if (request.nextUrl.pathname.startsWith('/mypage')) {
        // 마이페이지 접근 방지 + 로그인 페이지로 redirect
        return NextResponse.redirect(new URL('/login', request.url));
      } else if (request.nextUrl.pathname.startsWith('/meetingRoom') || request.nextUrl.pathname.startsWith('/chat/')) {
        console.log('first');
        // 로비로 접근 불가
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
    return middleware(request, event, response);
  };
};
