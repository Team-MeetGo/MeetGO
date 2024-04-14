'use client';

import GetMostLikedReivew from '(@/components/mainpage/getMostLikedReview)';
import Image from 'next/image';
import mainbanner_flower from '../../public/mainbanner_flower.png';
import mainbanner_people from '../../public/mainbanner_people.png';

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center justify-content">
      <div className="w-full h-[600px] max-h-[600px] bg-gradient-to-main flex justify-center items-center">
        <Image src={mainbanner_flower} alt="메인페이지 배너_꽃" className="w-full h-[600px] absolute" />
        <div className="flex justify-center items-center">
          <Image src={mainbanner_people} alt="메인페이지 배너_사람" className="relative max-w-[432px] max-h-[432px]" />
          <div>
            <p className="relative text-[28px]">벚꽃 축제는 가고 싶은데 소개팅이 걱정되시나요?</p>
            <p className="relative text-[70px] font-bold">MeetGo 만나세요!</p>
          </div>
        </div>
      </div>
      <div className="mt-[120px]">
        <div>
          <GetMostLikedReivew />
        </div>
      </div>
      <button onClick={() => location.replace('/test')}>test</button>
    </main>
  );
}
