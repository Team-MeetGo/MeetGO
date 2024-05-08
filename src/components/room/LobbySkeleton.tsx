'use client';

import { Card, Skeleton } from '@nextui-org/react';
import React from 'react';

const LobbySkeleton = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-content">
      <main className="flex flex-col items-center justify-content min-w-[1000px]">
        <article className="w-[1112px] flex-col justify-center align-middle">
          <section className="mt-[64px] ">
            <section className="flex flex-row w-m-[1112px] justify-between mb-[24px] mx-[56px]">
              <Skeleton isLoaded={isLoaded} className="rounded-lg">
                <div className="h-[40px] w-[100px] rounded-lg bg-secondary"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="rounded-lg">
                <div className="h-[40px] w-[100px] rounded-lg bg-secondary"></div>
              </Skeleton>
            </section>
            <section className="flex flex-row align-middle justify-center gap-4">
              <Card className="w-[333px] h-[241px] p-6 space-y-5 gap-2" radius="lg">
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[16px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[26px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary-300"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                    <div className="h-[14px] w-full rounded-lg bg-secondary-200"></div>
                  </Skeleton>
                </div>
              </Card>
              <Card className="w-[333px] h-[241px] p-6 space-y-5 gap-2" radius="lg">
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[16px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[26px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary-300"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                    <div className="h-[14px] w-full rounded-lg bg-secondary-200"></div>
                  </Skeleton>
                </div>
              </Card>
              <Card className="w-[333px] h-[241px] p-6 space-y-5 gap-2" radius="lg">
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[16px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[26px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary-300"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                    <div className="h-[14px] w-full rounded-lg bg-secondary-200"></div>
                  </Skeleton>
                </div>
              </Card>
            </section>
            <div className="border-b border-gray2 h-[40px]"></div>
            <section className="flex flex-row w-m-[1112px] justify-between mb-[24px] mx-[56px] mt-[40px]">
              <Skeleton isLoaded={isLoaded} className="rounded-lg">
                <div className="h-[40px] w-[100px] rounded-lg bg-secondary"></div>
              </Skeleton>
              <Skeleton isLoaded={isLoaded} className="rounded-lg">
                <div className="h-[40px] w-[100px] rounded-lg bg-secondary"></div>
              </Skeleton>
            </section>
            <section className="flex flex-row align-middle justify-center gap-4">
              <Card className="w-[333px] h-[241px] p-6 space-y-5 gap-2" radius="lg">
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[16px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[26px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary-300"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                    <div className="h-[14px] w-full rounded-lg bg-secondary-200"></div>
                  </Skeleton>
                </div>
              </Card>
              <Card className="w-[333px] h-[241px] p-6 space-y-5 gap-2" radius="lg">
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[16px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[26px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary-300"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                    <div className="h-[14px] w-full rounded-lg bg-secondary-200"></div>
                  </Skeleton>
                </div>
              </Card>
              <Card className="w-[333px] h-[241px] p-6 space-y-5 gap-2" radius="lg">
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[16px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className="rounded-lg">
                  <div className="h-[26px] rounded-lg bg-secondary"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton isLoaded={isLoaded} className="w-3/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-4/5 rounded-lg">
                    <div className="h-[16px] w-full rounded-lg bg-secondary-300"></div>
                  </Skeleton>
                  <Skeleton isLoaded={isLoaded} className="w-2/5 rounded-lg">
                    <div className="h-[14px] w-full rounded-lg bg-secondary-200"></div>
                  </Skeleton>
                </div>
              </Card>
            </section>
          </section>
        </article>
      </main>
    </div>
  );
};

export default LobbySkeleton;
