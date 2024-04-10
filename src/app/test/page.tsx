'use client';

import Test from '(@/components/chat/Test)';
import HowManyMsg from '(@/components/room/meetingChat/HowManyMsg)';
import { Suspense, useEffect } from 'react';

const Page = () => {
  // useEffect(() => {
  //   function noBack() {
  //     window.history.forward();
  //   }

  //   window.onload = noBack;
  //   window.onpageshow = function (event) {
  //     if (event.persisted) noBack();
  //   };

  //   return () => {
  //     window.onload = null;
  //     window.onpageshow = null;
  //   };
  // }, []);

  // const noBack = () => {
  //   history.pushState(null, '', location.href);
  //   window.onpopstate = function () {
  //     history.go(1);
  //   };
  // };

  return (
    <div>
      여기는 테스트 페이지
      <Suspense>
        <Test />
        <HowManyMsg />
      </Suspense>
    </div>
  );
};

export default Page;
