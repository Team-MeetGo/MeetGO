// import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
// import { CustomMiddleware } from './middlewareType';

// export const checkSchoolMiddleware = (middleware: CustomMiddleware) => {
//   return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
//     const dap = request.headers.get('x-middleware-request-school');
//     console.log('받는애 ===>', dap);
//     return middleware(request, event, response);
//   };
// };
