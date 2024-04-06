import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { CustomMiddleware } from './middlewareType';
import { serverSupabase } from '(@/utils/supabase/server)';

export const routeHandlerMiddleware = (middleware: CustomMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const supabase = serverSupabase();
    const { data } = await supabase.auth.getUser();
    // console.log(data);

    if (data.user) {
      // 로그인 한 유저
      if (request.nextUrl.pathname.startsWith('/users/login')) {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      } else if (request.nextUrl.pathname.startsWith('/users/join')) {
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      }
    } else {
      // 로그인 안한 유저
      if (request.nextUrl.pathname.startsWith('/mypage')) {
        // 마이페이지 접근 방지 + 로그인 페이지로 redirect
        return NextResponse.redirect(new URL('/users/login', request.url));
      } else if (request.nextUrl.pathname.startsWith('/meetingRoom')) {
        // 로비로 접근 불가
        return NextResponse.redirect(new URL('/users/login', request.url));
      }
    }
    const referer = request.headers.get('Referer');

    console.log('Request came from:', referer);
    return middleware(request, event, response);
  };
};
