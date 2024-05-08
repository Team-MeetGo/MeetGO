import { chain } from '@/middleware/chain';
import { chatRoomHandler } from '@/middleware/chatRouteHandler';
import { meetingRoomHandler } from '@/middleware/meetingRoomRounteHandler';
import { routeHandlerMiddleware } from '@/middleware/routeHandlerMiddleware';
import { schoolValidateMiddleware } from '@/middleware/schoolValidateMiddleware';
import { updateSessionMiddleware } from '@/middleware/updateSessionMiddleware';

const middlewareList = [
  updateSessionMiddleware
  // routeHandlerMiddleware,
  // schoolValidateMiddleware,
  // meetingRoomHandler,
  // chatRoomHandler
];

export default chain(middlewareList);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
