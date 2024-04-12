'use client';

import HowManyMsg from '(@/components/room/meetingChat/HowManyMsg)';
import { Suspense, useEffect, useRef, useState } from 'react';

const Page = () => {
  const [the, setThe] = useState(false);
  const [daa, setDaa] = useState(false);
  const check = useRef(false);

  console.log('the', the);
  console.log('daa', daa);
  console.log(check.current);

  // useEffect(() => {
  //   setThe(true);
  // }, [daa]);

  useEffect(() => {
    console.log('check.current =>', check.current);
    if (the) {
      console.log('clean up 함수 안');
      // if (check.current) {
      //   console.log('abc');
      // }
    }
  }, [daa]);

  // useEffect(() => {
  //   check.current = true;
  // }, []);

  return (
    <div>
      여기는 테스트 페이지
      <button
        onClick={() => {
          setDaa(true);
        }}
      >
        클릭
      </button>
      <button
        onClick={() => {
          setThe(true);
          check.current = true;
        }}
      >
        이거이거
      </button>
    </div>
  );
};

export default Page;
