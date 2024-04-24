'use client';

import { Button, Card, Skeleton } from '@nextui-org/react';
import React from 'react';

function LobbySkeleton() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const toggleLoad = () => {
    setIsLoaded((prev) => !prev);
  };
  return (
    <article className="w-[1112px] flex-col justify-center align-middle">
      <section className="mt-[64px] border-b border-gray2">
        <div className="flex flex-row w-full justify-between pb-[24px]">
          <Skeleton isLoaded={isLoaded} className="rounded-lg">
            <div className="h-[40px] rounded-lg bg-secondary"></div>
          </Skeleton>
          <div className="flex flex-row align-middle justify-center gap-4 mr-[56px]">
            <Skeleton isLoaded={isLoaded} className="rounded-lg">
              <div className="h-24 rounded-lg bg-secondary"></div>
            </Skeleton>
          </div>
        </div>
        <section className="w-100% flex flex-row items-center justify-content mb-[40px]"></section>
      </section>
      {/* <Card className="w-[200px] space-y-5 p-4" radius="lg">
        <Skeleton isLoaded={isLoaded} className="rounded-lg">
          <div className="h-24 rounded-lg bg-secondary"></div>
        </Skeleton>
        <div className="space-y-3">
          <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
            <div className="h-3 w-full rounded-lg bg-secondary"></div>
          </Skeleton>
          <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
            <div className="h-3 w-full rounded-lg bg-secondary-300"></div>
          </Skeleton>
          <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
            <div className="h-3 w-full rounded-lg bg-secondary-200"></div>
          </Skeleton>
        </div>
      </Card> */}
    </article>
  );
}

export default LobbySkeleton;
