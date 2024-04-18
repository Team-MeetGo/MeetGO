import Image from 'next/image';
import mainbanner_flower from '../../../public/mainbanner_flower.png';
import mainbanner_people from '../../../public/mainbanner_people.png';

const MainBanner = () => {
  return (
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
  );
};

export default MainBanner;
