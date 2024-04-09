'use client';

import GetMostLikedReivew from '(@/components/mainpage/getMostLikedReview)';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center justify-content">
      <div className="">배너</div>
      <div>
        <div className="max-w-[1160px] flex justify-end mr-[15px]">
          <Link href="/review/pageNumber/1">더보기</Link>
        </div>
        <GetMostLikedReivew />
      </div>
      <button onClick={() => location.replace('/test')}>test</button>
    </main>
  );
}
