import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { CustomMiddleware } from './middlewareType';
import { serverSupabase } from '(@/utils/supabase/server)';

export const routeHandlerMiddleware = (middleware: CustomMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const supabase = serverSupabase();
    const { data } = await supabase.auth.getUser();
    console.log(data);

    if (!data.user && request.nextUrl.pathname.startsWith('/meetingRoom/')) {
      return NextResponse.redirect(new URL('/', request.nextUrl.origin));
    }
    if (data.user && request.nextUrl.pathname.startsWith('/users/login')) {
      return NextResponse.redirect(new URL('/', request.nextUrl.origin));
    }

    return middleware(request, event, response);
  };
};
