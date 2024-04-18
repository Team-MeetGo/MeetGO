import Image from 'next/image';
import mainbanner_flower from '../../public/mainbanner_flower.png';
import mainbanner_people from '../../public/mainbanner_people.png';
import Link from 'next/link';
import GetMostLikedReivew from '@/components/mainpage/GetMostLikedReview';

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
      <div className="my-12">
        <GetMostLikedReivew />
      </div>
      <div className="w-full h-[208px] bg-gradient-to-main2 flex justify-center items-center mb-[88px]">
        <div className="flex items-center">
          <p className="text-[30px] text-white mr-[60px]">현재 많은 분들이 기다리고 있어요~</p>
          <Link
            className="bg-transparant border-1 rounded-xl border-white max-w-[267px] h-[60px] text-[18px] text-white pt-[13px] pb-[13px] pl-[60px] pr-[60px] hover:bg-white hover:text-mainColor font-bold"
            href="/meetingRoom"
          >
            로비로 바로가기
          </Link>
        </div>
      </div>
    </main>
  );
}
