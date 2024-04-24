import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { CustomMiddleware } from './middlewareType';
import { serverSupabase } from '@/utils/supabase/server';

export const meetingRoomHandler = (middleware: CustomMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    // 수락창
    if (request.nextUrl.pathname.startsWith('/meetingRoom/')) {
      console.log('0');
      const supabase = serverSupabase();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      // 내가 들어가있는 방들
      const { data: myRooms } = await supabase
        .from('participants')
        .select('room_id')
        .eq('user_id', String(user?.id))
        .eq('isDeleted', false);
      if (
        myRooms &&
        myRooms.map((room) => room.room_id).includes(request.nextUrl.pathname.replace('/meetingRoom/', ''))
      ) {
        console.log('1');
        return NextResponse.next();
      } else {
        console.log('2');
        return NextResponse.redirect(new URL('/', request.nextUrl.origin));
      }
    }

    return middleware(request, event, NextResponse.next());
  };
};
