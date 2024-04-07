import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { CustomMiddleware } from './middlewareType';

export const chatRoomHandler = (middleware: CustomMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const referer = request.headers.get('Referer');
    //직접 타이핑 해서 채팅창에 들어가려고 하는 경우
    // if (!referer && request.nextUrl.pathname.startsWith('/chat/')) {
    //   return NextResponse.redirect(new URL('/meetingRoom', request.url));
    // }
    // // 다른 페이지에서(/meeting/~~ 외의 모든 페이지) 뒤로가기해서 채팅방으로 들어오려고 하는 경우
    // if (!referer?.startsWith('http://localhost:3000/meeting/') && request.nextUrl.pathname.startsWith('/chat/')) {
    //   return NextResponse.redirect(new URL('/meetingRoom', request.url));
    // }

    return middleware(request, event, NextResponse.next());
  };
};
