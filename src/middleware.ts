import { chain } from './middleware/chain';
import { meetingNchatRoomHandler } from './middleware/meetingNChatRouteHandler';
import { routeHandlerMiddleware } from './middleware/routeHandlerMiddleware';
import { schoolValidateMiddleware } from './middleware/schoolValidateMiddleware';
import { updateSessionMiddleware } from './middleware/updateSessionMiddleware';

const middlewareList = [
  updateSessionMiddleware,
  routeHandlerMiddleware,
  schoolValidateMiddleware,
  meetingNchatRoomHandler
];

export default chain(middlewareList);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
