import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { CustomMiddleware } from './middlewareType';
import { serverSupabase } from '@/utils/supabase/server';

export const chatRoomHandler = (middleware: CustomMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // 채팅창
    if (request.nextUrl.pathname.startsWith('/chat/')) {
      console.log('3');
      const supabase = serverSupabase();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      // 내가 들어가있는 방들
      const myChatRooms = [];
      const { data: myRooms } = await supabase
        .from('participants')
        .select('room_id')
        .eq('user_id', String(user?.id))
        .eq('isDeleted', false);

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
        if (myChatRooms.includes(request.nextUrl.pathname.replace('/chat/', ''))) {
          // 내가 들어가있는 방이면 OK
          console.log('4');
          return NextResponse.next();
        } else {
          // 내가 들어가있는 방이 아니면 홈으로
          console.log('5');
          return NextResponse.redirect(new URL('/', request.nextUrl.origin));
        }
      }
    }

    return middleware(request, event, NextResponse.next());
  };
};
