'use client';

import Test from '(@/components/mypage/Test)';
import { useEffect } from 'react';

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
      {/* <button onClick={noBack}>뒤로가기</button> */}
      <Test />
    </div>
  );
};

export default Page;
