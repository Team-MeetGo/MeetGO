import Image from 'next/image';
import mainbanner from '../../../public/mainbanner.jpg';

const MainBanner = () => {
  return <Image src={mainbanner} alt="메인페이지 배너" className="max-w-[1440px] h-auto " priority={true} />;
};

export default MainBanner;
