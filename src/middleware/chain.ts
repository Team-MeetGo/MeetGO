import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { CustomMiddleware } from './middlewareType';

type MiddlewareFactory = (middleware: CustomMiddleware) => CustomMiddleware;

export const chain = (functions: MiddlewareFactory[], index = 0): CustomMiddleware => {
  const current = functions[index];

  if (current) {
    const next = chain(functions, index + 1);
    return current(next);
    // current(chain(functions, 1)) => current(current(chain(functions,2))) => current(current(chain(functions,3)))
  }

  // 마지막 순서일 때
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    return response;
  };
};
