import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { CustomMiddleware } from './middlewareType';
import { serverSupabase } from '(@/utils/supabase/server)';

export const meetingNchatRoomHandler = (middleware: CustomMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const referer = request.headers.get('Referer');
    // 새로고침하거나 직접 타이핑 해서 채팅방에 들어가려고 할 때,
    if (!referer && request.nextUrl.pathname.startsWith('/chat/')) {
      const supabase = serverSupabase();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      const myChatRooms = [];

      const { data: myRooms } = await supabase.from('participants').select('room_id').eq('user_id', String(user?.id));

      if (myRooms) {
        for (let room of myRooms) {
          const { data: myChatRoomId } = await supabase
            .from('chatting_room')
            .select('chatting_room_id')
            .eq('room_id', room.room_id)
            .eq('isActive', true);
          if (myChatRoomId && myChatRoomId.length) {
            myChatRooms.push(myChatRoomId[0].chatting_room_id);
          }
        }
      }
      if (myChatRooms.includes(request.nextUrl.pathname.replace('/chat/', ''))) {
        // 내가 들어가있는 방이면 OK
        return NextResponse.next();
      } else {
        // 내가 들어가있는 방이 아니면 홈으로
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      }
    }

    // if (
    //   // 다른 페이지에서(/meetingRoom/~~ + /chat/~~(현재창) 외의 모든 페이지)에서 뒤로가기로 채팅방으로 들어오려고 하는 경우
    //   !referer?.startsWith('http://localhost:3000/meetingRoom/') &&
    //   // !referer?.startsWith('http://localhost:3000/chat/') &&
    //   request.nextUrl.pathname.startsWith('/chat/')
    // ) {
    //   return NextResponse.redirect(new URL('/meetingRoom', request.url));
    // }
    console.log('어디서 왔니', referer);
    console.log('어디로 가니', request.nextUrl.pathname);
    return middleware(request, event, NextResponse.next());
  };
};
