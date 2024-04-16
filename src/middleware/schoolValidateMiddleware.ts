import { serverSupabase } from '@/utils/supabase/server';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { CustomMiddleware } from './middlewareType';

export const schoolValidateMiddleware = (middleware: CustomMiddleware) => {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const supabase = serverSupabase();
    const { data } = await supabase.auth.getUser();
    const { data: isValidate } = await supabase
      .from('users')
      .select('isValidate')
      .eq('user_id', data.user?.id as string);

    if (isValidate && !isValidate[0].isValidate && request.nextUrl.pathname.startsWith('/meetingRoom')) {
      return NextResponse.redirect(new URL('/mypage', request.url));
    }
    return middleware(request, event, NextResponse.next());
  };
};
