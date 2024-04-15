'use client';

import ChatTest from '@/components/chat/ChatTest';
import { Suspense, useEffect, useRef, useState } from 'react';

const Page = () => {
  const [the, setThe] = useState(false);
  const [daa, setDaa] = useState(false);
  const check = useRef(false);

  // console.log('the', the);
  // console.log('daa', daa);
  // console.log(check.current);

  useEffect(() => {
    console.log('이거는 위에 함수');
    return () => {
      console.log('clean up 함수 안');
    };
  }, []);

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
      <Suspense>
        <ChatTest />
      </Suspense>
    </div>
  );
};

export default Page;
