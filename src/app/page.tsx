'use client';

import GetMostLikedReivew from '(@/components/mainpage/getMostLikedReview)';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center justify-content">
      <div className="w-full h-[600px] max-h-[600px] bg-gray-200 flex justify-center items-center">배너</div>
      <div className="mt-[120px]">
        <div>
          <GetMostLikedReivew />
        </div>
      </div>
      <button onClick={() => location.replace('/test')}>test</button>
    </main>
  );
}
